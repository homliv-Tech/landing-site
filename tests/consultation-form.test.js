import "./helpers/dom";
import { afterEach, beforeEach, expect, mock, test } from "bun:test";
import { createElement } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

mock.module("posthog-js", () => ({ default: { capture: () => {} } }));
const { default: ConsultationForm } =
  await import("../components/consultation-form");
const originalFetch = globalThis.fetch;
let fetchMock;

beforeEach(() => {
  fetchMock = mock(async () =>
    Response.json(
      { id: "11111111-1111-4111-8111-111111111111" },
      { status: 201 },
    ),
  );
  globalThis.fetch = fetchMock;
});

afterEach(() => {
  cleanup();
  globalThis.fetch = originalFetch;
});

async function fillForm(user) {
  await user.type(screen.getByLabelText(/^Full name/), "Test User");
  await user.type(screen.getByLabelText(/^Email address/), "test@example.com");
  await user.type(screen.getByLabelText(/^Phone number/), "+91 98765 43210");
  await user.type(screen.getByLabelText(/^Apartment address/), "Test Society");
  await user.click(screen.getByRole("combobox", { name: /^Apartment type/ }));
  await user.click(await screen.findByRole("option", { name: "2 BHK" }));
  await user.click(screen.getByRole("combobox", { name: /^Budget range/ }));
  await user.click(await screen.findByRole("option", { name: "₹10–20 lakh" }));
  await user.type(
    screen.getByLabelText(/^Tell us about your requirements/),
    "Kitchen and wardrobes",
  );
}

test("an empty form displays all errors, focuses the first field, and sends no request", async () => {
  const user = userEvent.setup();
  render(createElement(ConsultationForm));
  expect(document.querySelectorAll('[data-slot="form-message"]')).toHaveLength(
    0,
  );

  await user.click(
    screen.getByRole("button", { name: "Book free consultation" }),
  );
  await screen.findByText("Enter your full name.");

  expect(document.querySelectorAll('[data-slot="form-message"]')).toHaveLength(
    7,
  );
  expect(document.activeElement).toBe(screen.getByLabelText(/^Full name/));
  const email = screen.getByLabelText(/^Email address/);
  expect(
    document.getElementById(email.getAttribute("aria-describedby")).textContent,
  ).toBe("Enter your email address.");
  expect(fetchMock).not.toHaveBeenCalled();
});

test("blur validates a field and typing a valid value clears its error", async () => {
  const user = userEvent.setup();
  render(createElement(ConsultationForm));
  const email = screen.getByLabelText(/^Email address/);

  await user.click(email);
  await user.tab();
  await screen.findByText("Enter your email address.");
  await user.type(email, "invalid");
  await screen.findByText("Enter a valid email address.");
  await user.clear(email);
  await user.type(email, "test@example.com");

  await waitFor(() => expect(email.getAttribute("aria-invalid")).toBe("false"));
  expect(fetchMock).not.toHaveBeenCalled();
});

test("closing an empty dropdown shows its required-field message", async () => {
  const user = userEvent.setup();
  render(createElement(ConsultationForm));
  const apartment = screen.getByRole("combobox", { name: /^Apartment type/ });
  expect(apartment.getAttribute("aria-required")).toBe("true");
  await user.click(apartment);
  await user.keyboard("{Escape}");
  await screen.findByText("Select your apartment type.");
  expect(apartment.getAttribute("aria-invalid")).toBe("true");
});

test("selects submit their values and successful submission resets the form", async () => {
  const user = userEvent.setup();
  render(createElement(ConsultationForm));
  await fillForm(user);
  await user.click(
    screen.getByRole("button", { name: "Book free consultation" }),
  );
  await screen.findByText("Thank you for sharing your project.");

  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
    apartmentType: "2-bhk",
    budget: "10-20-lakh",
    email: "test@example.com",
  });

  await user.click(
    screen.getByRole("button", { name: "Send another enquiry" }),
  );
  expect(screen.getByLabelText(/^Full name/).value).toBe("");
  expect(
    screen.getByRole("combobox", { name: /^Apartment type/ }).textContent,
  ).toContain("Select type");
});

test("server field errors preserve input and allow a successful retry", async () => {
  fetchMock.mockImplementationOnce(async () =>
    Response.json(
      {
        error: "Please review the highlighted fields.",
        fields: { email: "Please use a different email address." },
      },
      { status: 400 },
    ),
  );

  const user = userEvent.setup();
  render(createElement(ConsultationForm));
  await fillForm(user);
  await user.click(
    screen.getByRole("button", { name: "Book free consultation" }),
  );
  await screen.findByText("Please use a different email address.");
  expect(screen.getByLabelText(/^Full name/).value).toBe("Test User");
  const email = screen.getByLabelText(/^Email address/);
  await user.clear(email);
  await user.type(email, "new@example.com");
  await user.click(
    screen.getByRole("button", { name: "Book free consultation" }),
  );
  await screen.findByText("Thank you for sharing your project.");
  expect(fetchMock).toHaveBeenCalledTimes(2);
});
