import { alexMorganClient } from './alex-morgan';
import { amayGoyalClient } from './amay-goyal';
import { mayaVermaClient } from './maya-verma';
import { palakMehtaClient } from './palak-mehta';
import { rohanKapoorClient } from './rohan-kapoor';
import { samTaylorClient } from './sam-taylor';
import { ClientProfile } from '@/types/client';

export const clients: Record<string, ClientProfile> = {
  'alex-morgan': alexMorganClient,
  'amay-goyal': amayGoyalClient,
  'maya-verma': mayaVermaClient,
  'palak-mehta': palakMehtaClient,
  'rohan-kapoor': rohanKapoorClient,
  'sam-taylor': samTaylorClient,
};

export const defaultClient: ClientProfile = alexMorganClient;

export function getClientById(id: string): ClientProfile | undefined {
  if (!id) return undefined;
  const normalizedId = id.toLowerCase().trim();
  return clients[normalizedId];
}

export function getClientByDomain(domain: string): ClientProfile | undefined {
  if (!domain) return undefined;
  const cleanDomain = domain.toLowerCase().split(':')[0].replace(/^www./, '');
  return Object.values(clients).find((c) => {
    const targetDomain = c.domain.toLowerCase().replace(/^www./, '');
    return targetDomain === cleanDomain;
  });
}
