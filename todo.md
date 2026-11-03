# PostHog setup

- [ ] Create a [PostHog account](https://posthog.com/) and a project. Choose the region appropriate for your business.
- [ ] Find the **project token** and ingestion host in the project settings. Use the public project token, not a personal API key.
- [ ] Create `.env.local` in the repository root for local testing:

  ```env
  NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=your_project_token
  NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
  ```

  Replace the host with your project's ingestion host if using a different region. Restart the development server after changing these values. These are public browser-side settings; never put a personal API key here.
- [ ] Add the same variables to your hosting provider's build environment and redeploy. Next.js embeds `NEXT_PUBLIC_` values at build time.
- [ ] Visit the deployed site and check PostHog's activity/events view for `$pageview`, `section_viewed` (with `section` and `page_path`), and `enquiry_clicked` (with `location` and `page_path`). Scroll to sections and click the project enquiry links to test. Section views are recorded once per section per page visit when a meaningful portion appears; a view does not mean it was read.
- [ ] Create a dashboard or insights for unique visitors, page views, section views, and enquiry clicks. Filter your own test traffic if needed. Browser blockers can prevent some events from being recorded.
- [ ] Add real contact details or a working enquiry form. The current enquiry links lead to a placeholder; clicks do not mean an enquiry was submitted. When a form is added, track successful submissions separately.
- [ ] Review the site's privacy notice and applicable consent requirements for the regions you serve before launching analytics. This integration uses PostHog cookieless mode, disables session recording and automatic click capture, and does not create person profiles.

# Cloudflare R2 team photos

- [ ] Confirm team members’ names and add their roles in `app/team/page.tsx`.
- [ ] Check the deployed team page on mobile and desktop. If replacing a photo at the same URL, account for CDN/browser caching or upload it under a new key.

The team page uses public image URLs from `assets.homliv.co.in`; it does not require R2 credentials.
