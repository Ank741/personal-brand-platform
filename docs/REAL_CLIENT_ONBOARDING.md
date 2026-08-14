# Real Client Raw-Drop Onboarding Guide

This guide details the two-stage **Raw-Drop Onboarding Workflow** for non-developer operators.

---

## 2-Stage Operating Workflow

```
STAGE A: RAW MATERIAL INGESTION & PREPARATION
Client Email / Attachments
          │
          ▼
1. Create onboarding/<client-slug>/raw/
          │
          ▼
2. Drop ALL unedited raw files (Word, PDF, photos, text)
          │
          ▼
3. Run: npm run prepare-client -- <client-slug>
          │
          ▼
4. Review intake.json & PREPARATION_REPORT.md


STAGE B: WEBSITE GENERATION & DEPLOYMENT
5. Run: npm run create-client -- <client-slug>
          │
          ▼
6. Run: npm run dev
          │
          ▼
7. Preview locally (http://localhost:3000/?client=<client-slug>)
          │
          ▼
8. Client Approval -> Git Commit & Push -> Vercel Deployment -> Connect Domain
```

---

## Operator Step-by-Step Instructions

### Step 1: Receive Client Email & Create Raw Directory
When a new client signs on, create their dedicated raw drop directory:
```bash
mkdir -p onboarding/palak-mehta/raw/
```

### Step 2: Save All Untouched Attachments
Drop whatever raw material the client provided directly into `onboarding/<client-slug>/raw/`:
- `Personal_Brand_Website.docx` or `raw-info.txt`
- `CV.pdf`
- `profile.jpg` or photos
- `links.txt`

*Rule: Never edit, rename, or delete original files inside `/raw/`. They are the pristine source of truth.*

### Step 3: Run Stage A Preparation
In your terminal, run:
```bash
npm run prepare-client -- palak-mehta
```
What this does:
- Scans all files in `/raw/`.
- Safely copies images into `onboarding/palak-mehta/assets/`.
- Extracts structured identity, expertise, and section preferences into `onboarding/palak-mehta/intake.json`.
- Produces `onboarding/palak-mehta/PREPARATION_REPORT.md`.

### Step 4: Operator Review & Editorial Verification
1. Open `onboarding/palak-mehta/intake.json`.
2. Verify extracted details (name, headline, bio, expertise items).
3. If necessary, make quick text edits directly in `intake.json`.

### Step 5: Run Stage B Website Generation
In your terminal, run:
```bash
npm run create-client -- palak-mehta
```
What this does:
- Validates intake data against platform benchmarks.
- Evaluates content availability to automatically hide empty sections.
- Generates strongly-typed profile configuration `src/clients/palak-mehta.ts`.
- Registers client in central registry `src/clients/index.ts`.
- Produces `onboarding/palak-mehta/READINESS_REPORT.md`.

### Step 6: Preview & Client Approval
Start the development server:
```bash
npm run dev
```
Open `http://localhost:3000/?client=palak-mehta` in your browser.
Review section spacing, typography, and section visibility with your client.

### Step 7: Deploy & Connect Custom Domain
```bash
npm run build
git add .
git commit -m "Onboard client: Palak Mehta"
git push origin main
```
1. Vercel automatically deploys the updated single-codebase platform.
2. In Vercel DNS settings, add `palakmehta.com`.
3. Point client's DNS records to Vercel.
4. Client site is LIVE! 🚀
