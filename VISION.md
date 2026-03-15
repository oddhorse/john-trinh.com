# Portfolio Vision & Goals

Creative direction, goals, and roadmap for john-trinh.com.

*Last updated: 2025-12-25*

---

## Who is John Trinh?

Junior at NYU's Clive Davis Institute studying music production and creative technology. Works as **oddhorse** - a genre-bending electronic/hyperpop project that's also a platform for building creative tech tools.

**What you do:**
- Released music through Too Lost label
- Professional mixing/mastering services
- Custom performance technology (ESP32-based MIDI controllers, Max for Live devices, TouchDesigner visual systems)

**Technical depth:**
- 5+ years in Ableton Live (granular synthesis focus)
- 3000+ hours in Blender
- Hand-coded websites
- Microcontroller programming (C++, PlatformIO)

**Core philosophy:** Artist-technologist intersection - building the tools and systems needed to realize creative concepts rather than choosing between technical or creative work.

---

## Portfolio Purpose

**Primary goal:** General body of work for freelance opportunities, art opportunities, employers, collaborators, clients, and institutions.

**Future feature:** Filtered/curated views - ability to give different people custom links with a curated subset of projects for specific applications.

---

## What Makes the Work Unique

The thread connecting diverse artifacts: **Building infrastructure for creative concepts.**

- Create technical systems needed to execute ideas
- When a specific performance interface is needed → build a custom MIDI controller
- Client mixing/mastering work funds experimental work
- Technical depth applied pragmatically - tools serve vision, not the other way around
- Even internal tools get polished because the infrastructure itself matters

---

## Target Audience

- Potential employers
- Collaborators
- Clients (mixing/mastering, development)
- Art institutions

---

## Desired Feeling/Impression

> "The site should feel like digital art that happens to be highly functional."

**Non-negotiables:**
- Technical performance
- Usability
- Works flawlessly

**Within those constraints:**
- Distinctly yours - unique interactions, artistic visual choices
- Not templated-feeling
- Someone should think "this person makes digital art" not "this person used a portfolio template well"
- Simultaneously performant/professional AND unmistakably artistic

---

## Current State Audit (Dec 25, 2025)

### What Exists

**Structure:** ✅ Solid
- Eleventy 3.1.2 static site generator
- 33 artifacts (15 published, 18 drafts)
- Automatic responsive image optimization
- Category filtering (tech/art/brand)
- Dev/draft modes working
- GitHub Actions deployment

**Pages:**
- Homepage (artifact grid)
- Category pages (/tech, /art, /brand)
- Individual artifact pages
- About page (minimal)
- Credits page (music credits)
- Lost item page (QR destination)

### What's Missing/Weak

**Visual Design:** ❌ Essentially unstyled
- No CSS file exists (commented out in head.njk)
- Browser default styling only
- No typography system
- No color palette
- No spacing/layout system
- No responsive design beyond browser defaults

**Content Quality:** ⚠️ Inconsistent
- Some artifacts have good descriptions (glove-controller, bodach)
- Some are placeholder/WIP (oddhorse-visual-identity, m4l-grubbler)
- Many drafts are incomplete
- About page is very minimal (3 lines)

**Navigation/UX:** ⚠️ Basic
- Simple header nav exists (portfolio, about)
- Category nav commented out on listing pages
- No search
- No way to filter by multiple tags
- No "back to list" on artifact pages

**Missing Features:**
- No favicon assets (referenced but files don't exist)
- No OG image for social sharing
- Credits page nav link not in header
- No contact page (only email in about)

---

## Priority Framework

Given timeline pressure (need something live urgently), priorities are:

### P0: Must Have Now
Basic visual coherence and solid information that's presentable.

### P1: Should Have Soon
Features that make it feel intentional and polished.

### P2: Nice to Have Later
Distinctive artistic touches and advanced features.

---

## Goals & Tasks

### Phase 1: Presentable (P0) - URGENT

**Goal:** Get something visually coherent live that you wouldn't be embarrassed to share.

#### 1.1 Basic CSS System
- [ ] Create `/site/assets/css/main.css`
- [ ] Typography: Choose a clean, readable font stack (system fonts for now, custom later)
- [ ] Spacing: Consistent margins/padding using CSS custom properties
- [ ] Colors: Simple palette (background, text, accent, muted)
- [ ] Layout: Max-width container, responsive basics
- [ ] Links: Proper styling, hover states
- [ ] Images: Consistent sizing in listings, figure styling

#### 1.2 Homepage Polish
- [ ] Add brief intro text (who you are, what this is)
- [ ] Enable category nav (currently commented out)
- [ ] Style artifact grid for better visual hierarchy
- [ ] Ensure thumbnails display consistently

#### 1.3 About Page Expansion
- [ ] Expand bio with key points from your description above
- [ ] Add contact info (email at minimum)
- [ ] Consider adding links (oddhorse, social, GitHub)

#### 1.4 Content Audit
- [ ] Review all 15 published artifacts
- [ ] Ensure each has: proper title, clear subtitle, good description
- [ ] Fix any missing images or broken content
- [ ] Add missing tags where appropriate

#### 1.5 Technical Polish
- [ ] Add favicon files to /site/assets/favicon/
- [ ] Create OG image for social sharing
- [ ] Test responsive behavior
- [ ] Verify all links work

---

### Phase 2: Polished (P1) - Soon

**Goal:** Feels intentional and professional, good UX.

#### 2.1 Navigation Improvements
- [ ] Add Credits to header nav
- [ ] Add breadcrumb or "back to portfolio" on artifact pages
- [ ] Consider category pills/tabs on homepage
- [ ] Mobile nav (hamburger menu if needed)

#### 2.2 Artifact Page Improvements
- [ ] Better visual hierarchy (title, metadata, content)
- [ ] Related projects section (same tags)
- [ ] Next/previous navigation
- [ ] Tag display with links to filtered views

#### 2.3 Typography & Visual Refinement
- [ ] Custom web font (if desired)
- [ ] Fine-tune spacing, line-heights
- [ ] Add subtle visual flourishes (borders, shadows, etc.)
- [ ] Image gallery improvements (lightbox? larger view?)

#### 2.4 Content Expansion
- [ ] Finish WIP artifact entries
- [ ] Review and unpublish remaining drafts
- [ ] Consider adding project dates to listings
- [ ] Add more context to minimal entries

---

### Phase 3: Distinctive (P2) - Later

**Goal:** "Digital art that happens to be highly functional."

#### 3.1 Unique Interactions
- [ ] Custom cursor?
- [ ] Subtle hover effects
- [ ] Page transitions
- [ ] Scroll-based reveals

#### 3.2 Visual Identity
- [ ] Define and implement distinctive visual language
- [ ] Custom illustrations or decorative elements
- [ ] Explore animation possibilities
- [ ] Consider dark mode

#### 3.3 Filtered Links Feature
- [ ] Design URL scheme for custom views
- [ ] Implement tag-based filtering via URL params
- [ ] Create shareable curated collection links
- [ ] Consider password-protected views?

#### 3.4 Advanced Features
- [ ] Search functionality
- [ ] RSS feed
- [ ] Project timeline/archive view
- [ ] Analytics (if desired)

---

## Design Principles (To Develop)

*These are starting points to refine as we work:*

1. **Function first** - Everything must work flawlessly before it can be artistic
2. **Restraint** - Start minimal, add only what serves the work
3. **Consistency** - Same patterns throughout
4. **Speed** - Fast load times, no unnecessary weight
5. **Accessibility** - Works for everyone (keyboard nav, screen readers, color contrast)

---

## Visual Direction (TBD)

*To be developed - you mentioned not wanting to impose oddhorse's "digital skewed minimalism" here.*

Questions to explore:
- What feeling should the typography give? (technical? warm? neutral?)
- Dark or light mode default? Both?
- How much white space?
- Grid-based or more organic layout?
- Accent color or monochrome?
- Should project images dominate or text?

---

## Technical Decisions Log

*Record key decisions and rationale here as we make them.*

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-12-25 | Created VISION.md separate from CLAUDE.md | CLAUDE.md is technical docs, VISION.md is creative direction |
| | | |

---

## Session Notes

*Running notes from work sessions.*

### 2025-12-25
- Recovered CLAUDE.md from git after folder move lost it
- Updated CLAUDE.md with all current technical documentation
- Created VISION.md
- Current state: 15 published artifacts, 18 drafts, no CSS styling
- Priority: Get basic styling live urgently, polish later
