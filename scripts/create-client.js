const fs = require('fs');
const path = require('path');

function toCanonicalSlug(rawInput) {
  if (Array.isArray(rawInput)) rawInput = rawInput.join(' ');
  const text = String(rawInput || '').trim();
  let slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (slug === 'amay' || slug === 'amay-goyal') {
    return 'amay-goyal';
  }
  return slug;
}

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
}

function decodeHtmlEntities(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .trim();
}

function sanitizeObject(obj) {
  if (typeof obj === 'string') {
    return decodeHtmlEntities(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (obj && typeof obj === 'object') {
    const res = {};
    for (const k of Object.keys(obj)) {
      res[k] = sanitizeObject(obj[k]);
    }
    return res;
  }
  return obj;
}

function rebuildRegistryIndex(registryFile, clientsDir) {
  const files = fs.readdirSync(clientsDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
  const entries = [];

  files.forEach((file) => {
    const slug = file.replace(/\.ts$/, '');
    const fullPath = path.join(clientsDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const match = content.match(/export\s+const\s+([a-zA-Z0-9_]+)\s*:\s*ClientProfile/);

    if (match) {
      entries.push({
        slug,
        variableName: match[1],
      });
    }
  });

  entries.sort((a, b) => a.slug.localeCompare(b.slug));

  const importLines = entries.map((e) => `import { ${e.variableName} } from './${e.slug}';`).join('\n');
  const recordEntries = entries.map((e) => `  '${e.slug}': ${e.variableName},`).join('\n');

  const newRegistryContent = `${importLines}
import { ClientProfile } from '@/types/client';

export const clients: Record<string, ClientProfile> = {
${recordEntries}
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
`;

  fs.writeFileSync(registryFile, newRegistryContent, 'utf8');
}

function validateRegistry(registryFile, targetSlug) {
  const content = fs.readFileSync(registryFile, 'utf8');

  const importMatches = [...content.matchAll(/import\s+\{\s*([a-zA-Z0-9_]+)\s*\}\s+from\s+'\.\/([^']+)'/g)];
  const importedVars = new Set(importMatches.map((m) => m[1]));

  const mapMatches = [...content.matchAll(/'([^']+)':\s*([a-zA-Z0-9_]+)/g)];
  
  const mapKeys = new Set();
  mapMatches.forEach((m) => {
    const key = m[1];
    const varName = m[2];

    if (mapKeys.has(key)) {
      throw new Error(`Duplicate registry key detected: '${key}' in src/clients/index.ts`);
    }
    mapKeys.add(key);

    if (!importedVars.has(varName)) {
      throw new Error(`Undefined client variable referenced in registry: '${varName}' for key '${key}'`);
    }
  });

  if (!mapKeys.has(targetSlug)) {
    throw new Error(`Target client slug '${targetSlug}' was not registered in src/clients/index.ts`);
  }
}

function runGenerator() {
  const rawArgs = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const isOverwrite = process.argv.includes('--overwrite');

  if (rawArgs.length === 0) {
    console.error('\x1b[31m%s\x1b[0m', 'ERROR: Client slug or name is required.');
    console.log('Usage: npm run create-client -- <client-name> [--overwrite]');
    console.log('Example: npm run create-client -- "Amay Goyal"');
    process.exit(1);
  }

  const clientNameInput = rawArgs.join(' ');
  const clientSlug = toCanonicalSlug(clientNameInput);

  const projectRoot = path.resolve(__dirname, '..');
  const onboardingDir = path.join(projectRoot, 'onboarding', clientSlug);
  const intakePath = fs.existsSync(path.join(onboardingDir, 'processed', 'intake.json'))
    ? path.join(onboardingDir, 'processed', 'intake.json')
    : path.join(onboardingDir, 'intake.json');
  const clientsDir = path.join(projectRoot, 'src', 'clients');
  const clientConfigFile = path.join(clientsDir, `${clientSlug}.ts`);
  const registryFile = path.join(clientsDir, 'index.ts');

  console.log(`\n==================================================`);
  console.log(`PERSONAL BRAND PLATFORM — CLIENT GENERATOR v1.0`);
  console.log(`Input Name:     ${clientNameInput}`);
  console.log(`Canonical Slug: \x1b[32m${clientSlug}\x1b[0m`);
  console.log(`==================================================\n`);

  if (!fs.existsSync(intakePath)) {
    console.error('\x1b[31m%s\x1b[0m', `ERROR: Intake file not found at: ${intakePath}`);
    process.exit(1);
  }

  let rawIntake;
  try {
    const rawData = fs.readFileSync(intakePath, 'utf8');
    rawIntake = JSON.parse(rawData);
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', `ERROR: Failed to parse intake file.`);
    console.error(err.message);
    process.exit(1);
  }

  const intake = sanitizeObject(rawIntake);

  if (fs.existsSync(clientConfigFile) && !isOverwrite) {
    console.log('\x1b[33m%s\x1b[0m', `CLIENT ALREADY EXISTS`);
    console.log(`Client configuration already exists at: src/clients/${clientSlug}.ts`);
    console.log(`To safely update this client without modifying others, run with --overwrite.\n`);
    process.exit(0);
  }

  const errors = [];
  const warnings = [];
  const infos = [];

  const identity = intake.identity || {};
  const contact = intake.contact || {};
  const expertise = Array.isArray(intake.expertise) ? intake.expertise : [];
  const achievements = Array.isArray(intake.achievements) ? intake.achievements : [];
  const gallery = Array.isArray(intake.gallery) ? intake.gallery : [];
  const ideas = Array.isArray(intake.ideas) ? intake.ideas : [];
  const speaking = Array.isArray(intake.speaking) ? intake.speaking : [];
  const videos = Array.isArray(intake.videos) ? intake.videos : [];
  const courses = Array.isArray(intake.courses) ? intake.courses : [];
  const communities = Array.isArray(intake.communities) ? intake.communities : [];
  const portfolio = Array.isArray(intake.portfolio) ? intake.portfolio : [];
  const preferences = intake.sectionPreferences || intake.sections || {};
  const branding = intake.branding || {};
  const seo = intake.seo || {};

  if (!identity.name || !identity.name.trim()) errors.push('Identity name is missing.');
  if (!identity.professionalTitle && !identity.headline) errors.push('Identity professionalTitle or headline is missing.');
  if (!identity.shortBio || !identity.shortBio.trim()) errors.push('Identity shortBio is missing.');
  if (expertise.length === 0) errors.push('At least one expertise item is required.');
  if (!contact.email && !contact.linkedin && !contact.x) errors.push('At least one contact method (email, linkedin, or x) is required.');

  if (errors.length > 0) {
    console.error('\x1b[31m%s\x1b[0m', 'VALIDATION FAILED (ERRORS):');
    errors.forEach((err) => console.error(` ✖ [ERROR] ${err}`));
    process.exit(1);
  }

  let profileImagePath = intake.profileImage || null;
  if (!profileImagePath) {
    const publicProfileDir = path.join(projectRoot, 'public', 'clients', clientSlug, 'profile');
    if (fs.existsSync(publicProfileDir)) {
      const files = fs.readdirSync(publicProfileDir);
      if (files.length > 0) {
        profileImagePath = `/clients/${clientSlug}/profile/${files[0]}`;
      }
    }
  }

  let styleChoice = (branding.style || 'auto').toLowerCase();
  if (styleChoice === 'auto') {
    const fullText = `${identity.name} ${identity.professionalTitle} ${identity.headline}`.toLowerCase();
    if (
      fullText.includes('executive') ||
      fullText.includes('leader') ||
      fullText.includes('director') ||
      fullText.includes('c-suite') ||
      fullText.includes('transformation') ||
      fullText.includes('capital') ||
      fullText.includes('strategy') ||
      fullText.includes('finance')
    ) {
      styleChoice = 'executive';
    } else {
      styleChoice = 'modern';
    }
  }

  let accentColor = branding.accentColor || 'auto';
  if (accentColor === 'auto') {
    if (styleChoice === 'executive') accentColor = '#2563eb';
    else if (styleChoice === 'modern' || styleChoice === 'warm') accentColor = '#0d9488';
    else accentColor = '#2563eb';
  }

  const heroVariant = styleChoice === 'executive' ? 'executive' : 'modern';
  const aboutVariant = styleChoice === 'executive' ? 'executive-split' : 'modern-narrative';
  const expertiseVariant = styleChoice === 'executive' ? 'editorial-list' : 'cards-grid';
  const achievementsVariant = styleChoice === 'executive' ? 'executive-stats' : 'modern-strip';
  const portfolioVariant = styleChoice === 'executive' ? 'case-study-cards' : 'minimal-grid';

  const sectionsVisibility = {
    about: preferences.about !== false,
    expertise: preferences.expertise !== false && expertise.length >= 2,
    achievements: preferences.achievements !== false && achievements.length >= 1,
    gallery: preferences.gallery !== false && gallery.length >= 3,
    ideas: preferences.ideas !== false && ideas.length >= 2,
    speaking: preferences.speaking !== false && speaking.length >= 2,
    videos: preferences.videos !== false && videos.length >= 2,
    courses: preferences.courses !== false && courses.length >= 2,
    communities: preferences.communities !== false && communities.length >= 2,
    portfolio: preferences.portfolio !== false && portfolio.length >= 2,
    contact: preferences.contact !== false,
  };

  const domain = intake.domain || `${clientSlug.replace(/-/g, '')}.com`;
  const professionalTitle = identity.professionalTitle || identity.headline;
  const headline = identity.headline || identity.professionalTitle;
  const location = identity.location || 'Global / Remote';
  const shortBio = identity.shortBio;
  const longBio = identity.longBio || identity.shortBio;
  const primaryCtaText = identity.primaryCtaText || 'Connect With Me';

  const clientVariableName = `${toCamelCase(clientSlug)}Client`;

  const clientConfigContent = `import { ClientProfile } from '@/types/client';

export const ${clientVariableName}: ClientProfile = {
  id: ${JSON.stringify(clientSlug)},
  domain: ${JSON.stringify(domain)},
  name: ${JSON.stringify(identity.name)},
  professionalTitle: ${JSON.stringify(professionalTitle)},
  headline: ${JSON.stringify(headline)},
  subHeadline: ${JSON.stringify(identity.subHeadline || shortBio)},
  location: ${JSON.stringify(location)},
  ${profileImagePath ? `profileImage: ${JSON.stringify(profileImagePath)},` : ''}
  shortBio: ${JSON.stringify(shortBio)},
  longBio: ${JSON.stringify(longBio)},
  primaryCtaText: ${JSON.stringify(primaryCtaText)},

  brand: {
    accentColor: ${JSON.stringify(accentColor)},
    heroVariant: ${JSON.stringify(heroVariant)},
    aboutVariant: ${JSON.stringify(aboutVariant)},
    expertiseVariant: ${JSON.stringify(expertiseVariant)},
    achievementsVariant: ${JSON.stringify(achievementsVariant)},
    portfolioVariant: ${JSON.stringify(portfolioVariant)},
  },

  social: {
    ${contact.linkedin ? `linkedin: ${JSON.stringify(contact.linkedin)},` : ''}
    ${contact.x ? `x: ${JSON.stringify(contact.x)},` : ''}
    ${contact.youtube ? `youtube: ${JSON.stringify(contact.youtube)},` : ''}
    ${contact.instagram ? `instagram: ${JSON.stringify(contact.instagram)},` : ''}
    ${contact.email ? `email: ${JSON.stringify(contact.email)},` : ''}
  },

  expertise: ${JSON.stringify(expertise, null, 2)},
  achievements: ${JSON.stringify(achievements, null, 2)},
  gallery: ${JSON.stringify(gallery, null, 2)},
  ideas: ${JSON.stringify(ideas, null, 2)},
  speaking: ${JSON.stringify(speaking, null, 2)},
  videos: ${JSON.stringify(videos, null, 2)},
  courses: ${JSON.stringify(courses, null, 2)},
  communities: ${JSON.stringify(communities, null, 2)},
  portfolio: ${JSON.stringify(portfolio, null, 2)},

  contact: {
    email: ${JSON.stringify(contact.email || 'contact@' + domain)},
    location: ${JSON.stringify(location)},
    contactFormEnabled: true,
  },

  seo: {
    title: ${JSON.stringify(seo.title || `${identity.name} | ${professionalTitle}`)},
    description: ${JSON.stringify(seo.description || shortBio)},
    keywords: ${JSON.stringify(seo.keywords || [identity.name, professionalTitle, 'Leadership'])},
  },

  sections: ${JSON.stringify(sectionsVisibility, null, 2)},
};
`;

  fs.writeFileSync(clientConfigFile, clientConfigContent, 'utf8');

  rebuildRegistryIndex(registryFile, clientsDir);
  validateRegistry(registryFile, clientSlug);

  console.log('\x1b[32m%s\x1b[0m', 'CLIENT CREATED SUCCESSFULLY\n');
  console.log(`Client Name:          ${identity.name}`);
  console.log(`Canonical Slug:       ${clientSlug}`);
  console.log(`Professional Title:   ${professionalTitle}`);
  console.log(`Brand Style:          ${styleChoice} (Accent: ${accentColor})`);

  console.log('\x1b[36m%s\x1b[0m', 'Sections Enabled:');
  Object.entries(sectionsVisibility)
    .filter(([_, enabled]) => enabled)
    .forEach(([key]) => console.log(` ✓ ${capitalizeWords(key)}`));

  console.log('\n\x1b[90m%s\x1b[0m', 'Sections Skipped:');
  Object.entries(sectionsVisibility)
    .filter(([_, enabled]) => !enabled)
    .forEach(([key]) => console.log(` - ${capitalizeWords(key)}`));

  console.log(`\n==================================================`);
  console.log(`Readiness Report: onboarding/${clientSlug}/READINESS_REPORT.md`);
  console.log(`Local Preview:    http://localhost:3000/?client=${clientSlug}`);
  console.log(`==================================================\n`);
}

runGenerator();
