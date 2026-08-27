from __future__ import annotations

import importlib.util
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = REPO_ROOT / "tools" / "check_agent_skills.py"
SPEC = importlib.util.spec_from_file_location("check_agent_skills", MODULE_PATH)
assert SPEC and SPEC.loader
validator = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(validator)


def write_skill(root: Path, directory: str, declared_name: str | None = None) -> None:
    declared_name = declared_name or directory
    skill_dir = root / ".agents" / "skills" / directory
    (skill_dir / "agents").mkdir(parents=True)
    (skill_dir / "references").mkdir()
    (skill_dir / "SKILL.md").write_text(
        "---\n"
        f"name: {declared_name}\n"
        "description: Use this focused skill for a realistic repository task and its verification.\n"
        "---\n\n"
        f"# {declared_name}\n\n"
        "Read [the reference](references/checklist.md).\n",
        encoding="utf-8",
    )
    (skill_dir / "references" / "checklist.md").write_text(
        "# Checklist\n\n- Verify the behavior.\n",
        encoding="utf-8",
    )
    (skill_dir / "agents" / "openai.yaml").write_text(
        "interface:\n"
        f'  display_name: "{declared_name}"\n'
        '  short_description: "Verify focused repository behavior"\n'
        f'  default_prompt: "Use ${declared_name} to verify this change."\n',
        encoding="utf-8",
    )


def write_valid_repository(root: Path) -> None:
    for skill_name in validator.EXPECTED_SKILLS:
        write_skill(root, skill_name)
    registrations = "\n".join(f"- ${name}" for name in validator.EXPECTED_SKILLS)
    (root / "AGENTS.md").write_text(
        "# Repository Instructions\n\n"
        "## Skills-first rule\n\n"
        f"{registrations}\n",
        encoding="utf-8",
    )


class AgentSkillValidatorTests(unittest.TestCase):
    def test_current_repository_is_valid(self) -> None:
        self.assertEqual([], validator.validate_repository(REPO_ROOT))

    def test_rejects_malformed_frontmatter(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            write_valid_repository(root)
            skill_file = (
                root
                / ".agents"
                / "skills"
                / validator.EXPECTED_SKILLS[0]
                / "SKILL.md"
            )
            skill_file.write_text("name: missing-delimiters\n", encoding="utf-8")
            errors = validator.validate_repository(root)
            self.assertTrue(any("frontmatter must start" in error for error in errors))

    def test_rejects_missing_expected_skill(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            write_valid_repository(root)
            missing = validator.EXPECTED_SKILLS[0]
            missing_dir = root / ".agents" / "skills" / missing
            for path in sorted(missing_dir.rglob("*"), reverse=True):
                if path.is_file():
                    path.unlink()
                else:
                    path.rmdir()
            missing_dir.rmdir()
            errors = validator.validate_repository(root)
            self.assertTrue(any(f"missing expected skill '{missing}'" in error for error in errors))

    def test_rejects_unexpected_skill(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            write_valid_repository(root)
            write_skill(root, "unexpected-skill")
            errors = validator.validate_repository(root)
            self.assertTrue(any("unexpected skill 'unexpected-skill'" in error for error in errors))

    def test_rejects_directory_and_name_mismatch(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            write_valid_repository(root)
            skill_name = validator.EXPECTED_SKILLS[0]
            skill_file = root / ".agents" / "skills" / skill_name / "SKILL.md"
            text = skill_file.read_text(encoding="utf-8")
            skill_file.write_text(
                text.replace(f"name: {skill_name}", "name: mismatched-name"),
                encoding="utf-8",
            )
            errors = validator.validate_repository(root)
            self.assertTrue(any("does not match directory" in error for error in errors))

    def test_rejects_duplicate_declared_names(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            write_valid_repository(root)
            first, second = validator.EXPECTED_SKILLS[:2]
            skill_file = root / ".agents" / "skills" / second / "SKILL.md"
            text = skill_file.read_text(encoding="utf-8")
            skill_file.write_text(
                text.replace(f"name: {second}", f"name: {first}"),
                encoding="utf-8",
            )
            errors = validator.validate_repository(root)
            self.assertTrue(any("duplicate declared name" in error for error in errors))

    def test_rejects_empty_description(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            write_valid_repository(root)
            skill_name = validator.EXPECTED_SKILLS[0]
            skill_file = root / ".agents" / "skills" / skill_name / "SKILL.md"
            text = skill_file.read_text(encoding="utf-8")
            skill_file.write_text(
                text.replace(
                    "description: Use this focused skill for a realistic repository task and its verification.",
                    "description:",
                ),
                encoding="utf-8",
            )
            errors = validator.validate_repository(root)
            self.assertTrue(any("description must not be empty" in error for error in errors))

    def test_rejects_broken_local_reference(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            write_valid_repository(root)
            skill_name = validator.EXPECTED_SKILLS[0]
            skill_file = root / ".agents" / "skills" / skill_name / "SKILL.md"
            skill_file.write_text(
                skill_file.read_text(encoding="utf-8").replace(
                    "references/checklist.md", "references/missing.md"
                ),
                encoding="utf-8",
            )
            errors = validator.validate_repository(root)
            self.assertTrue(any("broken local link" in error for error in errors))

    def test_rejects_reference_that_escapes_skill(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            write_valid_repository(root)
            skill_name = validator.EXPECTED_SKILLS[0]
            skill_file = root / ".agents" / "skills" / skill_name / "SKILL.md"
            skill_file.write_text(
                skill_file.read_text(encoding="utf-8").replace(
                    "references/checklist.md", "../../../../AGENTS.md"
                ),
                encoding="utf-8",
            )
            errors = validator.validate_repository(root)
            self.assertTrue(any("local link escapes its skill" in error for error in errors))

    def test_rejects_invalid_interface_metadata(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            write_valid_repository(root)
            skill_name = validator.EXPECTED_SKILLS[0]
            interface_file = (
                root / ".agents" / "skills" / skill_name / "agents" / "openai.yaml"
            )
            text = interface_file.read_text(encoding="utf-8")
            interface_file.write_text(
                text.replace(
                    'short_description: "Verify focused repository behavior"',
                    'short_description: "Too short"',
                ),
                encoding="utf-8",
            )
            errors = validator.validate_repository(root)
            self.assertTrue(any("short_description must be 25-64" in error for error in errors))

    def test_rejects_unresolved_skill_placeholder(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            write_valid_repository(root)
            skill_name = validator.EXPECTED_SKILLS[0]
            skill_file = root / ".agents" / "skills" / skill_name / "SKILL.md"
            skill_file.write_text(
                skill_file.read_text(encoding="utf-8") + "\nTODO: replace this.\n",
                encoding="utf-8",
            )
            errors = validator.validate_repository(root)
            self.assertTrue(any("unresolved TODO marker" in error for error in errors))

    def test_rejects_missing_agents_registration(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            write_valid_repository(root)
            missing = validator.EXPECTED_SKILLS[0]
            agents_file = root / "AGENTS.md"
            agents_file.write_text(
                agents_file.read_text(encoding="utf-8").replace(f"- ${missing}\n", ""),
                encoding="utf-8",
            )
            errors = validator.validate_repository(root)
            self.assertTrue(any(f"missing registration for ${missing}" in error for error in errors))

    def test_rejects_out_of_scope_domain_material(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            write_valid_repository(root)
            marker = validator.OUT_OF_SCOPE_DOMAIN_MARKERS[1]
            agents_file = root / "AGENTS.md"
            agents_file.write_text(
                agents_file.read_text(encoding="utf-8") + f"\n{marker}\n",
                encoding="utf-8",
            )
            errors = validator.validate_repository(root)
            self.assertTrue(any("out-of-scope domain marker" in error for error in errors))

    def test_skills_only_mode_allows_agents_to_be_created_last(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            for skill_name in validator.EXPECTED_SKILLS:
                write_skill(root, skill_name)
            self.assertEqual(
                [],
                validator.validate_repository(root, require_agents=False),
            )


if __name__ == "__main__":
    unittest.main()
