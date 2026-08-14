const fs = require('fs');
const path = require('path');

// Helper to convert kebab-case (john-smith) to camelCase (johnSmith)
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

// Helper to capitalize words
function capitalizeWords(str) {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
}

function runGenerator() {
  const args = process.argv.slice(2);
  const clientSlug = args.find((a) => !a.startsWith('--'));
  const isOverwrite = args.includes('--overwrite');

  if (!clientSlug) {
    console.error('\x1b[31m%s\x1b[0m', 'ERROR: Client slug is required.');
    console.log('Usage: npm run create-client -- <client-slug> [--overwrite]');
    console.log('Example: npm run create-client -- john-smith');
    process.exit(1);
  }

  const projectRoot = path.resolve(__dirname, '..');
  const onboardingDir = path.join(projectRoot, 'onboarding', clientSlug);
  const intakePath = path.join(onboardingDir, 'intake.json');
  const clientConfigFile = path.join(projectRoot, 'src', 'clients', `${clientSlug}.ts`);
  const registryFile = path.join(projectRoot, 'src', 'clients', 'index.ts');

  console.log(`\n==================================================`);
  console.log(`PERSONAL BRAND PLATFORM — CLIENT GENERATOR v1.0`);
  console.log(`Client Slug: ${clientSlug}`);
  console.log(`==================================================\n`);

  // 1. Check if intake file exists
  if (!fs.existsSync(intakePath)) {
    console.error('\x1b[31m%s\x1b[0m', `ERROR: Intake file not found at: onboarding/${clientSlug}/intake.json`);
    console.log(`\nPlease create the onboarding directory first:`);
    console.log(`1. Copy onboarding/template/ to onboarding/${clientSlug}/`);
    console.log(`2. Fill out onboarding/${clientSlug}/intake.json`);
    console.log(`3. Re-run: npm run create-client -- ${clientSlug}\n`);
    process.exit(1);
  }

  // 2. Read and parse intake.json
  let intake;
  try {
    const rawData = fs.readFileSync(intakePath, 'utf8');
    intake = JSON.parse(rawData);
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', `ERROR: Failed to parse onboarding/${clientSlug}/intake.json.`);
    console.error(err.message);
    process.exit(1);
  }

  // 3. Safe Regeneration Check
  if (fs.existsSync(clientConfigFile) && !isOverwrite) {
    console.log('\x1b[33m%s\x1b[0m', `CLIENT ALREADY EXISTS`);
    console.log(`Client configuration already exists at: src/clients/${clientSlug}.ts`);
    console.log(`To safely update this client without modifying others, run:`);
    console.log(`\x1b[36mnpm run create-client -- ${clientSlug} --overwrite\x1b[0m\n`);
    process.exit(0);
  }

  // 4. Validation (ERROR, WARNING, INFO)
  const errors = [];
  const warnings = [];
  const infos = [];

  const identity = intake.identity || {};
  const contact = intake.contact || {};
  const expertise = Array.isArray(intake.expertise) ? intake.expertise : [];
  const achievements = Array.isArray(intake.achievements) ? intake.achievements : [];
  const ideas = Array.isArray(intake.ideas) ? intake.ideas : [];
  const speaking = Array.isArray(intake.speaking) ? intake.speaking : [];
  const videos = Array.isArray(intake.videos) ? intake.videos : [];
  const courses = Array.isArray(intake.courses) ? intake.courses : [];
  const communities = Array.isArray(intake.communities) ? intake.communities : [];
  const portfolio = Array.isArray(intake.portfolio) ? intake.portfolio : [];
  const preferences = intake.sectionPreferences || {};
  const branding = intake.branding || {};
  const seo = intake.seo || {};

  // Required Field Checks
  if (!identity.name || !identity.name.trim()) {
    errors.push('Identity name is missing.');
  }
  if (!identity.professionalTitle && !identity.headline) {
    errors.push('Identity professionalTitle or headline is missing.');
  }
  if (!identity.shortBio || !identity.shortBio.trim()) {
    errors.push('Identity shortBio is missing.');
  }
  if (expertise.length === 0) {
    errors.push('At least one expertise item is required.');
  }
  if (!contact.email && !contact.linkedin && !contact.x) {
    errors.push('At least one contact method (email, linkedin, or x) is required.');
  }

  if (errors.length > 0) {
    console.error('\x1b[31m%s\x1b[0m', 'VALIDATION FAILED (ERRORS):');
    errors.forEach((err) => console.error(` ✖ [ERROR] ${err}`));
    console.log(`\nPlease fix the errors in onboarding/${clientSlug}/intake.json and try again.\n`);
    process.exit(1);
  }

  // Detect Available Media Assets
  const publicClientDir = path.join(projectRoot, 'public', 'clients', clientSlug);
  const assetSubfolders = ['profile', 'hero', 'ideas', 'speaking', 'videos', 'courses', 'community', 'portfolio'];
  
  assetSubfolders.forEach((sub) => {
    const targetDir = path.join(publicClientDir, sub);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  });

  let profileImagePath = null;
  const onboardingProfileDir = path.join(onboardingDir, 'profile');

  if (fs.existsSync(onboardingProfileDir)) {
    const files = fs.readdirSync(onboardingProfileDir);
    const imgFile = files.find((f) => /\.(jpg|jpeg|png|webp|svg)$/i.test(f));
    if (imgFile) {
      const srcFile = path.join(onboardingProfileDir, imgFile);
      const destFile = path.join(publicClientDir, 'profile', imgFile);
      fs.copyFileSync(srcFile, destFile);
      profileImagePath = `/clients/${clientSlug}/profile/${imgFile}`;
    }
  }

  // Recommended Field Warnings
  if (!profileImagePath) {
    warnings.push('No custom profile portrait found in onboarding/profile/. (Using visual SVG placeholder).');
  }
  if (achievements.length === 0) {
    warnings.push('No achievements metrics provided.');
  }
  if (!contact.linkedin) {
    warnings.push('LinkedIn profile URL omitted.');
  }
  if (!identity.longBio) {
    warnings.push('Long bio omitted. Using short bio for expanded story.');
  }

  // Optional Field Infos
  if (ideas.length === 0) infos.push('Ideas / Thought Leadership section omitted.');
  if (speaking.length === 0) infos.push('Speaking engagements section omitted.');
  if (videos.length === 0) infos.push('Videos / Broadcasts section omitted.');
  if (courses.length === 0) infos.push('Courses / Workshops section omitted.');
  if (communities.length === 0) infos.push('Communities / Advisory section omitted.');
  if (portfolio.length === 0) infos.push('Portfolio / Case studies section omitted.');

  // 5. Determine Branding Style & Colors
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
      fullText.includes('board')
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
    else if (styleChoice === 'creator') accentColor = '#6366f1';
    else accentColor = '#2563eb';
  }

  const heroVariant = styleChoice === 'executive' ? 'executive' : 'modern';
  const aboutVariant = styleChoice === 'executive' ? 'executive-split' : 'modern-narrative';
  const expertiseVariant = styleChoice === 'executive' ? 'editorial-list' : 'cards-grid';
  const achievementsVariant = styleChoice === 'executive' ? 'executive-stats' : 'modern-strip';
  const portfolioVariant = styleChoice === 'executive' ? 'case-study-cards' : 'minimal-grid';

  // 6. Determine Automatic Section Visibility
  const sectionsVisibility = {
    about: preferences.about !== false,
    expertise: preferences.expertise !== false && expertise.length > 0,
    achievements: preferences.achievements !== false && achievements.length > 0,
    ideas: preferences.ideas !== false && ideas.length > 0,
    speaking: preferences.speaking !== false && speaking.length > 0,
    videos: preferences.videos !== false && videos.length > 0,
    courses: preferences.courses !== false && courses.length > 0,
    communities: preferences.communities !== false && communities.length > 0,
    portfolio: preferences.portfolio !== false && portfolio.length > 0,
    contact: preferences.contact !== false,
  };

  const domain = intake.domain || `${clientSlug.replace(/-/g, '')}.com`;
  const professionalTitle = identity.professionalTitle || identity.headline;
  const headline = identity.headline || identity.professionalTitle;
  const location = identity.location || 'Global / Remote';
  const shortBio = identity.shortBio;
  const longBio = identity.longBio || identity.shortBio;

  // 7. Generate Client TypeScript File
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
  ${identity.storyHeadline ? `storyHeadline: ${JSON.stringify(identity.storyHeadline)},` : ''}
  ${identity.philosophyQuote ? `philosophyQuote: ${JSON.stringify(identity.philosophyQuote)},` : ''}

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

  // 8. Safely Update src/clients/index.ts Registry
  let registryContent = fs.readFileSync(registryFile, 'utf8');
  
  const importLine = `import { ${clientVariableName} } from './${clientSlug}';`;
  if (!registryContent.includes(importLine)) {
    // Add import statement at top
    registryContent = `${importLine}\n` + registryContent;
  }

  // Check if entry in clients map exists
  const entryPattern = `'${clientSlug}': ${clientVariableName},`;
  if (!registryContent.includes(entryPattern)) {
    registryContent = registryContent.replace(
      /export const clients: Record<string, ClientProfile> = \{/,
      `export const clients: Record<string, ClientProfile> = {\n  '${clientSlug}': ${clientVariableName},`
    );
  }

  fs.writeFileSync(registryFile, registryContent, 'utf8');

  // 9. Calculate Profile Completeness Score
  let score = 0;
  if (identity.name) score += 20;
  if (professionalTitle) score += 15;
  if (shortBio) score += 15;
  if (expertise.length > 0) score += 15;
  if (contact.email || contact.linkedin) score += 15;
  if (achievements.length > 0) score += 10;
  if (profileImagePath) score += 10;

  // 10. Generate READINESS_REPORT.md
  const enabledSectionsList = Object.entries(sectionsVisibility)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => `✓ ${capitalizeWords(key)}`)
    .join('\n');

  const skippedSectionsList = Object.entries(sectionsVisibility)
    .filter(([_, enabled]) => !enabled)
    .map(([key]) => `- ${capitalizeWords(key)}`)
    .join('\n');

  const readinessReportContent = `# Client Readiness Report: ${identity.name}

**Client Slug:** \`${clientSlug}\`  
**Generated At:** ${new Date().toISOString()}  
**Profile Completeness:** **${score}%**  
**Selected Brand Style:** \`${styleChoice}\` (Accent: \`${accentColor}\`)  

---

## Website Preview

🔗 **Local Preview URL:** [http://localhost:3000/?client=${clientSlug}](http://localhost:3000/?client=${clientSlug})

---

## Section Status

### Enabled Sections
${enabledSectionsList}

### Skipped / Empty Sections
${skippedSectionsList}

---

## Validation & Warnings

### Warnings (Recommended Information)
${warnings.length > 0 ? warnings.map((w) => `- ⚠️ ${w}`).join('\n') : '✓ None'}

### Optional Info
${infos.length > 0 ? infos.map((i) => `- ℹ️ ${i}`).join('\n') : '✓ None'}

---

## Assets Detected
- **Profile Image:** ${profileImagePath ? `\`${profileImagePath}\`` : 'None (Using visual placeholder)'}
- **Public Folder:** \`public/clients/${clientSlug}/\`
`;

  const readinessReportPath = path.join(onboardingDir, 'READINESS_REPORT.md');
  fs.writeFileSync(readinessReportPath, readinessReportContent, 'utf8');

  // 11. Console Output Summary
  console.log('\x1b[32m%s\x1b[0m', 'CLIENT CREATED SUCCESSFULLY\n');
  console.log(`Client Name:          ${identity.name}`);
  console.log(`Professional Title:   ${professionalTitle}`);
  console.log(`Brand Style:          ${styleChoice} (Accent: ${accentColor})`);
  console.log(`Profile Completeness: ${score}%\n`);

  console.log('\x1b[36m%s\x1b[0m', 'Sections Enabled:');
  Object.entries(sectionsVisibility)
    .filter(([_, enabled]) => enabled)
    .forEach(([key]) => console.log(` ✓ ${capitalizeWords(key)}`));

  console.log('\n\x1b[90m%s\x1b[0m', 'Sections Skipped:');
  Object.entries(sectionsVisibility)
    .filter(([_, enabled]) => !enabled)
    .forEach(([key]) => console.log(` - ${capitalizeWords(key)}`));

  if (warnings.length > 0) {
    console.log('\n\x1b[33m%s\x1b[0m', 'Warnings:');
    warnings.forEach((w) => console.log(` ⚠️ ${w}`));
  }

  console.log(`\n==================================================`);
  console.log(`Readiness Report: onboarding/${clientSlug}/READINESS_REPORT.md`);
  console.log(`Local Preview:    http://localhost:3000/?client=${clientSlug}`);
  console.log(`==================================================\n`);
}

runGenerator();
