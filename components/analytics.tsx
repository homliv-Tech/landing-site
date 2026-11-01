"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) return;

    const seen = new Set<string>();
    let observer: IntersectionObserver | undefined;
    const observeSections = () => {
      if (observer || document.querySelector('[data-preloader-active="true"]')) return;
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const name = (entry.target as HTMLElement).dataset.analyticsSection;
          if (!name || seen.has(name) || !entry.isIntersecting || entry.intersectionRect.height < Math.min(150, entry.boundingClientRect.height * 0.5)) continue;
          seen.add(name);
          posthog.capture("section_viewed", { section: name, page_path: pathname });
          observer?.unobserve(entry.target);
        }
      }, { threshold: [0, 0.1, 0.25, 0.5, 1] });
      document.querySelectorAll("[data-analytics-section]").forEach((section) => observer?.observe(section));
    };
    const preloaderObserver = new MutationObserver(observeSections);
    preloaderObserver.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["data-preloader-active"] });
    observeSections();

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-enquiry-location]") : null;
      if (target) posthog.capture("enquiry_clicked", { location: target.dataset.enquiryLocation, page_path: pathname });
    };
    document.addEventListener("click", onClick);
    return () => { observer?.disconnect(); preloaderObserver.disconnect(); document.removeEventListener("click", onClick); };
  }, [pathname]);

  return null;
}
