Service: Homliv architectural design for homeowners. Main action: Start your project.
Deal: split hero. Existing Homliv ivory/forest palette and DM Sans retained to keep the site consistent; no new typeface. No grounds, effects, moments or scenes. Existing Next.js structure retained instead of replacing the app with the standalone starter.
Projects hero: category and a photograph, split, 1 screen. Existing design-inspiration imagery; no claim of built work.
Homepage featured work: heading and two equal photographic links, 1 screen desktop; stack naturally on phones.
Projects index: category filters and complete collection links; content-driven to accommodate future projects.
Project detail: introduction and ordered photo gallery; content-driven to support arbitrary photo counts and portrait photography.
Existing navigation/footer reused. Project photograph zooms and card lifts are scoped in projects.module.css; shared controls use app/globals.css.
No prices, dates, addresses or project facts invented. Existing three inspiration titles retained, with four Unsplash frames stored locally; replace with approved project names and R2 photos when supplied.

Validation notes:
- Production build and TypeScript pass. Full initial test suite: 114 pass; an additional category-filter interaction test passes. Targeted updated tests: 3 pass. ESLint: new code clean; existing header img warning remains.
- Skill layout/check.mjs crashes on CSS-module-based existing app structure (undefined sections). Kit files were not modified.
- Initial consistency run: 110 FAIL / 14 WARN. It passes assets, empty visuals, overlap, spill, contrast, links, reduced motion and hidden content. This is not a clean skill-check result.
- Structural findings: the app retains CSS Modules, its page wrapper, shared header/footer and content-driven catalogue/gallery heights rather than the standalone starter's literal .wrap and fixed screen grid. Those findings are accepted integration exceptions. Section-height/one-section/one-heading/split-pair/layout-scale checks therefore do not pass.
- CTA/headings findings: navigation retains Project enquiry; gallery navigation and the closing CTA remain text links. Existing inspiration collection names retained. The close is intentionally a short text invitation beside the existing footer, without a further photo or forced blank viewport.
- Motion-layer detection expects an unbundled motion.css filename. The kit CSS is bundled by Next.js; m-zoom hooks remain. This finding is a detector mismatch.
- Image sizing findings prompted correction of full-width card sizes and taller hero crop resolution. Actual source dimensions were corrected. Hero now uses a separate frame from collection covers and derives a real collection count in the first screen.
- Responsive screenshot review prompted correction of the mobile headline's joined words and the shared logo's mobile crop on project pages.
- No verified Next.js issue retained for agent feedback; the checker error is in the skill, not Next.js.
- Final first responsive screenshot set reviewed at 1440/1024/820/768/390 and detail page at 390. Tablet review also prompted keeping explicit headline line breaks at that size.
- Initial production perf: 815 KiB transfer desktop / 656 KiB phone; images 233 / 89 KiB; CLS 0.000, no broken requests, no WebGL, low blocking time. FAIL: 1,425 KiB parsed JS from the complete application bundle exceeds the kit's 900 KiB cap; this remains a limitation (shared framework/analytics runtime retained). The dimensions check flagged Next Image fill frames; changed project images to explicit width/height plus CSS cover and added logo dimensions. The large original logo source is an existing WARN.
- Final perf recheck: explicit image dimensions now PASS (0 missing). Only FAIL is parsed JS budget at both viewport sizes; logo oversize remains WARN. Images, CSS, fonts, requests, lazy loading, zero layout shift and zero broken requests PASS. Final homepage screenshot reviewed: rebuilt featured section renders with two equal, linked photographs. Final 820 screenshot reviewed after headline fix.
- Final feedback reporting pass: no qualifying verified Next.js feedback candidates; no feedback command required.

Bento refinement (user request): homepage now features up to three projects in a 7/5-column composition, with the lead card spanning two rows. The project index repeats the pattern and closes incomplete groups without holes. Project detail galleries use the same mixed-size grid, with full-size image links and natural photo proportions on phones. This user-requested composition supersedes the initial equal-card plan. No new assets, invented project facts or Next.js feedback candidates.

Scope correction: user excluded the homepage from the bento change. Homepage restored to its prior two equal photographic cards and section sizing. Only the project index and detail galleries use bento layouts. Category filtering tests, TypeScript and ESLint pass; desktop and phone project screenshots reviewed. Feedback reporting pass: no qualifying Next.js candidates.

Motion isolation correction: removed the copied global motion.css and every import and m-zoom hook. Image zoom now uses the CSS Module zoom class, including reduced-motion handling. Removed the obsolete root data-motion attribute and unused --bg/--action aliases. Undeclared --line-strong, --r-btn and --action-ink references disappeared with the unused generic controls; existing --ink and --card definitions remain untouched. No site-wide motion rules were added. Next.js feedback reporting pass: no qualifying candidates.
