const fs = require('fs');
const path = require('path');

function runPreparation() {
  const args = process.argv.slice(2);
  const clientSlug = args.find((a) => !a.startsWith('--'));
  const isOverwrite = args.includes('--overwrite');

  if (!clientSlug) {
    console.error('\x1b[31m%s\x1b[0m', 'ERROR: Client slug is required.');
    console.log('Usage: npm run prepare-client -- <client-slug> [--overwrite]');
    console.log('Example: npm run prepare-client -- palak-mehta');
    process.exit(1);
  }

  const projectRoot = path.resolve(__dirname, '..');
  const onboardingDir = path.join(projectRoot, 'onboarding', clientSlug);
  const rawDir = path.join(onboardingDir, 'raw');
  const assetsDir = path.join(onboardingDir, 'assets');
  const intakePath = path.join(onboardingDir, 'intake.json');
  const reportPath = path.join(onboardingDir, 'PREPARATION_REPORT.md');

  console.log(`\n==================================================`);
  console.log(`PERSONAL BRAND PLATFORM — CLIENT PREPARATION (STAGE A)`);
  console.log(`Client Slug: ${clientSlug}`);
  console.log(`==================================================\n`);

  // 1. Verify /raw/ folder exists
  if (!fs.existsSync(rawDir)) {
    console.error('\x1b[31m%s\x1b[0m', `ERROR: Raw directory not found at: onboarding/${clientSlug}/raw/`);
    console.log(`\nPlease set up the raw drop folder first:`);
    console.log(`1. Create directory: onboarding/${clientSlug}/raw/`);
    console.log(`2. Drop raw client files (CV, Word docs, images, raw-info.txt) into it.`);
    console.log(`3. Re-run: npm run prepare-client -- ${clientSlug}\n`);
    process.exit(1);
  }

  // 2. Ensure /assets/ working directory exists
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // 3. Scan /raw/ files
  const rawFiles = fs.readdirSync(rawDir).filter((f) => !f.startsWith('.'));
  
  if (rawFiles.length === 0) {
    console.warn('\x1b[33m%s\x1b[0m', `WARNING: onboarding/${clientSlug}/raw/ directory is empty.`);
  }

  const imageFiles = [];
  const documentFiles = [];
  const otherFiles = [];

  rawFiles.forEach((file) => {
    const ext = path.extname(file).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(ext)) {
      imageFiles.push(file);
    } else if (['.txt', '.pdf', '.docx', '.doc', '.md'].includes(ext)) {
      documentFiles.push(file);
    } else {
      otherFiles.push(file);
    }
  });

  // 4. Safely copy images from /raw/ to /assets/ without modifying /raw/
  const candidateProfileImages = [];
  imageFiles.forEach((img) => {
    const src = path.join(rawDir, img);
    const dest = path.join(assetsDir, img);
    fs.copyFileSync(src, dest);

    if (/(profile|headshot|portrait|avatar)/i.test(img)) {
      candidateProfileImages.push(img);
    }
  });

  // 5. Parse raw-info.txt if available and intake.json does not exist
  let intakeCreated = false;
  let intakePreserved = false;
  let parsedInfo = {};

  if (fs.existsSync(intakePath) && !isOverwrite) {
    intakePreserved = true;
  } else {
    // Attempt parsing raw-info.txt or text documents in /raw/
    const txtFile = rawFiles.find((f) => f.toLowerCase() === 'raw-info.txt' || f.endsWith('.txt'));
    
    if (txtFile) {
      const txtContent = fs.readFileSync(path.join(rawDir, txtFile), 'utf8');
      parsedInfo = parseRawInfoText(txtContent);
    }

    const intakeData = buildIntakeFromParsed(parsedInfo, clientSlug, imageFiles);
    fs.writeFileSync(intakePath, JSON.stringify(intakeData, null, 2), 'utf8');
    intakeCreated = true;
  }

  // 6. Generate PREPARATION_REPORT.md
  const reportContent = `# Client Preparation Report (Stage A): ${parsedInfo.fullName || clientSlug}

**Client Slug:** \`${clientSlug}\`  
**Prepared At:** ${new Date().toISOString()}  
**Intake Status:** ${intakeCreated ? 'Created from Raw Data' : 'Preserved Existing'}  

---

## 1. Raw Files Submitted (\`onboarding/${clientSlug}/raw/\`)

${rawFiles.length > 0 ? rawFiles.map((f) => `- \`${f}\``).join('\n') : 'No raw files found.'}

- **Documents Found:** ${documentFiles.length} (${documentFiles.join(', ') || 'None'})
- **Images Found:** ${imageFiles.length} (${imageFiles.join(', ') || 'None'})

---

## 2. Asset Processing (\`onboarding/${clientSlug}/assets/\`)

- All ${imageFiles.length} raw image files safely preserved in \`/raw/\` and copied to \`/assets/\`.
${
  candidateProfileImages.length > 0
    ? `- **Proposed Profile Image Candidate:** \`${candidateProfileImages[0]}\``
    : '- **Image Status:** Image available — role requires operator review.'
}

---

## 3. Normalized Intake Data (\`onboarding/${clientSlug}/intake.json\`)

- **Name:** ${parsedInfo.fullName || 'Needs Review'}
- **Title:** ${parsedInfo.role || 'Needs Review'}
- **Location:** ${parsedInfo.location || 'Needs Review'}
- **Expertise Items:** ${parsedInfo.expertise ? parsedInfo.expertise.length : 0} items extracted
- **Achievements/Highlights:** ${parsedInfo.highlights ? parsedInfo.highlights.length : 0} items extracted

---

## 4. Next Steps for Operator

1. Review \`onboarding/${clientSlug}/intake.json\` to make any optional editorial adjustments.
2. Run Stage B website generation:
   \`\`\`bash
   npm run create-client -- ${clientSlug}
   \`\`\`
3. Preview website at [http://localhost:3000/?client=${clientSlug}](http://localhost:3000/?client=${clientSlug}).
`;

  fs.writeFileSync(reportPath, reportContent, 'utf8');

  // 7. Console Summary Output
  console.log('\x1b[32m%s\x1b[0m', 'STAGE A PREPARATION COMPLETE\n');
  console.log(`Raw Files Scanned:   ${rawFiles.length} files in onboarding/${clientSlug}/raw/`);
  console.log(`Documents Identified: ${documentFiles.length}`);
  console.log(`Images Copy-Processed:${imageFiles.length} copied to onboarding/${clientSlug}/assets/`);

  if (intakeCreated) {
    console.log(`Intake Status:        \x1b[32mCreated onboarding/${clientSlug}/intake.json\x1b[0m`);
  } else if (intakePreserved) {
    console.log(`Intake Status:        \x1b[33mPreserved existing intake.json (Run --overwrite to update)\x1b[0m`);
  }

  console.log(`\n==================================================`);
  console.log(`Preparation Report: onboarding/${clientSlug}/PREPARATION_REPORT.md`);
  console.log(`Next Command (Stage B): npm run create-client -- ${clientSlug}`);
  console.log(`==================================================\n`);
}

// Parser for raw-info.txt
function parseRawInfoText(text) {
  const info = {
    fullName: '',
    role: '',
    company: '',
    location: '',
    email: '',
    linkedin: '',
    headline: '',
    shortBio: '',
    longBio: '',
    expertise: [],
    highlights: [],
    brandPreference: '',
    disabledSections: [],
  };

  const lines = text.split('\n');
  let currentSection = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('Full Name:')) {
      info.fullName = trimmed.replace('Full Name:', '').trim();
      currentSection = null;
    } else if (trimmed.startsWith('Role:')) {
      info.role = trimmed.replace('Role:', '').trim();
      currentSection = null;
    } else if (trimmed.startsWith('Company:')) {
      info.company = trimmed.replace('Company:', '').trim();
      currentSection = null;
    } else if (trimmed.startsWith('Location:')) {
      info.location = trimmed.replace('Location:', '').trim();
      currentSection = null;
    } else if (trimmed.startsWith('Email:')) {
      info.email = trimmed.replace('Email:', '').trim();
      currentSection = null;
    } else if (trimmed.startsWith('LinkedIn:')) {
      info.linkedin = trimmed.replace('LinkedIn:', '').trim();
      currentSection = null;
    } else if (trimmed.startsWith('Headline:')) {
      info.headline = trimmed.replace('Headline:', '').trim();
      currentSection = null;
    } else if (trimmed.startsWith('Short Bio:')) {
      info.shortBio = trimmed.replace('Short Bio:', '').trim();
      currentSection = null;
    } else if (trimmed.startsWith('Long Bio:')) {
      info.longBio = trimmed.replace('Long Bio:', '').trim();
      currentSection = null;
    } else if (trimmed.startsWith('Brand preference:')) {
      info.brandPreference = trimmed.replace('Brand preference:', '').trim();
      currentSection = null;
    } else if (trimmed.startsWith('Expertise:')) {
      currentSection = 'expertise';
    } else if (trimmed.startsWith('Highlights:')) {
      currentSection = 'highlights';
    } else if (trimmed.startsWith('No:')) {
      currentSection = 'no';
    } else if (currentSection === 'expertise' && trimmed.startsWith('-')) {
      info.expertise.push(trimmed.replace(/^-/, '').trim());
    } else if (currentSection === 'highlights' && trimmed.startsWith('-')) {
      info.highlights.push(trimmed.replace(/^-/, '').trim());
    } else if (currentSection === 'no') {
      info.disabledSections.push(trimmed.toLowerCase().replace(/^-/, '').trim());
    }
  });

  return info;
}

// Build intake.json structure from parsed info
function buildIntakeFromParsed(info, slug, imageFiles) {
  const professionalTitle = info.role
    ? info.company
      ? `${info.role}, ${info.company}`
      : info.role
    : 'Professional Advisor';

  const headline = info.headline || `Pioneering ${info.role || 'Excellence'}`;
  const shortBio = info.shortBio || `${info.fullName} is an experienced ${professionalTitle}.`;
  const longBio = info.longBio || shortBio;

  const expertiseArray = (info.expertise || []).map((title) => ({
    title: title,
    description: `Advising leadership teams on strategic execution and ${title.toLowerCase()} operational frameworks.`,
  }));

  const achievementsArray = (info.highlights || []).map((hl) => {
    const match = hl.match(/^(\d+\+?|\$\w+)\s*(.*)/);
    if (match) {
      return { value: match[1], label: match[2] };
    }
    return { value: '✓', label: hl };
  });

  const sectionPref = {
    about: true,
    expertise: expertiseArray.length > 0,
    achievements: achievementsArray.length > 0,
    ideas: !info.disabledSections.includes('ideas') && !info.disabledSections.includes('articles'),
    speaking: !info.disabledSections.includes('speaking'),
    videos: !info.disabledSections.includes('videos'),
    courses: !info.disabledSections.includes('courses'),
    communities: !info.disabledSections.includes('communities'),
    portfolio: !info.disabledSections.includes('portfolio'),
    contact: true,
  };

  return {
    identity: {
      name: info.fullName || slug,
      professionalTitle: professionalTitle,
      location: info.location || 'Dubai, UAE',
      headline: headline,
      shortBio: shortBio,
      longBio: longBio,
    },
    contact: {
      email: info.email || 'contact@example.com',
      linkedin: info.linkedin || '',
    },
    expertise: expertiseArray,
    achievements: achievementsArray,
    ideas: [],
    speaking: [],
    videos: [],
    courses: [],
    communities: [],
    portfolio: [],
    sectionPreferences: sectionPref,
    branding: {
      style: info.brandPreference ? 'modern' : 'auto',
      accentColor: '#0d9488',
    },
    seo: {
      title: `${info.fullName || slug} | ${professionalTitle}`,
      description: shortBio,
      keywords: [info.fullName, professionalTitle, 'Advisory'],
    },
  };
}

runPreparation();
