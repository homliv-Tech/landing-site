import { expect, test } from "bun:test";
import { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import SiteHeader from "../components/site-header";

test("selecting a mobile navigation link closes the menu without canceling navigation", async () => {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  try {
    await act(async () => root.render(createElement(SiteHeader)));
    const menu = container.querySelector("details");
    const link = menu.querySelector('a[href="/#studio"]');
    menu.open = true;
    const click = new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true });
    await act(async () => link.dispatchEvent(click));
    expect(menu.open).toBe(false);
    expect(click.defaultPrevented).toBe(false);
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});
