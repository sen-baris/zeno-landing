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
  'Machine translation of the corresponding approved English content. Exact German wording requires approval before publication.';

function draft(
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
    approvalStatus: 'draft',
    allowedSurface,
    evidence,
  };
}

const translatedPageClaims: GermanLocalizedClaimRecord[] = Object.entries(
  germanStaticPages,
).flatMap(([key, page]) => {
  const translated = page;
  const surface = `de.${key}`;
  return [
    draft(
      `de-${key}-metadata`,
      `${key}-page-metadata`,
      translated.description,
      `${surface}.metadata`,
    ),
    draft(
      `de-${key}-hero`,
      `${key}-page-hero`,
      `${translated.headline} ${translated.intro}`,
      `${surface}.hero`,
    ),
    ...translated.sections.flatMap((section, sectionIndex) => [
      draft(
        `de-${key}-section-${sectionIndex + 1}`,
        `${key}-page-section-${sectionIndex + 1}`,
        [section.title, ...section.paragraphs].join(' '),
        `${surface}.section-${sectionIndex + 1}`,
      ),
      ...(section.points ?? []).map((point, pointIndex) =>
        draft(
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
    draft(
      `de-solution-${slug}-metadata`,
      `solution-${slug}-metadata`,
      translated.metaDescription,
      `${surface}.metadata`,
    ),
    draft(
      `de-solution-${slug}-hero`,
      `solution-${slug}-hero`,
      `${translated.headline} ${translated.subhead}`,
      `${surface}.hero`,
    ),
    ...translated.journey.map((step, index) =>
      draft(
        `de-solution-${slug}-journey-${index + 1}`,
        index === 1 ? source.startingPointClaimId : `solution-${slug}-journey-${index + 1}`,
        `${step.title}. ${step.description}`,
        `${surface}.journey`,
      ),
    ),
    draft(
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
    draft(
      `de-solution-${slug}-work`,
      `solution-${slug}-work`,
      `${translated.workTitle} ${translated.workBody}`,
      `${surface}.work`,
    ),
    ...translated.agents.map((agent, index) =>
      draft(
        `de-solution-${slug}-agent-${index + 1}`,
        `solution-${slug}-agent-${index + 1}`,
        `${agent.name}. ${agent.does} ${agent.from}`,
        `${surface}.work`,
      ),
    ),
    draft(
      `de-solution-${slug}-controls-intro`,
      `solution-${slug}-controls-intro`,
      `${translated.wallsTitle} ${translated.wallsBody}`,
      `${surface}.controls`,
    ),
    ...translated.controls.map((control, index) =>
      draft(
        `de-solution-${slug}-control-${index + 1}`,
        `solution-${slug}-control-${index + 1}`,
        `${control.label}. ${control.value}`,
        `${surface}.controls`,
      ),
    ),
    ...translated.questions.map((entry, index) =>
      draft(
        `de-solution-${slug}-faq-${index + 1}`,
        `solution-${slug}-faq-${index + 1}`,
        `${entry.question} ${entry.answer}`,
        `${surface}.faq`,
      ),
    ),
    draft(
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
    draft(
      `de-customer-${slug}-narrative`,
      source.narrativeClaimId,
      `${translated.title} ${translated.summary}`,
      `${surface}.hero`,
    ),
    ...translated.results.map((result, index) =>
      draft(
        result.claimId,
        source.qualifiedResults[index]?.claimId ?? result.claimId.replace(/-de-draft$/, ''),
        [result.value, result.label + '.', result.qualifier].join(' '),
        `${surface}.results`,
      ),
    ),
    ...translated.sections.map((section, index) =>
      draft(
        `de-customer-${slug}-section-${index + 1}`,
        source.sections[index]?.claimId ?? `customer-story-${slug}-section-${index + 1}`,
        [section.heading, ...section.paragraphs, ...(section.points ?? [])].join(' '),
        `${surface}.article`,
      ),
    ),
  ];
});

export const germanLocalizedClaimDrafts: readonly GermanLocalizedClaimRecord[] = [
  ...translatedPageClaims,
  ...translatedSolutionClaims,
  ...translatedCustomerClaims,
];

export function assertGermanClaimsApprovedForPublication(): void {
  const unapproved = germanLocalizedClaimDrafts.filter(
    (claim) =>
      claim.approvalStatus !== 'approved' || !claim.approvedBy?.trim() || !claim.approvedAt?.trim(),
  );
  if (unapproved.length > 0) {
    throw new Error(
      `German publication is blocked by ${unapproved.length} unapproved localized claim records.`,
    );
  }
}
