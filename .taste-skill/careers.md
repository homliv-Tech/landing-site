Service — architectural design studio; careers subpage.
Deal: split hero; adapted to the existing Homliv ivory/forest palette, DM Sans, pill actions and shared navigation/footer. Flat grounds. No effects, moments or scenes.

Plan and copy
- One screen: careers headline, description of Homliv's work, Meet the team action, no-current-openings message and architectural interior photograph.
- Existing shared footer follows. No application form, invented roles, employment benefits, locations or hiring promises.
- Primary action: Meet the team → /team.

Assets
- public/images/careers/interior.webp is Unsplash architectural inspiration already used on the home page, not a photograph of Homliv's studio or project. Source: https://images.unsplash.com/photo-1600210492486-724fe5c67fb0 . Footer credit links to Unsplash.
- This one stand-in frame can be replaced by a commissioned photograph of a Homliv project or studio. No other client slots or missing assets.
- Brand name, logo, colours and font are existing assets. No prices, hours, addresses, names, benefits or statistics were assumed.
- Button hover, press, arrow and reduced-motion styles are adapted from the skill into careers.module.css. CSS Modules scope the rules and motion tokens to Careers; no global motion stylesheet is imported.

Verification
- Production build, TypeScript and changed-page/footer lint pass. The header has its pre-existing raw logo img lint warning.
- Existing mobile navigation test passes.
- Skill layout check and visual inspection cover 1440×900, 1024×768, 820×1180, 768×1024 and 390×844.
- Skill consistency audit passes overflow, overlap, cut text, fold action, contrast, reduced motion, links, assets, font loading and hover checks.

Design audit exceptions
The kit's generic consistency audit is not a clean pass for this integrated page. Its remaining rules require the kit's standalone markup and a full-screen footer. This page preserves the established site components instead:
- Short shared footer, its internal columns/padding, wrapper class names, and root React div trigger section-height, one-section, one-heading, container-edges, split-pair and some off-grid rules. Adding a screen of footer filler would not serve this short careers page.
- The hiring update is a genuine subsection of the hero, so its h2 is retained. “No current openings” clearly names the subsection despite the heading dictionary warning.
- The supplied hiring status is the first-screen fact; the fact detector only recognises numerical/date/location facts.
- “Meet the team” is a concrete verb/object label even though “Meet” is absent from the kit's verb list. “Project enquiry” is the site's existing shared header label.
- The status dot naturally indents its label by 14px; the surrounding content remains aligned.
- Library-photo warning is retained and the stand-in is disclosed above.
- The checker mistakes the mobile menu control for absent right-side content because it expects its own nav classes. Screenshots show the actual menu at the right edge.

Final results
- Layout check: zero findings at all five sizes, including the full 45-character headline stress test.
- Performance check against production, three runs at 1440 and 390: transfers 693/596 KiB, median LCP 172/84 ms, layout shift 0, zero broken requests. CPU headless timings are comparative, not field measurements.
- Performance remains over the kit's parsed-JavaScript budget: 1,421 KiB at both sizes (461 KiB transferred). The page adds no client component or JavaScript dependency; it uses the site's existing Next.js shell, header and analytics. Optimising the shared bundle is outside this careers-page change. This is a retained performance limitation, not a passing audit.
- Warnings also cover the existing SVG logo's oversized intrinsic dimensions and the fill image's intentional lack of width/height attributes; its parent reserves the full layout space, with zero measured layout shift.
- The original photo-upscale finding was addressed by requesting image sizes suitable for the tall desktop crop.
- Next.js feedback review: no verified qualifying framework issues retained; no feedback submission was needed.
