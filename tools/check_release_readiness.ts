import { claimRegistry } from '../src/lib/claims/registry';
import { isClaimAllowedOnSurface, isClaimCurrent } from '../src/lib/claims/public-claims';
import { draftHomeCopy, releaseContentStatus } from '../src/lib/content/site-content';

const failures: string[] = [];

if (process.env.CONTENT_MODE !== 'production') {
  failures.push('CONTENT_MODE must be production for a release build.');
}
if (draftHomeCopy.status !== ('approved' as string)) {
  failures.push('Hero messaging is still draft and requires approval.');
}
for (const [surface, status] of Object.entries(releaseContentStatus)) {
  if (status !== ('approved' as string)) {
    failures.push(`${surface[0]?.toUpperCase()}${surface.slice(1)} content requires approval.`);
  }
}

const approvedProof = claimRegistry.filter(
  (claim) =>
    (claim.category === 'metric' || claim.category === 'customer') &&
    isClaimCurrent(claim) &&
    isClaimAllowedOnSurface(claim, 'home.proof'),
);
if (approvedProof.length === 0) {
  failures.push('At least one approved, current Zeno proof claim is required for launch.');
}

const endpoint = process.env.PUBLIC_LEAD_ENDPOINT;
if (!endpoint?.startsWith('/')) {
  failures.push('PUBLIC_LEAD_ENDPOINT must be a same-origin server gateway path.');
}
if (process.env.ZENO_DOMAIN_REDIRECT_REMOVED !== 'true') {
  failures.push('The existing heyzeno.com redirect must be removed and verified.');
}

if (failures.length > 0) {
  process.stderr.write(`Release build blocked:\n- ${failures.join('\n- ')}\n`);
  process.exitCode = 1;
}
