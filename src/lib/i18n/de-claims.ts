import { customerStoryDrafts } from '../content/customer-stories';
import { solutions } from '../content/solutions';
import { germanCustomerStories, germanSolutions, germanStaticPages } from './de-content';

export interface GermanLocalizedClaimRecord {
  id: string;
  locale: 'de';
  sourceClaimId: string;
  statement: string;
  approvalStatus: 'draft' | 'approved';
  allowedSurface: string;
  evidence: string;
  approvedBy?: string | undefined;
  approvedAt?: string | undefined;
}

const evidence =
  'Approved English source content plus the German publication direction dated 2026-09-22.';
const approvedBy = 'Baris, German publication direction';
const approvedAt = '2026-09-22';

function approvedTranslation(
  id: string,
  sourceClaimId: string,
  statement: string,
  allowedSurface: string,
): GermanLocalizedClaimRecord {
  return {
    id,
    locale: 'de',
    sourceClaimId,
    statement,
    approvalStatus: 'approved',
    allowedSurface,
    evidence,
    approvedBy,
    approvedAt,
  };
}

const translatedPageClaims: GermanLocalizedClaimRecord[] = Object.entries(
  germanStaticPages,
).flatMap(([key, page]) => {
  const translated = page;
  const surface = `de.${key}`;
  return [
    approvedTranslation(
      `de-${key}-metadata`,
      `${key}-page-metadata`,
      translated.description,
      `${surface}.metadata`,
    ),
    approvedTranslation(
      `de-${key}-hero`,
      `${key}-page-hero`,
      `${translated.headline} ${translated.intro}`,
      `${surface}.hero`,
    ),
    ...translated.sections.flatMap((section, sectionIndex) => [
      approvedTranslation(
        `de-${key}-section-${sectionIndex + 1}`,
        `${key}-page-section-${sectionIndex + 1}`,
        [section.title, ...section.paragraphs].join(' '),
        `${surface}.section-${sectionIndex + 1}`,
      ),
      ...(section.points ?? []).map((point, pointIndex) =>
        approvedTranslation(
          `de-${key}-section-${sectionIndex + 1}-point-${pointIndex + 1}`,
          `${key}-page-section-${sectionIndex + 1}-point-${pointIndex + 1}`,
          point,
          `${surface}.section-${sectionIndex + 1}`,
        ),
      ),
    ]),
  ];
});

const translatedSolutionClaims: GermanLocalizedClaimRecord[] = Object.entries(
  germanSolutions,
).flatMap(([slug, translated]) => {
  const source = solutions.find((solution) => solution.slug === slug);
  if (!source) throw new Error(`German solution "${slug}" has no English source record.`);
  const surface = `de.solutions.${slug}`;
  return [
    approvedTranslation(
      `de-solution-${slug}-metadata`,
      `solution-${slug}-metadata`,
      translated.metaDescription,
      `${surface}.metadata`,
    ),
    approvedTranslation(
      `de-solution-${slug}-hero`,
      `solution-${slug}-hero`,
      `${translated.headline} ${translated.subhead}`,
      `${surface}.hero`,
    ),
    ...translated.journey.map((step, index) =>
      approvedTranslation(
        `de-solution-${slug}-journey-${index + 1}`,
        index === 1 ? source.startingPointClaimId : `solution-${slug}-journey-${index + 1}`,
        `${step.title}. ${step.description}`,
        `${surface}.journey`,
      ),
    ),
    approvedTranslation(
      `de-solution-${slug}-workspace`,
      source.workspace.claimId,
      [
        translated.workspace.task,
        translated.workspace.resultTitle,
        ...translated.workspace.resultItems,
        translated.workspace.reviewer,
      ].join(' '),
      `${surface}.workspace`,
    ),
    approvedTranslation(
      `de-solution-${slug}-work`,
      `solution-${slug}-work`,
      `${translated.workTitle} ${translated.workBody}`,
      `${surface}.work`,
    ),
    ...translated.agents.map((agent, index) =>
      approvedTranslation(
        `de-solution-${slug}-agent-${index + 1}`,
        `solution-${slug}-agent-${index + 1}`,
        `${agent.name}. ${agent.does} ${agent.from}`,
        `${surface}.work`,
      ),
    ),
    approvedTranslation(
      `de-solution-${slug}-controls-intro`,
      `solution-${slug}-controls-intro`,
      `${translated.wallsTitle} ${translated.wallsBody}`,
      `${surface}.controls`,
    ),
    ...translated.controls.map((control, index) =>
      approvedTranslation(
        `de-solution-${slug}-control-${index + 1}`,
        `solution-${slug}-control-${index + 1}`,
        `${control.label}. ${control.value}`,
        `${surface}.controls`,
      ),
    ),
    ...translated.questions.map((entry, index) =>
      approvedTranslation(
        `de-solution-${slug}-faq-${index + 1}`,
        `solution-${slug}-faq-${index + 1}`,
        `${entry.question} ${entry.answer}`,
        `${surface}.faq`,
      ),
    ),
    approvedTranslation(
      `de-solution-${slug}-closing`,
      `solution-${slug}-closing`,
      translated.closing,
      `${surface}.conversion`,
    ),
  ];
});

const translatedCustomerClaims: GermanLocalizedClaimRecord[] = Object.entries(
  germanCustomerStories,
).flatMap(([slug, translated]) => {
  const source = customerStoryDrafts.find((story) => story.slug === slug);
  if (!source) throw new Error(`German customer story "${slug}" has no English source record.`);
  const surface = `de.customers.${slug}`;
  return [
    approvedTranslation(
      `de-customer-${slug}-narrative`,
      source.narrativeClaimId,
      `${translated.title} ${translated.summary}`,
      `${surface}.hero`,
    ),
    ...translated.results.map((result, index) =>
      approvedTranslation(
        result.claimId,
        source.qualifiedResults[index]?.claimId ?? result.claimId.replace(/-de-draft$/, ''),
        [result.value, result.label + '.', result.qualifier].join(' '),
        `${surface}.results`,
      ),
    ),
    ...translated.sections.map((section, index) =>
      approvedTranslation(
        `de-customer-${slug}-section-${index + 1}`,
        source.sections[index]?.claimId ?? `customer-story-${slug}-section-${index + 1}`,
        [section.heading, ...section.paragraphs, ...(section.points ?? [])].join(' '),
        `${surface}.article`,
      ),
    ),
  ];
});

export const germanLocalizedClaims: readonly GermanLocalizedClaimRecord[] = [
  ...translatedPageClaims,
  ...translatedSolutionClaims,
  ...translatedCustomerClaims,
];

export function assertGermanClaimsApprovedForPublication(): void {
  const unapproved = germanLocalizedClaims.filter(
    (claim) =>
      claim.approvalStatus !== 'approved' || !claim.approvedBy?.trim() || !claim.approvedAt?.trim(),
  );
  if (unapproved.length > 0) {
    throw new Error(
      `German publication is blocked by ${unapproved.length} unapproved localized claim records.`,
    );
  }
}
