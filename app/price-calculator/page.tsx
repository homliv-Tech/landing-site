import type { Metadata } from "next";
import CalculatorPage from "@/components/calculator/calculator-page";
import "./pricing.css";

export const metadata: Metadata = {
  title: "Interior price calculators | Homliv",
  description:
    "Estimate the cost of a modular kitchen, bedroom or full home interior. Choose a layout, measurements and package to see an indicative price.",
};

export default function PriceCalculatorPage() {
  return <CalculatorPage />;
}
