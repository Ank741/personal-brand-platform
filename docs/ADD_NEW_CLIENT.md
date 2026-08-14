# How to Add a New Client (Customer #3 Workflow)

This document provides the simplest step-by-step workflow for onboarding a new personal brand client to the platform without writing custom UI code.

---

## 1. Copy Existing Client Config

1. Open `src/clients/`
2. Duplicate an existing file (e.g. `alex-morgan.ts` or `maya-verma.ts`).
3. Rename the copy using the client's identifier (e.g. `sam-taylor.ts`).

---

## 2. Change Identity & Content

Open `sam-taylor.ts` and customize their profile:

```typescript
export const samTaylorClient: ClientProfile = {
  id: 'sam-taylor',
  domain: 'samtaylor.com',
  name: 'Sam Taylor',
  professionalTitle: 'FinTech Strategy & Capital Leader',
  headline: 'Scaling Modern Payment Systems & Global Capital Networks',
  subHeadline: 'Advising venture-backed FinTech entities on global expansion.',
  location: 'New York, NY',
  shortBio: 'FinTech executive with 12+ years building cross-border payment platforms.',
  longBio: 'Sam Taylor specializes in regulatory strategy, payment infrastructure scale...',
  // ...
};
```

---

## 3. Add Images

1. Create a directory structure under `public/clients/sam-taylor/`:
   - `profile/`
   - `hero/`
   - `ideas/`
   - `speaking/`
   - `videos/`
   - `courses/`
   - `community/`
   - `portfolio/`
2. Place headshots or media assets inside `public/clients/sam-taylor/profile/sam.jpg`.
3. Reference the paths in your config file (e.g., `profileImage: '/clients/sam-taylor/profile/sam.jpg'`).
4. *If no photos are uploaded, the platform automatically renders clean, elegant CSS visual placeholders.*

---

## 4. Choose Visual Variants

Select the layout variants that best match the client's persona:

```typescript
brand: {
  accentColor: '#4f46e5', // Brand Accent Color
  heroVariant: 'executive', // 'executive' or 'modern'
  aboutVariant: 'executive-split', // 'executive-split' or 'modern-narrative'
  expertiseVariant: 'editorial-list', // 'editorial-list' or 'cards-grid'
  achievementsVariant: 'executive-stats', // 'executive-stats' or 'modern-strip'
  portfolioVariant: 'case-study-cards', // 'case-study-cards' or 'minimal-grid'
}
```

---

## 5. Enable / Disable Sections

Toggle section visibility according to what content the client has:

```typescript
sections: {
  about: true,
  expertise: true,
  achievements: true,
  ideas: true,
  speaking: true,
  videos: false,       // Hide video section
  courses: false,      // Hide courses section
  communities: true,
  portfolio: true,
  contact: true,
}
```

*Note: Any section set to `true` will still hide automatically if the client's content list for that section is empty.*

---

## 6. Register & Test Locally

1. Register `samTaylorClient` in `src/clients/index.ts`:
   ```typescript
   import { samTaylorClient } from './sam-taylor';

   export const clients: Record<string, ClientProfile> = {
     'alex-morgan': alexMorganClient,
     'maya-verma': mayaVermaClient,
     'sam-taylor': samTaylorClient,
   };
   ```
2. Start the local dev server: `npm run dev`
3. Test locally by visiting: `http://localhost:3000/?client=sam-taylor`

---

## 7. Add Custom Domain Later

When setting up production hosting for Sam Taylor:
1. Ensure `domain` in `sam-taylor.ts` matches their live domain (e.g., `samtaylor.com`).
2. Point Sam's domain CNAME / A records to your Vercel deployment.
3. Add `samtaylor.com` as a custom domain in Vercel.
4. The platform's tenant resolution engine will automatically map requests for `samtaylor.com` to Sam Taylor's profile.

---

## 8. Commit and Deploy

```bash
git add .
git commit -m "Add Sam Taylor client profile"
git push origin main
```
Vercel will build and deploy the updated platform automatically!
