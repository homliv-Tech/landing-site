import posthog from "posthog-js";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
if (token) {
  posthog.init(token, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    defaults: "2026-08-30",
    capture_pageview: "history_change",
    autocapture: false,
    disable_session_recording: true,
    cookieless_mode: "always",
    person_profiles: "never",
  });
}
