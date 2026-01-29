import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TermsConditions from "./termsConditions";
import "@testing-library/jest-dom";

// Mock Framer Motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
  },
}));

describe("TermsConditions Component", () => {
  it("renders the main title", () => {
    render(<TermsConditions />);
    expect(screen.getByText(/Terms &/i)).toBeInTheDocument();
    expect(screen.getByText(/Conditions/i)).toBeInTheDocument();
  });

  it("renders all five sections", () => {
    render(<TermsConditions />);
    expect(screen.getByText(/1. Acceptance of Terms/i)).toBeInTheDocument();
    expect(screen.getByText(/2. User Account/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Products & Pricing/i)).toBeInTheDocument();
    expect(screen.getByText(/4. Payment & Delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/5. User Responsibility/i)).toBeInTheDocument();
  });

  it("renders Arabic text", () => {
    render(<TermsConditions />);
    expect(screen.getByText(/قبول الشروط/i)).toBeInTheDocument();
    expect(screen.getByText(/حساب المستخدم/i)).toBeInTheDocument();
    expect(screen.getByText(/المنتجات والأسعار/i)).toBeInTheDocument();
    expect(screen.getByText(/الدفع والتسليم/i)).toBeInTheDocument();
    expect(screen.getByText(/مسؤولية المستخدم/i)).toBeInTheDocument();
  });

  it("renders the last updated date", () => {
    render(<TermsConditions />);
    expect(screen.getByText(/Last Updated: Jan 2026/i)).toBeInTheDocument();
  });
});
