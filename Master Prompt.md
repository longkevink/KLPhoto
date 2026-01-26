# Antigravity Master Prompt — Boutique Photography Gallery Site (Next.js App Router)

## 0) How to Use This Prompt (Critical)
You will execute this work as two clearly separated runs to avoid scope confusion.

### Prompt A — UI/UX Implementation Run
**Role:** Senior Frontend UX Engineer + Creative Director  
**Owns:** components, layout, styling, motion, interaction patterns, accessibility behaviors in the UI  
**Delivers:** pages + components + animations as specified below

### Prompt B — Architecture/Backend Implementation Run
**Role:** Senior Full-Stack Engineer (architecture-first)  
**Owns:** routing strategy, content model, metadata/SEO, image pipeline, performance constraints, deployment readiness  
**Delivers:** data model, content loading, server/client boundaries, SEO/metadata, build/deploy config, lint/format

**Rule:** Do not blur responsibilities. If running Prompt A, do not redesign architecture. If running Prompt B, do not redesign UI.

---

## 1) Product Intent
Create an extremely high-polish, boutique/gallery website for my photography work. The site is designed to **exhibit** and **sell** prints. The primary objective is **showcasing the work**. The secondary objective is **linking to Etsy** (no onsite checkout).

**Key aesthetic principle:** Negative space and “breath” around the artwork is a primary element.

---

## 2) Sitemap (Routes)
Use Next.js App Router file-based routing:

- `/` — Home
- `/exhibit` — Exhibit (film-strip collections + spotlight)
- `/gallery` — Gallery (mock wall environments + framed visualization)
- `/links` — Links

### Deep Linking
- Exhibit spotlight must support deep linking via query param:
  - `/exhibit?photo=<id>`
- Spotlight must respect browser back/forward.

---

## 3) Non-Goals (v1 Scope Guardrails)
To prevent scope creep in v1, **do not** implement:
- User accounts / logins (except a simple owner/admin mode gate described below)
- On-site ecommerce, cart, checkout, payments
- CMS integration (Sanity/Contentful/etc.)
- Drag-and-drop wall designer (unless explicitly specified later)
- Complex 3D rendering, lighting simulation, AR, camera calibration

---

## 4) Technical Stack (Non-Negotiable)
- **Next.js (App Router)**
- **TypeScript** across the codebase
- Prefer **React Server Components** by default
- Use `use client` only when required (animations, interactive controls)
- Styling: **TailwindCSS**
- Animation: **Framer Motion**
- Deployment target: **Vercel**
- Images: **next/image** only (unless explicitly justified)
- Fonts: **next/font**

### Dependency Discipline
Keep dependencies minimal. UI-only libs are allowed (Framer Motion, Lucide). Backend logic must not depend on UI libraries.

---

## 5) Content Model (v1)
All image content must be **structured**, not hardcoded into components.

### Storage Plan (v1)
- Photos stored locally in: `/public/photos/...`
- Metadata stored in: `content/photos.ts` (or JSON) and imported server-side

### Photo Schema
Define a strict TypeScript type:

- `id: string` — unique
- `src: string` — local path under `/public`
- `alt: string` — must be meaningful (no empty alt)
- `title: string` — editorial display title
- `category: 'street' | 'travel' | 'moments'`
- `series?: string` — optional grouping
- `orientation: 'landscape' | 'portrait'`
- `width: number`
- `height: number`
- `featured: boolean` — used on Home and Selected Works
- `etsyUrl: string` — per-photo, but in v1 use the provided dummy Etsy link everywhere

**Rule:** No `any`. All metadata must be typed.

### Seed Content (v1)
Include 12 placeholder photo entries:
- 4 Street, 4 Travel, 4 Moments
- A mix of portrait and landscape
- At least 6 marked `featured: true`
- Use safe placeholder filenames like:
  - `/photos/street-01.jpg`, `/photos/travel-01.jpg`, `/photos/moments-01.jpg`, etc.

---

## 6) Navigation
Persistent minimalist header:
- Links: Home, Exhibit, Gallery, Links
- Sticky header transitions from transparent to lightly frosted on scroll using subtle `backdrop-blur`

---

## 7) Page Specifications

### 7.1 Home (`/`)
Home is the primary funnel; do not leave it TBD.

**Structure (v1):**
1. Full-viewport hero (single featured image) with centered editorial headline
2. Short editorial statement (1–2 lines)
3. “Selected Works” (6–12 images) displayed as masonry-style gallery
4. Two primary pathways (prominent but minimalist):
   - “Enter Exhibit”
   - “View Gallery”
5. Minimal footer (Links)


### 7.2 Exhibit (`/exhibit`)
A place to show off photos in a unique format.

#### Exhibit Concept
Film-strip-style presentation of collections without adding a film look—just clean white negative space between frames.

#### Sections
- Street, Travel, Moments
- A top tab/menu switches the active category/strip

#### Film Strip Interaction (v1)
- Horizontal strip with scroll-snap
- Input methods:
  - Mouse drag
  - Trackpad scroll
  - Arrow buttons
  - Keyboard arrows
- Mobile behavior:
  - One “frame” per snap point
  - Swipe navigation
  - If performance becomes an issue: allow a grid fallback on mobile

#### Visual Rules
- Clean white borders
- Primarily landscape photography, but must support portrait gracefully

#### Spotlight (Modal Overlay)
Clicking an image opens Spotlight.

**Spotlight requirements:**
- Implement as a modal overlay with:
  - Focus trap
  - ESC closes
  - Click backdrop closes
  - Dedicated close button
  - Scroll lock
- Deep-linking:
  - Opening Spotlight sets `/exhibit?photo=<id>`
  - Closing returns to `/exhibit` and restores scroll position

**Spotlight animation:**
- A “white plate” animates in, then the image appears on top.
- Two animation variants:
  - **Landscape:** plate reveals from top and bottom toward center
  - **Portrait:** plate reveals from left and right toward center
- After plate animation begins, the photo fades in over **150–250ms** with a subtle scale settle (e.g., `1.01 -> 1.0`).
- Total duration target: **0.6–0.9s**. No harsh easing; avoid elastic motion.

#### Etsy CTA + Owner/Admin Mode
Within Spotlight, add a **Buy print on Etsy** CTA that is only visible in **Owner/Admin Mode**.

**Owner/Admin Mode (v1):**
- Controlled via environment variable:
  - `NEXT_PUBLIC_ADMIN_MODE=true`
- If false or absent, hide all admin-only toggles and controls.
- This is acceptable for v1; do not treat this as secure authentication.


### 7.3 Gallery (`/gallery`)
The goal is to visualize what the artwork would look like framed on your wall, and link to Etsy.

#### Layout
- Left rail: gallery of items (thumbnails)
- Main canvas: environment wall preview

#### Filtering
- Tags: Street, Travel, Moments
- When no filter is selected:
  - Show thumbnails grouped by category

#### Environments (MVP)
Use 3 static backgrounds:
- Home
- Office
- Business

**Rule:** No 3D. Just high-quality static environment images.

#### Frame Visualization (MVP)
- Frames implemented as simple CSS styling:
  - frame border + optional mat
- Provide 2–3 simple options:
  - frame style: thin black, thin white, natural wood (or similar)
  - mat: none vs subtle white mat

#### Layout Templates (MVP)
Must account for portrait vs landscape.

- Single photo (native aspect)
- Gallery wall: 3 across, 6 photos (3x2)
- Collage: 5, 7, 9 photos of mixed formats

**Deterministic placement rules:**
- Selecting an image places it into the **next available slot** in the active template.
- Provide controls:
  - “Clear layout”
  - Optional: “Auto-fill remaining slots” (same category)

#### Etsy Integration
- Etsy CTA appears in a detail panel for the currently selected image/slot.
- Use one consistent label: **Buy print on Etsy**


### 7.4 Links (`/links`)
Simple split page:
- Left: Etsy
- Right: Instagram

Instagram link:
- https://www.instagram.com/ke_long/

---

## 8) UI/UX Aesthetic Directives (Prompt A)
Blend:
- **Poetic Minimalism** (Reseda-like)
- **Editorial Authority** (McCurry-like)

### Vibe
Ultra-minimalist luxury. UI visually disappears. Heavy negative space.

### Typography
Strong editorial hierarchy:
- Headlines: elegant serif (Playfair Display / Cormorant Garamond)
- Body/UI: clean sans (Inter / Lato)

High contrast:
- Background: `#FAFAFA`
- Text: near-black (e.g., `#1A1A1A`)

### Layout
- Hero is full viewport with minimal UI chrome
- Galleries avoid rigid repetition; prefer organic masonry
- Sticky header transitions to frosted/blur on scroll

---

## 9) Interaction and Motion (Prompt A)
Motion must feel smooth and restrained.

- Scroll: no abrupt jumps
- Entrance animations: fade-in-up as items enter viewport with stagger
- Hover: subtle opacity shift or slow zoom (~`scale: 1.05`)
- Avoid sharp / elastic / distracting motion

### Reduced Motion
Respect `prefers-reduced-motion`:
- Reduce or disable non-essential animations

---

## 10) Performance Requirements (Prompt B)
Optimize for:
- Fast TTFB
- Low LCP
- Minimal JS bundle

Rules:
- Hero image uses `next/image` with `priority` and correct `sizes`
- Use blurred placeholders (`placeholder="blur"`) for above-the-fold images
- Lazy-load below-the-fold sections
- Do not animate heavy images on initial mount in a way that harms LCP

---

## 11) SEO + Metadata (Prompt B)
- Generate metadata server-side for each route (App Router metadata API)
- Canonical URLs
- Open Graph + Twitter card metadata
- Sitemap + robots
- Clean, semantic titles/descriptions

---

## 12) Accessibility (Prompt A + B)
- Modal focus trap + ESC close
- Keyboard navigation:
  - Exhibit strip (arrows)
  - Tabs
  - Gallery templates and slots
- ARIA labeling for interactive elements
- Ensure tab order is sensible

---

## 13) Masonry Strategy (Prompt A)
v1 masonry may use CSS columns:

- `columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8`
- children use `break-inside-avoid`

Note: CSS columns can affect reading order. v1 accepts this; revisit in v2 if chronological order or accessibility requires stricter ordering.

---

## 14) Folder Structure (Prompt B)
Recommend a clear layout:

- `app/(site)/page.tsx` etc.
- `app/(site)/exhibit/page.tsx`
- `app/(site)/gallery/page.tsx`
- `app/(site)/links/page.tsx`
- `components/` (UI components)
- `content/` (photo metadata)
- `lib/` (helpers: animations, utils)
- `styles/` (if needed)

---

## 15) Code Quality (Prompt B)
- ESLint + Prettier
- Deterministic builds (commit lockfile)
- No unused deps

---

## 16) Acceptance Criteria (Definition of Done)
### Global
- No broken routes
- No layout shift during font load (use `next/font`)
- Lighthouse (desktop) target: Performance 90+ (best effort), Accessibility high
- Images render via `next/image`, correct sizing

### Home
- Full-viewport hero + selected works masonry
- Clear paths to Exhibit and Gallery

### Exhibit
- Category tabs switch strips
- Strip supports drag + arrows + keyboard + mobile swipe
- Spotlight modal: focus trap, ESC close, backdrop click close
- Deep-linking works (`/exhibit?photo=<id>`) and back/forward behaves
- Owner/Admin Etsy CTA is hidden unless `NEXT_PUBLIC_ADMIN_MODE=true`

### Gallery
- Left rail with grouping by category when no filter
- Filters work
- Environments switch
- Layout templates (single / 3x2 / collage 5/7/9) work deterministically
- Selecting thumbnails fills slots
- Clear layout works
- Etsy CTA present in detail panel

### Links
- Split layout with Etsy and Instagram

---

## 17) References
### Etsy Dummy Link
Use this link for every Etsy action in v1:
- https://www.etsy.com/listing/1421980161/muir-woods-and-fern-creek-photo-redwood?ls=s&ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=photo+prints&ref=sr_gallery-1-39&sr_prefetch=1&pf_from=search&pro=1&frs=1&sts=1&content_source=8c92eca6-47d3-4501-b00e-3412fa50f615%253ALT376b5942c26e3adec6a78eb5175edbcb614a11f3&organic_search_click=1&logging_key=8c92eca6-47d3-4501-b00e-3412fa50f615%3ALT376b5942c26e3adec6a78eb5175edbcb614a11f3&variation0=3273691037

### Inspiration Sites
- Verge Style: https://photography-gammai-ai-demo.squarespace.com/
- Reseda: https://reseda-fluid-demo.squarespace.com/
- McCurry: https://mccurry-fluid-demo.squarespace.com/
