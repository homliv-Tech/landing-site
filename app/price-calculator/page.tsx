import { pageMetadata } from "@/lib/seo";
import CalculatorPage from "@/components/calculator/calculator-page";
import "./pricing.css";

export const metadata = pageMetadata({
  title: "Interior Design Cost Calculator | Homliv",
  description: "Estimate the cost of a modular kitchen, bedroom or full home interior. Choose a layout, measurements and package to see an indicative price.",
  path: "/price-calculator",
});

export default function PriceCalculatorPage() {
  return <CalculatorPage />;
}
