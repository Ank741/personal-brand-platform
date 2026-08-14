# Client Onboarding Template

Use this folder template when onboarding a new personal brand client.

---

## Instructions

1. **Duplicate Folder**:
   Copy `onboarding/template/` to `onboarding/<client-slug>/`
   *(Example: `onboarding/john-smith/`)*

2. **Fill Out Intake Form**:
   Open `onboarding/<client-slug>/intake.json` and enter the client's information.

3. **Add Available Media Assets**:
   Place client images in the appropriate subfolder:
   - `/profile/` — Headshots / main portrait (e.g. `profile.jpg`)
   - `/hero/` — Hero background / featured photo
   - `/articles/` — Article thumbnails
   - `/speaking/` — Stage / conference photos
   - `/videos/` — Video thumbnails
   - `/portfolio/` — Project case study graphics
   - `/other/` — Any additional brand graphics

4. **Generate Client Site**:
   Run the platform generator command:
   ```bash
   npm run create-client -- <client-slug>
   ```
   *(Example: `npm run create-client -- john-smith`)*

5. **Review Readiness Report**:
   Check `onboarding/<client-slug>/READINESS_REPORT.md` and test the local preview:
   `http://localhost:3000/?client=<client-slug>`
