# Client Onboarding Business Workflow

This document details the operational business process for onboarding new paying clients to the Personal Brand Platform.

---

## Operating Flow Overview

```
Client Sends Information / Questionnaire
                 │
                 ▼
Create onboarding/client-slug/ Directory
                 │
                 ▼
Add intake.json & Media Assets
                 │
                 ▼
Run `npm run create-client -- <client-slug>`
                 │
                 ▼
Review READINESS_REPORT.md & Test Preview (`/?client=slug`)
                 │
                 ▼
Perform Minor Editorial Adjustments (if needed)
                 │
                 ▼
Run `npm run build`
                 │
                 ▼
Git Commit & Git Push to `main`
                 │
                 ▼
Vercel Automatically Deploys Single Platform Engine
                 │
                 ▼
Connect Client Domain in Vercel DNS
                 │
                 ▼
CLIENT WEBSITE LIVE 🚀
```

---

## Detailed Step-by-Step Operator Guide

### Step 1: Receive Client Information
Gather the client's information using the standard intake fields:
- Identity: Name, title/headline, location, short bio, long bio.
- Contact: Email, LinkedIn, X, Instagram, YouTube.
- Content: Core expertise, achievements/metrics, thought leadership ideas, speaking topics, portfolio/initiatives.
- Photography: Headshots / portrait photos.

### Step 2: Create Onboarding Directory
Duplicate `onboarding/template/` to `onboarding/<client-slug>/`:
```bash
cp -r onboarding/template onboarding/john-smith
```

### Step 3: Populate `intake.json` & Place Assets
1. Fill out `onboarding/john-smith/intake.json`.
2. Place the client's headshots in `onboarding/john-smith/profile/profile.jpg`.
3. Place optional topic graphics in `onboarding/john-smith/speaking/`, `portfolio/`, etc.

### Step 4: Run the Generator Script
In your terminal, execute:
```bash
npm run create-client -- john-smith
```

The generator will:
- Validate required fields (ERROR if missing).
- Detect and copy media assets to `public/clients/john-smith/`.
- Automatically select visual brand style (`executive` vs `modern`).
- Determine section visibility (only enable sections with real content).
- Register `johnSmithClient` in `src/clients/index.ts`.
- Output the readiness report and preview link.

### Step 5: Review & Preview Locally
1. Read `onboarding/john-smith/READINESS_REPORT.md`.
2. Open your local browser to test:
   `http://localhost:3000/?client=john-smith`
3. Verify that only relevant sections appear, typography is sharp, and navigation links update dynamically.

### Step 6: Build Verification
Run the production build check:
```bash
npm run build
```
Verify `0` TypeScript or compilation errors.

### Step 7: Deploy & Connect Custom Domain
```bash
git add .
git commit -m "Onboard new client: John Smith"
git push origin main
```
1. Vercel automatically builds and deploys the update.
2. In your Vercel project settings, add the client's custom domain (e.g. `johnsmith.com`).
3. Set the client's DNS CNAME / A record to point to Vercel.
4. The platform's tenant resolution engine will automatically serve John Smith's personal brand website on `johnsmith.com`.
