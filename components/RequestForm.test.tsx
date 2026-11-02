import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { RequestForm } from "./RequestForm";

it("disables request until a slot is chosen and the policy is accepted", () => {
  render(<RequestForm slotId="slot_thu_16" />);

  expect(screen.getByRole("button", { name: "Request lesson" })).toBeDisabled();
});

it("enables request when a slot is chosen and the policy is accepted", () => {
  render(<RequestForm slotId="slot_thu_16" />);
  fireEvent.click(screen.getByRole("checkbox", { name: /scheduling policy/i }));

  expect(screen.getByRole("button", { name: "Request lesson" })).toBeEnabled();
});

it("stays disabled when the policy is accepted but no slot is chosen", () => {
  render(<RequestForm slotId={null} />);
  fireEvent.click(screen.getByRole("checkbox", { name: /scheduling policy/i }));

  expect(screen.getByRole("button", { name: "Request lesson" })).toBeDisabled();
});
