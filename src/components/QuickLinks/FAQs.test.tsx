import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FAQs from "./FAQs";
import "@testing-library/jest-dom";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    span: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <span {...props}>{children}</span>,
    h1: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <h1 {...props}>{children}</h1>,
    p: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <p {...props}>{children}</p>,
  },
}));

// Mock Lucide Icons
vi.mock("lucide-react", () => ({
  Package: () => <svg data-testid="package-icon" />,
  RotateCcw: () => <svg data-testid="rotate-ccw-icon" />,
  CreditCard: () => <svg data-testid="credit-card-icon" />,
  HelpCircle: () => <svg data-testid="help-circle-icon" />,
  CircleDot: () => <svg data-testid="circle-dot-icon" />,
}));

describe("FAQs Component", () => {
  it("renders the main heading correctly", () => {
    render(<FAQs />);
    expect(screen.getAllByText(/Frequently Asked/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Questions/i)[0]).toBeInTheDocument();
  });

  it("renders all categories with icons", () => {
    render(<FAQs />);

    // Shipping & Delivery
    expect(screen.getByText(/Shipping & Delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/الشحن والتوصيل/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("package-icon").length).toBeGreaterThan(0);

    // Exchange & Return
    expect(screen.getByText(/Exchange & Return/i)).toBeInTheDocument();
    expect(screen.getByText(/الاسترجاع والاستبدال/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("rotate-ccw-icon").length).toBeGreaterThan(0);

    // Payments & Orders
    expect(screen.getByText(/Payments & Orders/i)).toBeInTheDocument();
    expect(screen.getByText(/الدفع والطلبات/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("credit-card-icon").length).toBeGreaterThan(0);
  });

  it("renders Q&A items correctly", () => {
    render(<FAQs />);
    // Sample check for a question and answer
    expect(
      screen.getByText(/What if I received a wrong item/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/We urge our customers to check items/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/Do you offer refunds/i)).toBeInTheDocument();

    expect(
      screen.getByText(/How can I apply the discount code/i),
    ).toBeInTheDocument();
  });

  it("renders support CTA section", () => {
    render(<FAQs />);
    expect(screen.getByText(/Still have questions/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Reach out to our support team/i),
    ).toBeInTheDocument();
  });
});
