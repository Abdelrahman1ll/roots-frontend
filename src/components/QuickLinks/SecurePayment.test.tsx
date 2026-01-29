import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SecurePayment from "./SecurePayment";
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
  },
}));

// Mock Lucide Icons
vi.mock("lucide-react", () => ({
  ShieldCheck: () => <svg data-testid="shield-check-icon" />,
  Lock: () => <svg data-testid="lock-icon" />,
  CreditCard: () => <svg data-testid="credit-card-icon" />,
  Globe: () => <svg data-testid="globe-icon" />,
  Activity: () => <svg data-testid="activity-icon" />,
  Smartphone: () => <svg data-testid="smartphone-icon" />,
}));

describe("SecurePayment Component", () => {
  it("renders the main heading correctly", () => {
    render(<SecurePayment />);
    expect(screen.getAllByText(/Secure/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Payments/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Transaction Security/i).length).toBeGreaterThan(
      0,
    );
  });

  it("renders status badge", () => {
    render(<SecurePayment />);
    expect(screen.getByText(/Server Secure/i)).toBeInTheDocument();
    expect(screen.getByTestId("activity-icon")).toBeInTheDocument();
  });

  it("renders all security features in both English and Arabic", () => {
    render(<SecurePayment />);

    // Feature 1: End-to-End Encryption
    expect(
      screen.getAllByText(/End-to-End Encryption/i)[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/تشفير البيانات بالكامل/i)[0],
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("shield-check-icon").length).toBeGreaterThan(
      0,
    );

    // Feature 2: PCI DSS Compliant
    expect(screen.getByText(/PCI DSS Compliant/i)).toBeInTheDocument();
    expect(screen.getByText(/معايير أمان عالمية/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("lock-icon").length).toBeGreaterThan(0);

    // Feature 3: Direct & Fast Payments
    expect(screen.getByText(/Direct & Fast Payments/i)).toBeInTheDocument();
    expect(screen.getByText(/دفع مباشر وسريع/i)).toBeInTheDocument();
    expect(screen.getByTestId("smartphone-icon")).toBeInTheDocument();
  });

  it("renders technical badges banner", () => {
    render(<SecurePayment />);
    expect(screen.getByText(/SSL Secure/i)).toBeInTheDocument();
    expect(screen.getByText(/256-Bit AES/i)).toBeInTheDocument();
    expect(screen.getByText(/PCI Certified/i)).toBeInTheDocument();
  });

  it("renders footer text", () => {
    render(<SecurePayment />);
    expect(
      screen.getByText(/ROOTS Boutique — Encrypted Connection/i),
    ).toBeInTheDocument();
  });
});
