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

- [ ] Enable R2 in your [Cloudflare dashboard](https://dash.cloudflare.com/) and create a bucket for **public website assets**. Only put files you intend to make public in this bucket.
- [ ] Connect a custom domain, such as `assets.yourdomain.com`, under the bucket's **Settings → Custom Domains**. Cloudflare's `r2.dev` public development URL is rate-limited and intended for development, not production. See [Cloudflare's public bucket guide](https://developers.cloudflare.com/r2/buckets/public-buckets/).
- [ ] Upload the team photos to the bucket, for example `team/founder.webp`. Confirm each public object URL opens in a browser. Optimized, similarly sized portrait images work best.
- [ ] Add the public base URL (without an object path) to `.env.local` for local testing:

  ```env
  R2_PUBLIC_BASE_URL=https://assets.yourdomain.com
  ```

  Restart the development server after changing it. Add the same variable to your hosting provider's build environment and redeploy; this site prerenders the team page at build time.
- [ ] In `app/team/page.tsx`, replace each relevant `name: null` and `photoKey: null` with the person's name and their exact R2 object key, for example `name: "Jane Doe", photoKey: "team/founder.webp"`. Add or remove entries as needed, then rebuild and deploy. The placeholder stays visible until both the base URL and an object key are provided.
- [ ] Check the deployed team page on mobile and desktop. If replacing a photo at the same object key, account for CDN/browser caching or upload it under a new key.

The site reads public image URLs only: no R2 access key, secret, API token, or upload integration is needed. Do not put credentials in client-side variables or the repository. R2 has not yet been connected or tested with a real bucket.
