import { ClientProfile } from '@/types/client';
import { defaultClient, getClientByDomain, getClientById } from '@/clients';

export interface TenantResolutionContext {
  hostname?: string | null;
  clientSlug?: string | null;
}

/**
 * Resolves the active ClientProfile based on local query override or production hostname.
 * 
 * Lookup Order:
 * 1. Query parameter override (`?client=alex-morgan` or `?client=maya-verma`)
 * 2. Exact domain matching against client.domain (e.g., `alexmorgan.com` or `mayaverma.org`)
 * 3. Default fallback profile (Alex Morgan)
 */
export function resolveClientProfile(context: TenantResolutionContext): ClientProfile {
  const { hostname, clientSlug } = context;

  // 1. Explicit query parameter override (Development & testing)
  if (clientSlug) {
    const queryMatched = getClientById(clientSlug);
    if (queryMatched) {
      return queryMatched;
    }
  }

  // 2. Domain / Hostname based resolution (Production)
  if (hostname) {
    const domainMatched = getClientByDomain(hostname);
    if (domainMatched) {
      return domainMatched;
    }
  }

  // 3. Fallback default client
  return defaultClient;
}
