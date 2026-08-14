# Personal Brand Platform — Core Architecture

This document explains the technical architecture powering the multi-tenant Personal Brand Platform.

---

## High-Level Concept

The Personal Brand Platform operates as a **single, centrally managed Next.js application** that serves as the website engine for unlimited client brand websites. 

Instead of building and maintaining separate codebases for each client, all clients run off the **same reusable component engine**. Each client's unique brand, content, structure, styling, and domain are defined in a clean TypeScript configuration file.

```
                  ┌────────────────────────┐
                  │   Incoming HTTP Request│
                  └───────────┬────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │ Tenant Resolution Engine│
                  │  (src/lib/tenant.ts)   │
                  └───────────┬────────────┘
                              │
           ┌──────────────────┴──────────────────┐
           │                                     │
           ▼                                     ▼
 ┌───────────────────┐                 ┌───────────────────┐
 │ Alex Morgan Config│                 │ Maya Verma Config │
 │ (alexmorgan.com)  │                 │ (mayaverma.org)   │
 └─────────┬─────────┘                 └─────────┬─────────┘
           │                                     │
           └──────────────────┬──────────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │ Reusable Brand Engine  │
                  │ (src/components/brand) │
                  └────────────────────────┘
```

---

## 1. Client Data Model (`src/types/client.ts`)

The `ClientProfile` interface is the single source of truth for a client's website. It defines:

- **Identity**: Name, professional title, headlines, bios, location, headshots.
- **Brand System**: Accent color, secondary tint, hero variant (`executive` vs `modern`), section layout variants (`aboutVariant`, `expertiseVariant`, etc.).
- **Social & Contact Links**: LinkedIn, X, YouTube, Email, Office Hours.
- **Content Arrays**: Expertise, Achievements, Ideas/Articles, Speaking, Videos, Courses, Communities, Portfolio.
- **SEO & Microdata**: Dynamic title tags, meta descriptions, keywords, OpenGraph images, and Schema.org `Person` JSON-LD payload.
- **Section Visibility Flags**: Boolean toggles (`sections.about`, `sections.videos`, etc.) enabling or disabling individual website sections.

---

## 2. Client Configurations (`src/clients/`)

Each client has a dedicated file exporting their `ClientProfile`:

- `src/clients/alex-morgan.ts`: Executive / sophisticated transformation leader profile.
- `src/clients/maya-verma.ts`: Warm / thought-leadership healthcare innovator profile.
- `src/clients/index.ts`: Central registry providing index maps and domain lookups.

---

## 3. Tenant Resolution Engine (`src/lib/tenant.ts`)

When an HTTP request enters the app, `resolveClientProfile()` resolves the matching client:

1. **Development Query Parameter**: Checks `?client=id` (e.g. `?client=alex-morgan` or `?client=maya-verma`). This allows instant local preview testing of any tenant.
2. **Production Domain Matching**: Reads the HTTP `Host` header and matches it against `client.domain` (e.g., `alexmorgan.com` vs `mayaverma.org`).
3. **Fallback**: Defaults to `alexMorganClient` if no host or query parameter matches.

---

## 4. Reusable Presentation Components (`src/components/brand/`)

The platform contains 14 shared presentation components (`Hero`, `About`, `Expertise`, `Achievements`, `Ideas`, `Speaking`, `Videos`, `Courses`, `Community`, `Portfolio`, `Contact`, `SiteFooter`).

Key principles:
- **Zero Client Hardcoding**: Shared components contain no client-specific copy or text.
- **Automatic Section Hiding**: Components self-terminate (render `null`) if the section flag is set to `false` or if the client's content list for that section is empty.
- **Visual Layout Variants**: Components render different structural layouts depending on `brand.heroVariant` or section variant settings (e.g., Executive dark split vs Modern warm narrative).
- **Graceful Image Placeholders**: When client photos are not provided, components display clean, SVG-backed CSS placeholders.

---

## 5. Deployment Strategy

When deployed to hosting platforms like Vercel:
- All custom client domains (e.g., `alexmorgan.com`, `mayaverma.org`, `sam-taylor.com`) point to the **same single Next.js project deployment**.
- Vercel routes traffic to the application.
- Next.js inspects the incoming hostname in Server Components, resolves the correct `ClientProfile`, and renders the personalized website in milliseconds.
