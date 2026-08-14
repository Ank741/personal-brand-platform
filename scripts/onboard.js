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

function runOnboard() {
  const rawArgs = process.argv.slice(2).filter((a) => !a.startsWith('--'));

  if (rawArgs.length === 0) {
    console.error('\x1b[31m%s\x1b[0m', 'ERROR: Client slug or name is required.');
    console.log('Usage: npm run onboard -- <client-name>');
    console.log('Example: npm run onboard -- "Amay Goyal"');
    process.exit(1);
  }

  const clientNameInput = rawArgs.join(' ');
  const clientSlug = toCanonicalSlug(clientNameInput);

  const projectRoot = path.resolve(__dirname, '..');
  const onboardingDir = path.join(projectRoot, 'onboarding', clientSlug);
  const rawDir = path.join(onboardingDir, 'raw');
  const processedDir = path.join(onboardingDir, 'processed');
  const assetsDir = path.join(onboardingDir, 'assets');

  // Create directories safely without deleting existing contents
  const dirsToCreate = [
    { path: rawDir, name: 'raw/' },
    { path: processedDir, name: 'processed/' },
    { path: assetsDir, name: 'assets/' },
  ];

  dirsToCreate.forEach((dir) => {
    if (!fs.existsSync(dir.path)) {
      fs.mkdirSync(dir.path, { recursive: true });
    }
  });

  console.log(`\n==================================================`);
  console.log(`CLIENT WORKSPACE CREATED: onboarding/${clientSlug}/`);
  console.log(`==================================================`);
  console.log(`Client Name:    ${clientNameInput}`);
  console.log(`Canonical Slug: \x1b[32m${clientSlug}\x1b[0m`);
  console.log(`\nNow put ALL files received from the client into:`);
  console.log(`\x1b[36monboarding/${clientSlug}/raw/\x1b[0m`);
  console.log(`\nThen run:`);
  console.log(`\x1b[32mnpm run process-client -- "${clientNameInput}"\x1b[0m`);
  console.log(`==================================================\n`);
}

runOnboard();
