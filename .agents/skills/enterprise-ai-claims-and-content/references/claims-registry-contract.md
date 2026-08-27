# Claims Registry Contract

The future application must keep public factual claims in an approved registry rather than scattering unsupported facts through components.

## Required fields

| Field            | Requirement                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| id               | Stable unique identifier                                                                       |
| statement        | Exact approved public wording                                                                  |
| category         | product, customer, metric, security, privacy, compliance, certification, legal, or competitive |
| evidence         | Authoritative document or URL available to the approver                                        |
| verified_on      | Date the evidence was last checked                                                             |
| approval_status  | draft, approved, rejected, superseded, or expired                                              |
| approved_by      | Accountable person or team                                                                     |
| approved_on      | Approval date                                                                                  |
| allowed_surfaces | Pages, metadata, campaigns, regions, or channels where use is allowed                          |
| attribution      | Required source, customer, methodology, qualifier, or trademark treatment                      |
| reverify_on      | Date or event that requires another review                                                     |
| notes            | Non-public limitations needed to apply the claim accurately                                    |

Do not expose confidential evidence or approval notes in a public bundle.

## Review rules

- Publish only approved, current records.
- Preserve material qualifiers, population, sample size, time period, region, and methodology.
- Require customer authorization for names, marks, quotations, and identifiable results.
- Require accountable security or legal approval for data, privacy, compliance, and certification statements.
- Treat links, metadata, structured data, social images, and image text as claim surfaces.
- Retire or replace superseded and expired records everywhere they are consumed.
- Do not turn comparative evidence into an absolute or guaranteed outcome.

## Standalone-brand boundary

Public material from another brand, including TextCortex, may inform positioning research but does not become approved evidence automatically. Create a new-brand record with explicit approval before reusing or adapting any capability, customer proof, metric, certification, or trust statement.

## Draft handling

When approval is missing:

1. Label internal draft wording as unverified.
2. Avoid inserting the draft into a production-consumed source.
3. Record the missing owner or evidence.
4. Request approval or use neutral language that makes no unsupported factual promise.
