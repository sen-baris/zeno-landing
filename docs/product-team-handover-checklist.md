# Product team handover checklist

Last updated: 2026-09-21

This checklist covers the operational decisions required to move the Zeno website from its temporary
GitHub Pages demo environment to a product-team-owned production environment.

Read the [site maintainer guide](./site-maintainer-guide.md) for the complete architecture, content,
claims, localization, testing, and design contracts.

## Current handover state

| Area                | Current state                                                              |
| ------------------- | -------------------------------------------------------------------------- |
| GitHub Pages        | Temporary noindex demo preview only                                        |
| Production hosting  | Not selected in this repository                                            |
| Demo submissions    | Synthetic in local development and the Pages preview                       |
| Production lead API | Frontend contract exists at `/api/leads`; server implementation is pending |
| Email delivery      | Mailgun is the intended provider; integration is pending                   |
| Analytics           | No provider is installed                                                   |
| English content     | Available, subject to the production release gates                         |
| German content      | Review-only, noindex, and excluded from production                         |
| German legal pages  | Not approved and not generated                                             |
| Production release  | Intentionally blocked until the explicit release requirements pass         |

GitHub Pages must not determine the production architecture. It cannot provide the same-origin
server endpoint required for real demo submissions.

## 1. Assign ownership

- [ ] Name the engineering owner for the website repository.
- [ ] Name the content and claims approver.
- [ ] Name the legal and privacy approver.
- [ ] Name the security reviewer.
- [ ] Name the owner of the demo-request inbox and response process.
- [ ] Name the owner of the Mailgun account, sending domain, keys, and delivery monitoring.
- [ ] Name the production deployment and incident owner.

Record owners in the product team’s normal operational system. Do not put personal credentials,
private email addresses, or secret values in this repository.

## 2. Select production hosting

The production platform must support:

- the static Astro build;
- a same-origin `POST /api/leads` server or serverless endpoint;
- server-only secrets;
- the production domain and TLS;
- deployment previews;
- logs that can exclude or redact lead payloads;
- rollback to a known deployment;
- the required Node and pnpm versions.

Decision record:

- [ ] Hosting platform selected
- [ ] Production origin confirmed
- [ ] Preview origin confirmed
- [ ] Root path or deployment base confirmed
- [ ] Same-origin API runtime confirmed
- [ ] Deployment and rollback owners confirmed

Do not change the browser adapter to expose a third-party API key or call Mailgun directly.

## 3. Connect demo requests to Mailgun

The existing browser contract sends the typed lead payload to the root-relative path configured by
`PUBLIC_LEAD_ENDPOINT`. The default production path is `/api/leads`.

Implement a server-side endpoint that:

- [ ] accepts only `POST` with JSON;
- [ ] applies a small request-body limit;
- [ ] validates the complete payload again on the server;
- [ ] rejects unsupported origins and malformed requests;
- [ ] adds rate limiting and a low-friction bot control;
- [ ] generates a submission ID;
- [ ] sends a plain-text internal notification through Mailgun;
- [ ] uses the visitor’s work email as `Reply-To`, never as the sender;
- [ ] returns `{ "submissionId": "..." }` only after Mailgun accepts the message;
- [ ] returns safe error responses without exposing provider details;
- [ ] logs the submission ID and delivery state without logging the full lead payload.

Server-side secrets to configure in the selected hosting platform:

```text
MAILGUN_API_KEY
MAILGUN_DOMAIN
MAILGUN_REGION
DEMO_NOTIFICATION_FROM
DEMO_NOTIFICATION_TO
```

Public build configuration:

```text
PUBLIC_LEAD_ADAPTER=gateway
PUBLIC_LEAD_ENDPOINT=/api/leads
```

Mailgun setup:

- [ ] Confirm whether the sending domain is provisioned in the EU or US region.
- [ ] Verify the sending domain and required DNS records.
- [ ] Create a domain-specific sending key rather than using a primary account key.
- [ ] Store the key in the hosting platform’s secret manager.
- [ ] Confirm the internal sender and recipient addresses.
- [ ] Disable unnecessary open and click tracking for internal lead notifications.
- [ ] Decide whether delivery and permanent-failure webhooks are required at launch.
- [ ] Verify webhook signatures if webhooks are enabled.
- [ ] Define an alert and manual recovery path for delivery failures.

Mailgun delivers notification email. It is not a durable CRM record. If the product team requires a
lead system of record, store the validated request in the approved CRM or database before or
alongside email delivery.

## 4. Complete the privacy review

- [ ] Confirm the lawful purpose and retention period for demo-request data.
- [ ] Confirm Mailgun’s role, region, DPA, and subprocessor status.
- [ ] Confirm who may access the notification inbox and any lead system of record.
- [ ] Confirm whether the current Privacy Policy accurately covers the production flow.
- [ ] Keep marketing consent separate. The current form always submits `marketing: false`.
- [ ] Keep optional empty fields out of the lead payload.
- [ ] Decide whether a server timestamp and acknowledgement state must be retained for audit needs.
- [ ] Confirm that logs, error trackers, and analytics do not capture form contents.

Do not expand the current acknowledgement wording or data use without legal and privacy approval.

## 5. Configure domains and SEO

- [ ] Set `PUBLIC_SITE_ORIGIN` to the final canonical origin.
- [ ] Set `PUBLIC_SITE_BASE` to `/` unless production intentionally uses a subpath.
- [ ] Configure the production domain and TLS.
- [ ] Define redirects from any previous public domain or path.
- [ ] Confirm canonical URLs in rendered HTML.
- [ ] Confirm `robots.txt` and sitemap URLs use the production origin.
- [ ] Keep deployment previews noindex.
- [ ] Do not publish German routes until their claim approval gate passes.
- [ ] Do not create German legal routes without approved legal documents.

The legacy `/ai-readiness` route must continue to redirect to `/pricing` unless an approved migration
replaces it.

## 6. Set up delivery and CI

- [ ] Recreate the existing formatting, lint, type, unit, coverage, build, budget, governance, and
      browser checks in the product team’s CI.
- [ ] Keep GitHub branch protection or an equivalent review gate.
- [ ] Store production secrets outside Git and expose them only to the production environment.
- [ ] Separate preview and production environment variables.
- [ ] Keep preview lead submission synthetic or route it to an isolated test destination.
- [ ] Preserve deployment rollback history.
- [ ] Document how to rotate the Mailgun sending key.
- [ ] Document how to disable demo submissions during an incident.

The stable verification commands are documented in the maintainer guide and `package.json`.

## 7. Run production acceptance

Before moving traffic:

- [ ] Run `pnpm check`.
- [ ] Run `pnpm test:e2e` against an isolated test server.
- [ ] Run `pnpm check:governance`.
- [ ] Run the repository feature audit for the hosting and form integration.
- [ ] Run the full release audit.
- [ ] Resolve every P0 to P2 finding.
- [ ] Submit a synthetic demo request in the production candidate.
- [ ] Verify the internal Mailgun notification arrives once.
- [ ] Verify Reply-To, optional fields, language, and landing path.
- [ ] Verify gateway failure produces an understandable retry state.
- [ ] Verify duplicate clicks do not create duplicate requests.
- [ ] Verify no form values appear in browser storage, URLs, analytics, or public logs.
- [ ] Verify the business-case calculator makes no network request.
- [ ] Verify production pages are indexable only after the release decision is READY.

## 8. Cut over and retire the demo host

- [ ] Lower DNS TTL before the planned cutover if required.
- [ ] Deploy and verify the production candidate before changing traffic.
- [ ] Change DNS or the production routing layer.
- [ ] Monitor page errors, lead delivery, and Mailgun failures during the cutover.
- [ ] Keep a rollback route until the new deployment is stable.
- [ ] Disable the GitHub Pages deployment workflow or keep it explicitly as an internal noindex
      preview only.
- [ ] Remove the Pages environment if it is no longer needed.
- [ ] Update the README and maintainer guide with the selected production platform and operational
      owners.

Do not remove the noindex setting from the GitHub Pages build and present it as production.
