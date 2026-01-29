import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SalesPaymentPolicy from "./salesPaymentPolicy";
import "@testing-library/jest-dom";

// Mock Framer Motion
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
    section: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <section {...props}>{children}</section>,
  },
}));

describe("SalesPaymentPolicy Component", () => {
  it("renders the main title", () => {
    render(<SalesPaymentPolicy />);
    // placeholder
  });

  it("renders all four sections", () => {
    render(<SalesPaymentPolicy />);
    expect(screen.getByText(/1. Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Prices & Offers/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Payment Methods/i)).toBeInTheDocument();
    expect(screen.getByText(/4. Order Confirmation/i)).toBeInTheDocument();
  });

  it("renders Arabic text", () => {
    render(<SalesPaymentPolicy />);
    expect(screen.getByText(/نظرة عامة/i)).toBeInTheDocument();
    expect(screen.getByText(/الأسعار والعروض/i)).toBeInTheDocument();
    expect(screen.getByText(/طرق الدفع/i)).toBeInTheDocument();
    expect(screen.getByText(/تأكيد الطلب/i)).toBeInTheDocument();
  });

  it("renders payment methods", () => {
    render(<SalesPaymentPolicy />);
    expect(screen.getByText(/Bank Cards/i)).toBeInTheDocument();
    expect(screen.getByText(/Cash on Delivery/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Sales &/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Payment/i)[0]).toBeInTheDocument();
  });

  it("renders the footer message", () => {
    render(<SalesPaymentPolicy />);
    expect(
      screen.getByText(/Secure & Trusted Transactions/i),
    ).toBeInTheDocument();
  });
});
