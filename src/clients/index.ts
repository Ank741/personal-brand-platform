import { ClientProfile } from '@/types/client';
import { alexMorganClient } from './alex-morgan';
import { mayaVermaClient } from './maya-verma';

export const clients: Record<string, ClientProfile> = {
  'alex-morgan': alexMorganClient,
  'maya-verma': mayaVermaClient,
};

export const defaultClient: ClientProfile = alexMorganClient;

export function getClientById(id: string): ClientProfile | undefined {
  if (!id) return undefined;
  const normalizedId = id.toLowerCase().trim();
  return clients[normalizedId];
}

export function getClientByDomain(domain: string): ClientProfile | undefined {
  if (!domain) return undefined;
  const cleanDomain = domain.toLowerCase().split(':')[0].replace(/^www\./, '');
  return Object.values(clients).find((c) => {
    const targetDomain = c.domain.toLowerCase().replace(/^www\./, '');
    return targetDomain === cleanDomain;
  });
}
