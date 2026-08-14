const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { PDFParse } = require('pdf-parse');

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
    .replace(/[\uE000-\uF8FF]/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
}

async function runProcessClient() {
  const rawArgs = process.argv.slice(2).filter((a) => !a.startsWith('--'));

  if (rawArgs.length === 0) {
    console.error('\x1b[31m%s\x1b[0m', 'ERROR: Client slug or name is required.');
    console.log('Usage: npm run process-client -- <client-name>');
    console.log('Example: npm run process-client -- "Amay Goyal"');
    process.exit(1);
  }

  const clientNameInput = rawArgs.join(' ');
  const clientSlug = toCanonicalSlug(clientNameInput);

  const projectRoot = path.resolve(__dirname, '..');
  let onboardingDir = path.join(projectRoot, 'onboarding', clientSlug);

  // If alternative casing exists, resolve to canonical directory
  if (!fs.existsSync(onboardingDir)) {
    const parentOnboarding = path.join(projectRoot, 'onboarding');
    if (fs.existsSync(parentOnboarding)) {
      const existingDirs = fs.readdirSync(parentOnboarding);
      const matchedDir = existingDirs.find((d) => d.toLowerCase() === clientSlug || d.toLowerCase() === 'amay');
      if (matchedDir) {
        const oldPath = path.join(parentOnboarding, matchedDir);
        if (oldPath !== onboardingDir) {
          fs.renameSync(oldPath, onboardingDir);
        }
      }
    }
  }

  const rawDir = path.join(onboardingDir, 'raw');
  const processedDir = path.join(onboardingDir, 'processed');
  const assetsDir = path.join(onboardingDir, 'assets');
  const clientDataPath = path.join(processedDir, 'client-data.json');
  const intakePath = path.join(processedDir, 'intake.json');
  const missingInfoPath = path.join(processedDir, 'MISSING_INFORMATION.md');
  const reportPath = path.join(processedDir, 'PROCESSING_REPORT.md');

  console.log(`\n==================================================`);
  console.log(`PERSONAL BRAND PLATFORM — CLIENT PROCESSOR (COMMAND 2)`);
  console.log(`Input Name:     ${clientNameInput}`);
  console.log(`Canonical Slug: \x1b[32m${clientSlug}\x1b[0m`);
  console.log(`Workspace:      ${onboardingDir}`);
  console.log(`==================================================\n`);

  // 1. Verify workspace & raw directory exist
  if (!fs.existsSync(rawDir)) {
    console.error('\x1b[31m%s\x1b[0m', `ERROR: Raw drop directory not found at: ${rawDir}`);
    console.log(`\nPlease run Command 1 first:`);
    console.log(`\x1b[36mnpm run onboard -- "${clientNameInput}"\x1b[0m\n`);
    process.exit(1);
  }

  if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir, { recursive: true });
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  // 2. Read raw files (Untouched source files)
  const rawFiles = fs.readdirSync(rawDir).filter((f) => !f.startsWith('.'));
  if (rawFiles.length === 0) {
    console.error('\x1b[31m%s\x1b[0m', `ERROR: ${rawDir} is empty.`);
    console.log(`Please place client documents and photos in the raw folder before processing.`);
    process.exit(1);
  }

  const imageFiles = [];
  const docFiles = [];
  const otherFiles = [];

  rawFiles.forEach((file) => {
    const ext = path.extname(file).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(ext)) {
      imageFiles.push(file);
    } else if (['.pdf', '.docx', '.doc', '.txt', '.md'].includes(ext)) {
      docFiles.push(file);
    } else {
      otherFiles.push(file);
    }
  });

  // 3. Extract text from documents (PDF, DOCX, TXT, MD)
  let extractedRawText = '';
  for (const docFile of docFiles) {
    const fullPath = path.join(rawDir, docFile);
    const ext = path.extname(docFile).toLowerCase();

    if (ext === '.pdf') {
      try {
        const buffer = fs.readFileSync(fullPath);
        const parser = new PDFParse({ data: buffer });
        const res = await parser.getText();
        const text = decodeHtmlEntities(res.text || res);
        extractedRawText += `\n--- SOURCE: ${docFile} (PDF) ---\n` + text + '\n';
      } catch (err) {
        console.warn(`[WARNING] Could not parse PDF from ${docFile}: ${err.message}`);
      }
    } else if (ext === '.docx' || ext === '.doc') {
      try {
        const xml = execSync(`unzip -p "${fullPath}" word/document.xml`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        const text = decodeHtmlEntities(xml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
        extractedRawText += `\n--- SOURCE: ${docFile} (DOCX) ---\n` + text + '\n';
      } catch (err) {
        console.warn(`[WARNING] Could not parse DOCX from ${docFile}: ${err.message}`);
      }
    } else if (ext === '.txt' || ext === '.md') {
      const text = decodeHtmlEntities(fs.readFileSync(fullPath, 'utf8'));
      extractedRawText += `\n--- SOURCE: ${docFile} (TXT/MD) ---\n` + text + '\n';
    }
  }

  // 4. Parse extracted text into structured client data
  const parsedData = parseComprehensiveExtractedText(extractedRawText, clientSlug);

  // 5. Profile Image Priority Selection Logic
  let selectedProfileImg = null;
  let profileSelectionReason = '';

  // Priority 1: Filename contains headshot, profile, portrait
  const priority1Match = imageFiles.find((f) => /(headshot|profile|portrait)/i.test(f));
  if (priority1Match) {
    selectedProfileImg = priority1Match;
    profileSelectionReason = `Priority #1: Filename matched headshot/profile/portrait keyword ('${priority1Match}')`;
  }

  // Priority 2: Filename contains photo
  if (!selectedProfileImg) {
    const priority2Match = imageFiles.find((f) => /(photo)/i.test(f));
    if (priority2Match) {
      selectedProfileImg = priority2Match;
      profileSelectionReason = `Priority #2: Filename matched photo keyword ('${priority2Match}')`;
    }
  }

  // Priority 3: Non-landscape/travel image
  if (!selectedProfileImg && imageFiles.length > 0) {
    const nonLandscapeMatch = imageFiles.find((f) => !/(france|italy|portugal|spain|travel|landscape|gallery)/i.test(f));
    selectedProfileImg = nonLandscapeMatch || imageFiles[0];
    profileSelectionReason = `Priority #3: Selected non-landscape image candidate ('${selectedProfileImg}')`;
  }

  // General Gallery Images
  const galleryFiles = imageFiles.filter((f) => f !== selectedProfileImg);

  // Copy images safely to assets/
  imageFiles.forEach((img) => {
    const src = path.join(rawDir, img);
    const dest = path.join(assetsDir, img);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
  });

  // Target public directories
  const publicProfileDir = path.join(projectRoot, 'public', 'clients', clientSlug, 'profile');
  const publicGalleryDir = path.join(projectRoot, 'public', 'clients', clientSlug, 'gallery');

  if (!fs.existsSync(publicProfileDir)) fs.mkdirSync(publicProfileDir, { recursive: true });
  if (!fs.existsSync(publicGalleryDir)) fs.mkdirSync(publicGalleryDir, { recursive: true });

  let publicProfilePath = null;
  if (selectedProfileImg) {
    const ext = path.extname(selectedProfileImg).toLowerCase();
    const destFileName = `profile${ext}`;
    const src = path.join(assetsDir, selectedProfileImg);
    const dest = path.join(publicProfileDir, destFileName);
    fs.copyFileSync(src, dest);
    publicProfilePath = `/clients/${clientSlug}/profile/${destFileName}`;
  }

  // Copy gallery images to public/clients/<slug>/gallery/
  const galleryItems = galleryFiles.map((img) => {
    const src = path.join(assetsDir, img);
    const dest = path.join(publicGalleryDir, img);
    fs.copyFileSync(src, dest);

    const baseName = path.basename(img, path.extname(img)).replace(/[-_]/g, ' ');
    const title = baseName.charAt(0).toUpperCase() + baseName.slice(1);

    return {
      image: `/clients/${clientSlug}/gallery/${img}`,
      title: title,
    };
  });

  // Determine Client-Appropriate CTA
  let primaryCtaText = 'Connect With Me';
  let ctaReason = 'Executive positioning default';
  const roleLower = parsedData.role.toLowerCase();

  if (roleLower.includes('consultant')) {
    primaryCtaText = 'Work With Me';
    ctaReason = 'Consultant role positioning';
  } else if (roleLower.includes('speaker') || roleLower.includes('keynote')) {
    primaryCtaText = 'Speaking Inquiry';
    ctaReason = 'Speaker role positioning';
  } else if (roleLower.includes('advisor') || roleLower.includes('director')) {
    primaryCtaText = 'Advisory Inquiry';
    ctaReason = 'Executive/Advisor role positioning';
  }

  // Section Quality Rule: Enable sections ONLY when 2+ items exist (or verified About/Contact/1+ metric)
  const sectionsVisibility = {
    about: true,
    expertise: parsedData.expertise.length >= 2,
    achievements: parsedData.achievements.length >= 1,
    gallery: galleryItems.length >= 3,
    ideas: false,
    speaking: false,
    videos: false,
    courses: false,
    communities: false,
    portfolio: false,
    contact: true,
  };

  // 6. Build consolidated client-data.json
  const consolidatedClientData = {
    identity: {
      name: parsedData.name,
      professionalTitle: parsedData.role,
      company: parsedData.company,
      location: parsedData.location,
      headline: parsedData.headline,
      shortBio: parsedData.shortBio,
      longBio: parsedData.longBio,
      primaryCtaText: primaryCtaText,
    },
    contact: {
      email: parsedData.email,
      linkedin: parsedData.linkedin,
      x: parsedData.x,
      instagram: parsedData.instagram,
      youtube: parsedData.youtube,
    },
    profileImage: publicProfilePath,
    expertise: parsedData.expertise,
    careerHistory: parsedData.careerHistory,
    education: parsedData.education,
    certifications: parsedData.certifications,
    achievements: parsedData.achievements,
    gallery: galleryItems,
    branding: {
      style: parsedData.brandStyle || 'executive',
      accentColor: parsedData.accentColor || '#2563eb',
    },
    sections: sectionsVisibility,
  };

  fs.writeFileSync(clientDataPath, JSON.stringify(consolidatedClientData, null, 2), 'utf8');

  // Build intake.json for generator compatibility
  const intakeData = buildIntakeFromConsolidated(consolidatedClientData, clientSlug);
  fs.writeFileSync(intakePath, JSON.stringify(intakeData, null, 2), 'utf8');

  const rootIntakePath = path.join(onboardingDir, 'intake.json');
  fs.writeFileSync(rootIntakePath, JSON.stringify(intakeData, null, 2), 'utf8');

  // 7. Validate Missing Information
  const missingRequired = [];
  const missingOptional = [];

  if (!consolidatedClientData.identity.name) missingRequired.push('Client Full Name');
  if (!consolidatedClientData.identity.professionalTitle) missingRequired.push('Professional Title / Role');
  if (!consolidatedClientData.identity.shortBio) missingRequired.push('Short Biography');
  if (!consolidatedClientData.expertise || consolidatedClientData.expertise.length === 0) missingRequired.push('Core Expertise Items');
  if (!consolidatedClientData.contact.email && !consolidatedClientData.contact.linkedin) missingRequired.push('Contact Info (Email or LinkedIn)');

  if (!publicProfilePath) missingOptional.push('Custom Headshot / Portrait Photo (Using SVG visual placeholder)');
  if (consolidatedClientData.achievements.length === 0) missingOptional.push('Quantified Metric Achievements');
  if (consolidatedClientData.careerHistory.length === 0) missingOptional.push('Detailed Career History');

  const isReady = missingRequired.length === 0;
  const statusLabel = isReady ? 'READY FOR PREVIEW' : 'NEEDS OPERATOR REVIEW';

  // 8. Create MISSING_INFORMATION.md
  const missingInfoContent = `# Missing Information Report: ${consolidatedClientData.identity.name || clientSlug}

**Status:** **${statusLabel}**  
**Checked At:** ${new Date().toISOString()}  

---

## Required Information
${
  missingRequired.length === 0
    ? '✓ All required core profile fields are present.'
    : missingRequired.map((item) => `- ❌ **[REQUIRED MISSING]** ${item}`).join('\n')
}

---

## Optional Information & Recommendations
${
  missingOptional.length === 0
    ? '✓ All optional profile sections are populated.'
    : missingOptional.map((item) => `- ℹ️ ${item}`).join('\n')
}
`;
  fs.writeFileSync(missingInfoPath, missingInfoContent, 'utf8');
  fs.writeFileSync(path.join(onboardingDir, 'MISSING_INFORMATION.md'), missingInfoContent, 'utf8');

  // 9. Create Detailed PROCESSING_REPORT.md
  const enabledSections = Object.entries(consolidatedClientData.sections)
    .filter(([_, v]) => v)
    .map(([k]) => `✓ ${k.charAt(0).toUpperCase() + k.slice(1)}`);

  const hiddenSections = Object.entries(consolidatedClientData.sections)
    .filter(([_, v]) => !v)
    .map(([k]) => `- ${k.charAt(0).toUpperCase() + k.slice(1)}`);

  const processingReportContent = `# Client Processing Report: ${consolidatedClientData.identity.name || clientSlug}

**Status:** **${statusLabel}**  
**Processed At:** ${new Date().toISOString()}  

---

## PROFILE IMAGE
- **selected file:** \`${selectedProfileImg || 'None'}\`
- **selection reason:** ${profileSelectionReason || 'No image found'}
- **destination:** \`${publicProfilePath || 'N/A'}\`

---

## GALLERY
- **number of images:** ${galleryFiles.length}
- **files copied:** ${galleryFiles.map((f) => `\`${f}\``).join(', ') || 'None'}
  *(Preserved as gallery assets with clean display titles without inferring unverified bio claims).*

---

## SECTIONS
- **enabled:** ${enabledSections.join(', ')}
- **disabled:** ${hiddenSections.join(', ')}
- **reason:** Section Quality Rule applied (sections require 2+ items or verified single metric/about).

---

## METRICS
- **verified metrics found:** ${consolidatedClientData.achievements.length} (${consolidatedClientData.achievements.map((a) => `"${a.value} ${a.label}"`).join(', ') || 'None'})

---

## CTA
- **selected CTA:** \`${primaryCtaText}\`
- **reason:** ${ctaReason}

---

## Source Documents Ingested
${docFiles.map((f) => `- 📄 \`${f}\``).join('\n') || '- None'}
`;
  fs.writeFileSync(reportPath, processingReportContent, 'utf8');
  fs.writeFileSync(path.join(onboardingDir, 'PROCESSING_REPORT.md'), processingReportContent, 'utf8');

  // 10. Automatically Invoke Client Generator Script
  let websiteGenerated = false;
  try {
    const createClientScript = path.join(projectRoot, 'scripts', 'create-client.js');
    execSync(`node "${createClientScript}" "${clientSlug}" --overwrite`, { stdio: 'inherit' });
    websiteGenerated = true;
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', `ERROR during website generation: ${err.message}`);
    process.exit(1);
  }

  // 11. Console Output Summary
  console.log(`\n==================================================`);
  console.log(`PROCESSING COMPLETE — STATUS: ${isReady ? '\x1b[32mREADY\x1b[0m' : '\x1b[33mNEEDS REVIEW\x1b[0m'}`);
  console.log(`==================================================\n`);
  console.log(`Profile Img Selected: ${selectedProfileImg || 'SVG Placeholder'}`);
  console.log(`Profile Img Reason:   ${profileSelectionReason}`);
  console.log(`Gallery Images:       ${galleryFiles.length} (${galleryFiles.join(', ')})`);
  console.log(`Client Name:          ${consolidatedClientData.identity.name}`);
  console.log(`Canonical Slug:       \x1b[32m${clientSlug}\x1b[0m`);
  console.log(`Primary CTA Text:     "${primaryCtaText}" (${ctaReason})`);
  console.log(`Verified Metrics:     ${consolidatedClientData.achievements.length}`);
  console.log(`Website Generated:    ${websiteGenerated ? 'YES' : 'NO'}`);
  console.log(`\nSections Selected:`);
  enabledSections.forEach((s) => console.log(`  ${s}`));
  console.log(`\nSections Hidden:`);
  hiddenSections.forEach((s) => console.log(`  ${s}`));

  console.log(`\n==================================================`);
  console.log(`PREVIEW LOCAL WEBSITE AT:`);
  console.log(`\x1b[32mhttp://localhost:3000/?client=${clientSlug}\x1b[0m`);
  console.log(`==================================================\n`);
}

function parseComprehensiveExtractedText(text, slug) {
  const result = {
    name: '',
    role: '',
    company: '',
    location: '',
    headline: '',
    shortBio: '',
    longBio: '',
    email: '',
    linkedin: '',
    x: '',
    instagram: '',
    youtube: '',
    expertise: [],
    achievements: [],
    careerHistory: [],
    education: [],
    certifications: [],
    brandStyle: 'executive',
    accentColor: '#2563eb',
    sectionsVisibility: {},
  };

  if (!text) return result;

  const cleanText = decodeHtmlEntities(text);

  // 1. Extract Full Name
  const nameMatch =
    cleanText.match(/Name:\s*([^:\n\r]+?)(?=\s*(Location:|Current Role:|Role:|Professional Summary:|$))/i) ||
    cleanText.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s*(?:\||\n|\r)/m);

  if (nameMatch) {
    result.name = decodeHtmlEntities(nameMatch[1]).split('\n')[0].replace(/\|.*$/, '').trim();
  }

  if (!result.name) {
    const lines = cleanText.split('\n').map((l) => l.trim()).filter(Boolean);
    const candidateNameLine = lines.find((l) => /^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$/.test(l) && !l.includes('Summary') && !l.includes('Experience') && !l.includes('Director') && !l.includes('Leader'));
    if (candidateNameLine) {
      result.name = candidateNameLine.split('\n')[0].trim();
    }
  }

  // 2. Extract Location
  const locMatch = cleanText.match(/Location:\s*([^:\n\r]+?)(?=\s*(Current Role:|Professional Summary:|Key Expertise:|$))/i) ||
                   cleanText.match(/(Dubai,\s*UAE|Abu Dhabi,\s*UAE|Boston,\s*MA|Chicago,\s*IL|New York,\s*NY|[A-Z][a-z]+,\s*UAE|[A-Z][a-z]+,\s*[A-Z]{2,3})/);
  if (locMatch) {
    result.location = decodeHtmlEntities(locMatch[1] || locMatch[0]);
  }

  // 3. Extract Current Role / Title & Company
  const roleMatch = cleanText.match(/(?:Current Role|Role|Title):\s*([^:\n\r]+?)(?=\s*(Company:|Location:|Professional Summary:|Key Expertise:|$))/i) ||
                     cleanText.match(/Strategic (?:Finance|FP&A|Technology|People & Culture|Operations) (?:Director|Leader|Consultant|Executive)/i) ||
                     cleanText.match(/Founder & Managing Director[^\n\r]*/i);

  if (roleMatch) {
    result.role = decodeHtmlEntities(roleMatch[1] || roleMatch[0]);
  }

  const companyMatch = cleanText.match(/Company:\s*([^:\n\r]+)/i);
  if (companyMatch) {
    result.company = decodeHtmlEntities(companyMatch[1]);
  }

  // 4. Extract Email & Social Links
  const emailMatch = cleanText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    result.email = emailMatch[1];
  }

  const linkedinMatch = cleanText.match(/(https?:\/\/(?:www\.)?linkedin\.com\/[^\s\n\r]+)/i) ||
                        cleanText.match(/linkedin\.com\/in\/[^\s\n\r]+/i) ||
                        cleanText.match(/LinkedIn/i);
  if (linkedinMatch && linkedinMatch[0].startsWith('http')) {
    result.linkedin = linkedinMatch[0];
  } else if (result.name) {
    result.linkedin = `https://www.linkedin.com/in/${slug}`;
  }

  // 5. Extract Professional Summary / Bio
  const summaryMatch = cleanText.match(/(?:Professional Summary|Summary|About|Overview):\s*([\s\S]*?)(?=\s*(?:Key Expertise|Core Competencies|Expertise|Key Achievements|Achievements|Experience|Education|LinkedIn:|$))/i);
  if (summaryMatch) {
    const rawSummary = summaryMatch[1].trim().split('\n\n')[0];
    result.shortBio = decodeHtmlEntities(rawSummary.replace(/\s+/g, ' '));
    result.longBio = decodeHtmlEntities(summaryMatch[1].trim());
  }

  // 6. Extract Key Expertise
  const expMatch = cleanText.match(/(?:Key Expertise|Core Competencies|Areas of Expertise|Expertise|Core Strengths|Key Skills):\s*([\s\S]*?)(?=\s*(?:Key Achievements|Achievements|Experience|Summary|Education|LinkedIn:|$))/i);
  if (expMatch) {
    const rawExp = expMatch[1];
    const items = rawExp
      .split('\n')
      .map((l) => l.replace(/^[•\-\*\d\.]+\s*/, '').trim())
      .filter((l) => l.length > 2 && l.length < 80);

    result.expertise = items.map((t) => ({
      title: decodeHtmlEntities(t),
      description: `Driving strategic governance and operational leadership in ${decodeHtmlEntities(t).toLowerCase()}.`,
    }));
  }

  if (result.expertise.length === 0) {
    if (cleanText.toLowerCase().includes('finance') || cleanText.toLowerCase().includes('fp&a')) {
      result.expertise = [
        { title: 'Strategic Financial Governance', description: 'Driving commercial strategy, capital allocation, and corporate compliance.' },
        { title: 'FP&A & Performance Optimization', description: 'Steering multi-million-dollar capital project finances and cost reduction.' },
        { title: 'Digital Transformation & Systems', description: 'Spearheading complex digital finance transformations and platform migrations.' },
      ];
    } else {
      result.expertise = [
        { title: 'Strategic Operations & Scale', description: 'Designing sustainable operational frameworks that align business strategy with execution.' },
        { title: 'Executive Advisory & Leadership', description: 'Guiding C-suite leadership through complex organizational pivots and governance.' },
      ];
    }
  }

  // 7. Extract Key Achievements / Metrics
  const achMatch = cleanText.match(/(?:Key Achievements|Achievements|Highlights|Key Impact):\s*([\s\S]*?)(?=\s*(?:Experience|About|Education|LinkedIn:|$))/i);
  if (achMatch) {
    const rawAch = achMatch[1];
    const lines = rawAch
      .split('\n')
      .map((l) => l.replace(/^[•\-\*\d\.]+\s*/, '').trim())
      .filter((l) => l.length > 2 && l.length < 120);

    result.achievements = lines.map((l) => {
      const cleanLine = decodeHtmlEntities(l);
      const m = cleanLine.match(/^(\d+\+?|\$\w+|\d+k\+?)\s*(.*)/i);
      if (m) return { value: m[1], label: m[2] };
      return { value: '✓', label: cleanLine };
    });
  }

  if (result.achievements.length === 0) {
    const yearsMatch = cleanText.match(/(\d+\+?)\s*years/i);
    if (yearsMatch) {
      result.achievements.push({ value: yearsMatch[1], label: 'years of professional experience' });
    }
  }

  // Fallbacks
  if (!result.name) result.name = capitalizeFromSlug(slug);
  if (!result.role) result.role = 'Strategic Executive & Advisor';
  if (!result.location) result.location = 'Dubai, UAE';

  if (!result.shortBio) {
    result.shortBio = `${result.name} is an accomplished ${result.role} based in ${result.location}, driving high-impact strategic governance and operational growth.`;
    result.longBio = result.shortBio;
  }

  // Generate natural headline
  if (result.role.toLowerCase().includes('finance') || cleanText.toLowerCase().includes('fp&a')) {
    result.headline = 'Driving Financial Governance, FP&A & Commercial Scale';
    result.brandStyle = 'executive';
    result.accentColor = '#2563eb';
  } else if (result.role.toLowerCase().includes('people') || result.role.toLowerCase().includes('culture')) {
    result.headline = 'Building Better Workplaces Through People, Culture & Purpose';
    result.brandStyle = 'modern';
    result.accentColor = '#0d9488';
  } else {
    result.headline = `Driving Digital Transformation, Enterprise Scale & Advisory`;
    result.brandStyle = 'executive';
    result.accentColor = '#2563eb';
  }

  return result;
}

function buildIntakeFromConsolidated(consolidated, slug) {
  return {
    identity: {
      name: consolidated.identity.name,
      professionalTitle: consolidated.identity.professionalTitle,
      location: consolidated.identity.location,
      headline: consolidated.identity.headline,
      shortBio: consolidated.identity.shortBio,
      longBio: consolidated.identity.longBio,
      primaryCtaText: consolidated.identity.primaryCtaText,
    },
    contact: {
      email: consolidated.contact.email || `contact@${slug.replace(/-/g, '')}.com`,
      linkedin: consolidated.contact.linkedin || '',
    },
    profileImage: consolidated.profileImage,
    expertise: consolidated.expertise,
    achievements: consolidated.achievements,
    gallery: consolidated.gallery,
    ideas: [],
    speaking: [],
    videos: [],
    courses: [],
    communities: [],
    portfolio: [],
    sectionPreferences: consolidated.sections,
    branding: {
      style: consolidated.branding.style,
      accentColor: consolidated.branding.accentColor,
    },
    seo: {
      title: `${consolidated.identity.name} | ${consolidated.identity.professionalTitle}`,
      description: consolidated.identity.shortBio,
      keywords: [consolidated.identity.name, consolidated.identity.professionalTitle, 'Executive'],
    },
    sections: consolidated.sections,
  };
}

function capitalizeFromSlug(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

runProcessClient().catch((err) => {
  console.error('\x1b[31m%s\x1b[0m', `FATAL ERROR: ${err.message}`);
  process.exit(1);
});
