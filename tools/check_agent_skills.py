#!/usr/bin/env python3
"""Validate repository-local Codex skills and their AGENTS.md registration."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from urllib.parse import unquote

EXPECTED_SKILLS = (
    "enterprise-ai-claims-and-content",
    "enterprise-ai-component-intake",
    "enterprise-ai-feature-audit",
    "enterprise-ai-release-audit",
    "enterprise-ai-testing",
    "enterprise-ai-web-development",
)

SKILL_NAME_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
MARKDOWN_LINK_PATTERN = re.compile(r"(?<!!)\[[^\]]*\]\(([^)]+)\)")
OUT_OF_SCOPE_DOMAIN_MARKERS = (
    "sector" + "-run",
    "game" + "play",
    "unity" + "engine",
    "player" + " controller",
    "combat" + " system",
)


def _label(path: Path, repo_root: Path) -> str:
    try:
        return str(path.relative_to(repo_root))
    except ValueError:
        return str(path)


def _unquote_scalar(value: str) -> str:
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1]
    return value


def parse_frontmatter(path: Path) -> tuple[dict[str, str], list[str]]:
    """Parse the intentionally small SKILL.md frontmatter contract."""
    errors: list[str] = []
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        return {}, [f"{path}: cannot read file: {exc}"]

    if not lines or lines[0] != "---":
        return {}, [f"{path}: frontmatter must start on the first line"]

    try:
        closing_index = lines.index("---", 1)
    except ValueError:
        return {}, [f"{path}: frontmatter is missing its closing delimiter"]

    metadata: dict[str, str] = {}
    for line_number, line in enumerate(lines[1:closing_index], start=2):
        if not line.strip() or ":" not in line:
            errors.append(f"{path}:{line_number}: invalid frontmatter entry")
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = _unquote_scalar(value.strip())
        if key in metadata:
            errors.append(f"{path}:{line_number}: duplicate frontmatter key '{key}'")
        metadata[key] = value

    required = {"name", "description"}
    missing = sorted(required - metadata.keys())
    extra = sorted(metadata.keys() - required)
    if missing:
        errors.append(f"{path}: missing frontmatter keys: {', '.join(missing)}")
    if extra:
        errors.append(f"{path}: unsupported frontmatter keys: {', '.join(extra)}")
    return metadata, errors


def parse_interface_metadata(path: Path) -> tuple[dict[str, str], list[str]]:
    """Validate the controlled interface-only subset of agents/openai.yaml."""
    errors: list[str] = []
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        return {}, [f"{path}: cannot read file: {exc}"]

    if not lines or lines[0] != "interface:":
        return {}, [f"{path}: expected 'interface:' as the first line"]

    values: dict[str, str] = {}
    for line_number, line in enumerate(lines[1:], start=2):
        if not line.strip():
            continue
        if not line.startswith("  ") or line.startswith("   ") or ":" not in line:
            errors.append(f"{path}:{line_number}: only two-space interface fields are allowed")
            continue
        key, raw_value = line.strip().split(":", 1)
        raw_value = raw_value.strip()
        if not (len(raw_value) >= 2 and raw_value[0] == raw_value[-1] == '"'):
            errors.append(f"{path}:{line_number}: string values must use double quotes")
            continue
        if key in values:
            errors.append(f"{path}:{line_number}: duplicate interface key '{key}'")
        values[key] = raw_value[1:-1]

    required = {"display_name", "short_description", "default_prompt"}
    missing = sorted(required - values.keys())
    extra = sorted(values.keys() - required)
    if missing:
        errors.append(f"{path}: missing interface keys: {', '.join(missing)}")
    if extra:
        errors.append(f"{path}: unsupported interface keys: {', '.join(extra)}")
    return values, errors


def _validate_local_links(markdown_path: Path, skill_root: Path, repo_root: Path) -> list[str]:
    errors: list[str] = []
    text = markdown_path.read_text(encoding="utf-8")
    for raw_target in MARKDOWN_LINK_PATTERN.findall(text):
        target = raw_target.strip()
        if target.startswith(("#", "http://", "https://", "mailto:")):
            continue
        target = target.split("#", 1)[0].strip("<>")
        if not target:
            continue
        resolved = (markdown_path.parent / unquote(target)).resolve()
        try:
            resolved.relative_to(skill_root.resolve())
        except ValueError:
            errors.append(
                f"{_label(markdown_path, repo_root)}: local link escapes its skill: {raw_target}"
            )
            continue
        if not resolved.exists():
            errors.append(
                f"{_label(markdown_path, repo_root)}: broken local link: {raw_target}"
            )
    return errors


def validate_skill(skill_dir: Path, repo_root: Path) -> tuple[str | None, list[str]]:
    errors: list[str] = []
    skill_name = skill_dir.name
    relative_dir = _label(skill_dir, repo_root)

    if len(skill_name) > 64 or not SKILL_NAME_PATTERN.fullmatch(skill_name):
        errors.append(f"{relative_dir}: invalid skill directory name")

    skill_file = skill_dir / "SKILL.md"
    if not skill_file.is_file():
        return None, errors + [f"{relative_dir}: missing SKILL.md"]

    metadata, metadata_errors = parse_frontmatter(skill_file)
    errors.extend(
        error.replace(str(skill_file), _label(skill_file, repo_root))
        for error in metadata_errors
    )
    declared_name = metadata.get("name")
    description = metadata.get("description", "")
    if declared_name and declared_name != skill_name:
        errors.append(
            f"{_label(skill_file, repo_root)}: name '{declared_name}' does not match directory '{skill_name}'"
        )
    if not description.strip():
        errors.append(f"{_label(skill_file, repo_root)}: description must not be empty")
    if len(description) > 1024:
        errors.append(f"{_label(skill_file, repo_root)}: description exceeds 1024 characters")

    skill_text = skill_file.read_text(encoding="utf-8")
    if "TODO" in skill_text:
        errors.append(f"{_label(skill_file, repo_root)}: unresolved TODO marker")
    if len(skill_text.splitlines()) > 500:
        errors.append(f"{_label(skill_file, repo_root)}: SKILL.md exceeds 500 lines")

    interface_file = skill_dir / "agents" / "openai.yaml"
    if not interface_file.is_file():
        errors.append(f"{relative_dir}: missing agents/openai.yaml")
    else:
        interface, interface_errors = parse_interface_metadata(interface_file)
        errors.extend(
            error.replace(str(interface_file), _label(interface_file, repo_root))
            for error in interface_errors
        )
        short_description = interface.get("short_description", "")
        if short_description and not 25 <= len(short_description) <= 64:
            errors.append(
                f"{_label(interface_file, repo_root)}: short_description must be 25-64 characters"
            )
        prompt = interface.get("default_prompt", "")
        if prompt and f"${skill_name}" not in prompt:
            errors.append(
                f"{_label(interface_file, repo_root)}: default_prompt must mention ${skill_name}"
            )

    for markdown_path in skill_dir.rglob("*.md"):
        errors.extend(_validate_local_links(markdown_path, skill_dir, repo_root))

    scoped_text = "\n".join(
        path.read_text(encoding="utf-8")
        for path in skill_dir.rglob("*")
        if path.is_file() and path.suffix in {".md", ".yaml"}
    ).lower()
    for marker in OUT_OF_SCOPE_DOMAIN_MARKERS:
        if marker in scoped_text:
            errors.append(f"{relative_dir}: contains out-of-scope domain marker '{marker}'")

    return declared_name, errors


def validate_agents_file(repo_root: Path) -> list[str]:
    agents_path = repo_root / "AGENTS.md"
    if not agents_path.is_file():
        return ["AGENTS.md: missing root governance file"]

    text = agents_path.read_text(encoding="utf-8")
    errors: list[str] = []
    for skill_name in EXPECTED_SKILLS:
        if f"${skill_name}" not in text:
            errors.append(f"AGENTS.md: missing registration for ${skill_name}")
    if "Skills-first rule" not in text:
        errors.append("AGENTS.md: missing the skills-first rule")
    lower_text = text.lower()
    for marker in OUT_OF_SCOPE_DOMAIN_MARKERS:
        if marker in lower_text:
            errors.append(f"AGENTS.md: contains out-of-scope domain marker '{marker}'")
    return errors


def validate_repository(repo_root: Path, require_agents: bool = True) -> list[str]:
    repo_root = repo_root.resolve()
    skills_root = repo_root / ".agents" / "skills"
    if not skills_root.is_dir():
        return [".agents/skills: directory is missing"]

    skill_dirs = sorted(path for path in skills_root.iterdir() if path.is_dir())
    actual_dirs = {path.name for path in skill_dirs}
    expected_dirs = set(EXPECTED_SKILLS)
    errors: list[str] = []

    for missing in sorted(expected_dirs - actual_dirs):
        errors.append(f".agents/skills: missing expected skill '{missing}'")
    for unexpected in sorted(actual_dirs - expected_dirs):
        errors.append(f".agents/skills: unexpected skill '{unexpected}'")

    declared_names: dict[str, list[str]] = {}
    for skill_dir in skill_dirs:
        declared_name, skill_errors = validate_skill(skill_dir, repo_root)
        errors.extend(skill_errors)
        if declared_name:
            declared_names.setdefault(declared_name, []).append(skill_dir.name)

    for declared_name, directories in sorted(declared_names.items()):
        if len(directories) > 1:
            errors.append(
                f".agents/skills: duplicate declared name '{declared_name}' in {', '.join(directories)}"
            )

    if require_agents:
        errors.extend(validate_agents_file(repo_root))
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root",
        type=Path,
        default=Path(__file__).resolve().parents[1],
        help="Repository root (defaults to this script's parent repository)",
    )
    parser.add_argument(
        "--skills-only",
        action="store_true",
        help="Validate skills before the root AGENTS.md is created",
    )
    args = parser.parse_args()

    errors = validate_repository(args.root, require_agents=not args.skills_only)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    suffix = " and AGENTS.md" if not args.skills_only else ""
    print(f"Validated {len(EXPECTED_SKILLS)} repository skills{suffix}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
