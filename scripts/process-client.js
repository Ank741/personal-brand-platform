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
  const changeReportPath = path.join(processedDir, 'CHANGE_REPORT.md');

  console.log(`\n==================================================`);
  console.log(`PERSONAL BRAND PLATFORM — CLIENT PROCESSOR (COMMAND 2)`);
  console.log(`Input Name:     ${clientNameInput}`);
  console.log(`Canonical Slug: \x1b[32m${clientSlug}\x1b[0m`);
  console.log(`Workspace:      ${onboardingDir}`);
  console.log(`==================================================\n`);

  if (!fs.existsSync(rawDir)) {
    console.error('\x1b[31m%s\x1b[0m', `ERROR: Raw drop directory not found at: ${rawDir}`);
    console.log(`\nPlease run Command 1 first:`);
    console.log(`\x1b[36mnpm run onboard -- "${clientNameInput}"\x1b[0m\n`);
    process.exit(1);
  }

  if (!fs.existsSync(processedDir)) fs.mkdirSync(processedDir, { recursive: true });
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  // Load existing client data if present (for content preservation & incremental merging)
  let existingClientData = null;
  if (fs.existsSync(clientDataPath)) {
    try {
      existingClientData = JSON.parse(fs.readFileSync(clientDataPath, 'utf8'));
    } catch (e) {
      // Ignore
    }
  }

  // Parse explicit operator human requests (update-request.txt)
  const operatorInstructions = parseOperatorUpdateRequest(rawDir);

  // Track incremental changes
  const changeLog = {
    added: [],
    updated: [],
    removed: [],
    unchanged: [],
    warnings: [],
  };

  // Read raw files
  const rawFiles = fs.readdirSync(rawDir).filter((f) => !f.startsWith('.'));
  if (rawFiles.length === 0) {
    console.error('\x1b[31m%s\x1b[0m', `ERROR: ${rawDir} is empty.`);
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

  // Extract text from raw documents (PDF, DOCX, TXT, MD)
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

  // Parse extracted raw text
  const parsedData = parseComprehensiveExtractedText(extractedRawText, clientSlug, docFiles);

  // Extract Articles / Ideas from raw material
  const parsedArticles = extractArticlesFromText(extractedRawText, docFiles);

  // Extract Speaking, Videos, Courses, Portfolio items
  const parsedSpeaking = extractSpeakingFromText(extractedRawText, docFiles);
  const parsedVideos = extractVideosFromText(extractedRawText, docFiles);
  const parsedCourses = extractCoursesFromText(extractedRawText, docFiles);
  const parsedPortfolio = extractPortfolioFromText(extractedRawText, docFiles);

  // Profile Image Selection Logic
  let selectedProfileImg = null;
  let profileSelectionReason = '';

  const p1Match = imageFiles.find((f) => /(headshot|profile|portrait|avatar|headshot-photo|profile-photo|new-portrait)/i.test(f));
  if (p1Match) {
    selectedProfileImg = p1Match;
    profileSelectionReason = `Priority #1: Explicit headshot/profile keyword match ('${p1Match}')`;
  }

  if (!selectedProfileImg) {
    const p2Match = imageFiles.find((f) => /(photo|me)/i.test(f));
    if (p2Match) {
      selectedProfileImg = p2Match;
      profileSelectionReason = `Priority #2: Filename matched photo keyword ('${p2Match}')`;
    }
  }

  if (!selectedProfileImg && existingClientData?.mediaAssets?.proposedProfileImage) {
    const prevImage = existingClientData.mediaAssets.proposedProfileImage;
    if (imageFiles.includes(prevImage)) {
      selectedProfileImg = prevImage;
      profileSelectionReason = `Preserved established portrait from previous run ('${prevImage}')`;
    }
  }

  if (!selectedProfileImg && imageFiles.length > 0) {
    const nonTravelImages = imageFiles.filter((f) => !/(france|italy|portugal|spain|travel|landscape|gallery|event)/i.test(f));
    selectedProfileImg = nonTravelImages[0] || imageFiles[0];
    profileSelectionReason = `Selection candidate ('${selectedProfileImg}')`;
  }

  // Handle explicit image removal requests
  let galleryFiles = imageFiles.filter((f) => f !== selectedProfileImg);
  if (operatorInstructions.removeImages.length > 0) {
    operatorInstructions.removeImages.forEach((remImg) => {
      galleryFiles = galleryFiles.filter((f) => !f.toLowerCase().includes(remImg));
      changeLog.removed.push(`Image removed via update-request.txt ('${remImg}')`);
    });
  }

  // Copy images to assets/ and public folders
  imageFiles.forEach((img) => {
    const src = path.join(rawDir, img);
    const dest = path.join(assetsDir, img);
    fs.copyFileSync(src, dest);
  });

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

    if (existingClientData?.profileImage !== publicProfilePath) {
      changeLog.updated.push(`Profile Photo updated to '${selectedProfileImg}'`);
    } else {
      changeLog.unchanged.push(`Profile Photo preserved ('${selectedProfileImg}')`);
    }
  }

  const galleryItems = galleryFiles.map((img) => {
    const src = path.join(assetsDir, img);
    const dest = path.join(publicGalleryDir, img);
    fs.copyFileSync(src, dest);
    const baseName = path.basename(img, path.extname(img)).replace(/[-_]/g, ' ');
    return {
      image: `/clients/${clientSlug}/gallery/${img}`,
      title: baseName.charAt(0).toUpperCase() + baseName.slice(1),
    };
  });

  // Determine CTA
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

  // Merge content arrays safely (preserving approved content and deduplicating new content)
  let mergedIdeas = mergeAndDeduplicate(existingClientData?.ideas, parsedArticles.concat(operatorInstructions.addArticles.map((t) => ({ title: t, summary: t }))), (i) => i.title);
  let mergedSpeaking = mergeAndDeduplicate(existingClientData?.speaking, parsedSpeaking.concat(operatorInstructions.addSpeaking.map((s) => ({ title: s, description: s }))), (s) => s.title);
  let mergedVideos = mergeAndDeduplicate(existingClientData?.videos, parsedVideos, (v) => v.title);
  let mergedCourses = mergeAndDeduplicate(existingClientData?.courses, parsedCourses, (c) => c.title);
  let mergedPortfolio = mergeAndDeduplicate(existingClientData?.portfolio, parsedPortfolio, (p) => p.title);
  let mergedExpertise = mergeAndDeduplicate(existingClientData?.expertise, parsedData.expertise, (e) => e.title);
  let mergedAchievements = mergeAndDeduplicate(existingClientData?.achievements, parsedData.achievements, (a) => a.label);

  // Handle explicit article removal requests
  if (operatorInstructions.removeArticles.length > 0) {
    operatorInstructions.removeArticles.forEach((remTitle) => {
      mergedIdeas = mergedIdeas.filter((a) => !a.title.toLowerCase().includes(remTitle));
      changeLog.removed.push(`Article removed via update-request.txt ('${remTitle}')`);
    });
  }

  // Section Quality & Automatic Visibility Rule
  const sectionsVisibility = {
    about: true,
    expertise: mergedExpertise.length >= 2,
    achievements: mergedAchievements.length >= 1,
    ideas: mergedIdeas.length >= 1,
    speaking: mergedSpeaking.length >= 1,
    videos: mergedVideos.length >= 1,
    courses: mergedCourses.length >= 1,
    communities: false,
    portfolio: mergedPortfolio.length >= 1,
    gallery: galleryItems.length >= 3,
    contact: true,
  };

  // Apply explicit enable/disable section operator instructions
  operatorInstructions.enableSections.forEach((sec) => {
    const key = sec.trim().toLowerCase();
    if (key in sectionsVisibility) {
      sectionsVisibility[key] = true;
      changeLog.added.push(`Section enabled via update-request.txt ('${sec}')`);
    }
  });

  operatorInstructions.disableSections.forEach((sec) => {
    const key = sec.trim().toLowerCase();
    if (key in sectionsVisibility) {
      sectionsVisibility[key] = false;
      changeLog.removed.push(`Section disabled via update-request.txt ('${sec}')`);
    }
  });

  // Track added items in change log
  if (parsedArticles.length > 0) {
    parsedArticles.forEach((a) => changeLog.added.push(`New Article/Perspective ('${a.title}')`));
  }
  if (parsedSpeaking.length > 0) {
    parsedSpeaking.forEach((s) => changeLog.added.push(`New Speaking Event ('${s.title}')`));
  }

  if (changeLog.added.length === 0 && changeLog.updated.length === 0 && changeLog.removed.length === 0) {
    changeLog.unchanged.push('All existing approved client data preserved unchanged.');
  }

  // Build consolidated client-data.json
  const consolidatedClientData = {
    identity: {
      name: parsedData.name || existingClientData?.identity?.name || clientSlug,
      professionalTitle: parsedData.role || existingClientData?.identity?.professionalTitle || '',
      company: parsedData.company || existingClientData?.identity?.company || '',
      location: parsedData.location || existingClientData?.identity?.location || '',
      headline: parsedData.headline || existingClientData?.identity?.headline || '',
      shortBio: parsedData.shortBio || existingClientData?.identity?.shortBio || '',
      longBio: parsedData.longBio || existingClientData?.identity?.longBio || '',
      primaryCtaText: primaryCtaText,
    },
    contact: {
      email: parsedData.email || existingClientData?.contact?.email || '',
      linkedin: parsedData.linkedin || existingClientData?.contact?.linkedin || '',
      x: parsedData.x || existingClientData?.contact?.x || '',
      instagram: parsedData.instagram || existingClientData?.contact?.instagram || '',
      youtube: parsedData.youtube || existingClientData?.contact?.youtube || '',
    },
    profileImage: publicProfilePath,
    mediaAssets: {
      proposedProfileImage: selectedProfileImg,
      galleryAssets: galleryFiles,
    },
    expertise: mergedExpertise,
    careerHistory: parsedData.careerHistory.length > 0 ? parsedData.careerHistory : (existingClientData?.careerHistory || []),
    education: parsedData.education.length > 0 ? parsedData.education : (existingClientData?.education || []),
    certifications: parsedData.certifications.length > 0 ? parsedData.certifications : (existingClientData?.certifications || []),
    achievements: mergedAchievements,
    ideas: mergedIdeas,
    speaking: mergedSpeaking,
    videos: mergedVideos,
    courses: mergedCourses,
    portfolio: mergedPortfolio,
    gallery: galleryItems,
    branding: {
      style: parsedData.brandStyle || existingClientData?.branding?.style || 'executive',
      accentColor: parsedData.accentColor || existingClientData?.branding?.accentColor || '#2563eb',
    },
    sections: sectionsVisibility,
  };

  fs.writeFileSync(clientDataPath, JSON.stringify(consolidatedClientData, null, 2), 'utf8');

  // Build intake.json for generator compatibility
  const intakeData = buildIntakeFromConsolidated(consolidatedClientData, clientSlug);
  fs.writeFileSync(intakePath, JSON.stringify(intakeData, null, 2), 'utf8');

  const rootIntakePath = path.join(onboardingDir, 'intake.json');
  fs.writeFileSync(rootIntakePath, JSON.stringify(intakeData, null, 2), 'utf8');

  // Generate CHANGE_REPORT.md
  const changeReportContent = `# Client Change Report: ${consolidatedClientData.identity.name || clientSlug}

**Status:** **PROCESSED & UPDATED**  
**Updated At:** ${new Date().toISOString()}  

---

## ADDED
${changeLog.added.length > 0 ? changeLog.added.map((item) => `- ➕ ${item}`).join('\n') : '- None'}

---

## UPDATED
${changeLog.updated.length > 0 ? changeLog.updated.map((item) => `- 🔄 ${item}`).join('\n') : '- None'}

---

## REMOVED
${changeLog.removed.length > 0 ? changeLog.removed.map((item) => `- ❌ ${item}`).join('\n') : '- None'}

---

## UNCHANGED
${changeLog.unchanged.length > 0 ? changeLog.unchanged.map((item) => `- ✓ ${item}`).join('\n') : '- None'}

---

## WARNINGS
${changeLog.warnings.length > 0 ? changeLog.warnings.map((item) => `- ⚠️ ${item}`).join('\n') : '- None'}
`;
  fs.writeFileSync(changeReportPath, changeReportContent, 'utf8');
  fs.writeFileSync(path.join(onboardingDir, 'CHANGE_REPORT.md'), changeReportContent, 'utf8');

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
  const enabledSections = Object.entries(consolidatedClientData.sections)
    .filter(([_, v]) => v)
    .map(([k]) => `✓ ${k.charAt(0).toUpperCase() + k.slice(1)}`);

  const hiddenSections = Object.entries(consolidatedClientData.sections)
    .filter(([_, v]) => !v)
    .map(([k]) => `- ${k.charAt(0).toUpperCase() + k.slice(1)}`);

  console.log(`\n==================================================`);
  console.log(`CLIENT UPDATED SUCCESSFULLY — STATUS: \x1b[32mREADY\x1b[0m`);
  console.log(`==================================================\n`);
  console.log(`Client Name:          ${consolidatedClientData.identity.name}`);
  console.log(`Canonical Slug:       \x1b[32m${clientSlug}\x1b[0m`);
  console.log(`Profile Img Selected: ${selectedProfileImg || 'SVG Placeholder'}`);
  console.log(`Primary CTA Text:     "${primaryCtaText}" (${ctaReason})`);
  console.log(`Articles Count:       ${mergedIdeas.length}`);
  console.log(`Speaking Count:       ${mergedSpeaking.length}`);
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

function parseOperatorUpdateRequest(rawDir) {
  const reqFiles = ['update-request.txt', 'update_request.txt', 'instructions.txt', 'operator-request.txt'];
  const instructions = {
    enableSections: [],
    disableSections: [],
    removeArticles: [],
    removeSections: [],
    removeImages: [],
    addSpeaking: [],
    addArticles: [],
  };

  for (const file of reqFiles) {
    const filePath = path.join(rawDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);

      lines.forEach((line) => {
        if (/^ENABLE SECTION:/i.test(line)) {
          const val = line.replace(/^ENABLE SECTION:/i, '').trim();
          if (val) instructions.enableSections.push(val.toLowerCase());
        } else if (/^DISABLE SECTION:|^REMOVE SECTION:/i.test(line)) {
          const val = line.replace(/^(DISABLE SECTION:|REMOVE SECTION:)/i, '').trim();
          if (val) instructions.disableSections.push(val.toLowerCase());
        } else if (/^REMOVE ARTICLE:/i.test(line)) {
          const val = line.replace(/^REMOVE ARTICLE:/i, '').trim();
          if (val) instructions.removeArticles.push(val.toLowerCase());
        } else if (/^REMOVE IMAGE:/i.test(line)) {
          const val = line.replace(/^REMOVE IMAGE:/i, '').trim();
          if (val) instructions.removeImages.push(val.toLowerCase());
        } else if (/^ADD SPEAKING:/i.test(line)) {
          const val = line.replace(/^ADD SPEAKING:/i, '').trim();
          if (val) instructions.addSpeaking.push(val);
        } else if (/^ADD ARTICLE:|^ADD IDEA:/i.test(line)) {
          const val = line.replace(/^(ADD ARTICLE:|ADD IDEA:)/i, '').trim();
          if (val) instructions.addArticles.push(val);
        }
      });
    }
  }

  return instructions;
}

function extractArticlesFromText(text, docFiles) {
  const articles = [];
  const matches = [...text.matchAll(/(?:Article|Idea|Publication|Perspective):\s*([^\n\r]+)(?:\n|\r)+Summary:\s*([^\n\r]+)(?:(?:\n|\r)+URL:\s*(https?:\/\/[^\s\n\r]+))?/gi)];
  matches.forEach((m) => {
    articles.push({
      title: decodeHtmlEntities(m[1]),
      summary: decodeHtmlEntities(m[2]),
      url: m[3] ? m[3].trim() : '',
      type: 'Perspective',
    });
  });

  docFiles.forEach((file) => {
    const lower = file.toLowerCase();
    if (lower.includes('article') || lower.includes('perspective') || lower.includes('publication') || lower.includes('essay')) {
      const baseName = path.basename(file, path.extname(file)).replace(/[-_]/g, ' ');
      const title = baseName.charAt(0).toUpperCase() + baseName.slice(1);
      if (!articles.some((a) => a.title.toLowerCase() === title.toLowerCase())) {
        articles.push({
          title,
          summary: `Insightful strategic perspective and analysis on ${title.toLowerCase()}.`,
          type: 'Perspective',
        });
      }
    }
  });

  return articles;
}

function extractSpeakingFromText(text, docFiles) {
  const speaking = [];
  const matches = [...text.matchAll(/(?:Speaking|Keynote|Panel):\s*([^\n\r]+)(?:\n|\r)+Description:\s*([^\n\r]+)/gi)];
  matches.forEach((m) => {
    speaking.push({
      title: decodeHtmlEntities(m[1]),
      description: decodeHtmlEntities(m[2]),
    });
  });

  docFiles.forEach((file) => {
    const lower = file.toLowerCase();
    if (lower.includes('speaking') || lower.includes('keynote') || lower.includes('panel')) {
      const baseName = path.basename(file, path.extname(file)).replace(/[-_]/g, ' ');
      const title = baseName.charAt(0).toUpperCase() + baseName.slice(1);
      if (!speaking.some((s) => s.title.toLowerCase() === title.toLowerCase())) {
        speaking.push({
          title,
          description: `Keynote address and panel discussion on ${title.toLowerCase()}.`,
        });
      }
    }
  });

  return speaking;
}

function extractVideosFromText(text, docFiles) {
  const videos = [];
  const matches = [...text.matchAll(/(?:Video|Watch):\s*([^\n\r]+)(?:\n|\r)+URL:\s*(https?:\/\/[^\s\n\r]+)/gi)];
  matches.forEach((m) => {
    videos.push({
      title: decodeHtmlEntities(m[1]),
      youtubeUrl: m[2].trim(),
    });
  });
  return videos;
}

function extractCoursesFromText(text, docFiles) {
  return [];
}

function extractPortfolioFromText(text, docFiles) {
  return [];
}

function mergeAndDeduplicate(prevArray, newArray, keyFn) {
  const map = new Map();
  (prevArray || []).forEach((item) => {
    const k = keyFn(item).toLowerCase().trim();
    if (k) map.set(k, item);
  });
  (newArray || []).forEach((item) => {
    const k = keyFn(item).toLowerCase().trim();
    if (k) {
      if (map.has(k)) {
        map.set(k, { ...map.get(k), ...item });
      } else {
        map.set(k, item);
      }
    }
  });
  return Array.from(map.values());
}

function parseComprehensiveExtractedText(text, slug, docFiles) {
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
    ideas: consolidated.ideas,
    speaking: consolidated.speaking,
    videos: consolidated.videos,
    courses: consolidated.courses,
    communities: consolidated.communities,
    portfolio: consolidated.portfolio,
    gallery: consolidated.gallery,
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
