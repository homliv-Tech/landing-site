"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import BedroomCalculator from "@/components/calculator/bedroom-calculator";
import FullHomeCalculator from "@/components/calculator/full-home-calculator";
import KitchenCalculator from "@/components/calculator/kitchen-calculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CalculatorId } from "@/lib/calculator/types";

const tabs: { id: CalculatorId; label: string; caption: string }[] = [
  {
    id: "kitchen",
    label: "Kitchen",
    caption: "Layout, measurements and finishes",
  },
  {
    id: "bedroom",
    label: "Bedroom",
    caption: "Wardrobe and full-room scope",
  },
  {
    id: "full-home",
    label: "Full home",
    caption: "BHK, area, rooms and package",
  },
];

const faqs = [
  {
    value: "accuracy",
    question: "How accurate is this estimate?",
    answer:
      "The calculators use indicative market rates for materials, finishes and standard scope. The final quote depends on exact site measurements, material selection and any civil work.",
  },
  {
    value: "exclusions",
    question: "What is not included?",
    answer:
      "GST, appliances unless selected, mattresses and soft furnishings, painting, plumbing changes and structural work are not included unless they appear in your breakdown.",
  },
  {
    value: "changes",
    question: "Can I change my package later?",
    answer:
      "Yes. The package is a starting point. Our design team can adjust the scope, materials and finishes once we understand your site.",
  },
  {
    value: "measurements",
    question: "Why do you need measurements?",
    answer:
      "Kitchen pricing is based on counter length, while bedroom wardrobes are priced by front area. A more accurate measurement gives you a more useful estimate.",
  },
];

/** Accept only known calculator IDs from the URL hash or tab control. */
const isValidTab = (value: string): value is CalculatorId =>
  tabs.some((tab) => tab.id === value);

/** Keep calculator tabs, URL hashes and anonymous tab-view analytics in sync. */
export default function CalculatorPage() {
  const [active, setActive] = useState<CalculatorId>("kitchen");

  useEffect(() => {
    const applyHash = () => {
      const fromHash = window.location.hash.replace("#", "");
      if (isValidTab(fromHash)) setActive(fromHash);
    };

    const frame = window.requestAnimationFrame(applyHash);
    window.addEventListener("hashchange", applyHash);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", applyHash);
    };
  }, []);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) return;
    posthog.capture("calculator_tab_viewed", {
      calculator: active,
      page_path: "/price-calculator",
    });
  }, [active]);

  const selectTab = (id: CalculatorId) => {
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <main className="pricing-page" id="top">
      <SiteHeader
        current="pricing"
        variant="solid"
        enquiryLocation="pricing_header"
      />

      <section
        className="pricing-hero"
        data-analytics-section="pricing_intro"
      >
        <div className="section-top">
          <span>Price calculators</span>
          <span>HOMLIV</span>
        </div>
        <div className="pricing-hero-grid">
          <h1>
            Know what your
            <br />
            space will cost.
          </h1>
          <div className="pricing-hero-copy">
            <p>
              A directional estimate for your kitchen, bedroom or full home in
              minutes. Choose a calculator, share a few details and see an
              estimate before you commit.
            </p>
            <span className="pricing-hero-note">
              Indicative pricing · No sign-up required
            </span>
          </div>
        </div>
      </section>

      <Tabs
        value={active}
        onValueChange={(value) => {
          const next = String(value);
          if (isValidTab(next)) selectTab(next);
        }}
        className="calc-tabs-root"
      >
        <div className="calc-tabs-wrap">
          <TabsList
            className="calc-tabs"
            variant="line"
            aria-label="Choose a price calculator"
          >
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={
                  active === tab.id ? "calc-tab is-active" : "calc-tab"
                }
              >
                <span className="calc-tab-label">{tab.label}</span>
                <span className="calc-tab-caption">{tab.caption}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="kitchen" className="calc-section">
          <KitchenCalculator />
        </TabsContent>
        <TabsContent value="bedroom" className="calc-section">
          <BedroomCalculator />
        </TabsContent>
        <TabsContent value="full-home" className="calc-section">
          <FullHomeCalculator />
        </TabsContent>
      </Tabs>

      <section
        className="pricing-info section-space"
        data-analytics-section="pricing_how"
        aria-labelledby="pricing-how-heading"
      >
        <div className="section-top">
          <span>How it works</span>
          <span>01 — 03</span>
        </div>
        <div className="pricing-info-grid">
          <h2 id="pricing-how-heading">
            A clearer number,
            <br />
            before the first meeting.
          </h2>
          <div className="pricing-info-steps">
            <article>
              <span>01</span>
              <h3>Describe the space</h3>
              <p>
                Pick a layout, BHK type or bedroom scope. Standard measurements
                are filled in so you can move quickly.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Choose a finish</h3>
              <p>
                Compare Essentials, Premium, Luxe or a custom scope. Add
                appliances and services where they apply.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>See your estimate</h3>
              <p>
                Your estimate updates as you choose. Share it with our team for
                a site-specific quote.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section
        className="pricing-faq section-space"
        data-analytics-section="pricing_faq"
        aria-labelledby="pricing-faq-heading"
      >
        <div className="section-top">
          <span>Good to know</span>
          <span>FAQ</span>
        </div>
        <div className="pricing-faq-grid">
          <h2 id="pricing-faq-heading">A few things to keep in mind.</h2>
          <Accordion className="pricing-faq-list">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.value}
                value={faq.value}
                className="pricing-faq-item"
              >
                <AccordionTrigger className="pricing-faq-trigger">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pricing-faq-content">
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
