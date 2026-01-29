import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PrivacyPolicy from "./privacyPolicy";
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

describe("PrivacyPolicy Component", () => {
  it("renders the main title", () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText(/Privacy/i)).toBeInTheDocument();
    expect(screen.getByText(/Policy/i)).toBeInTheDocument();
  });

  it("renders all four sections", () => {
    render(<PrivacyPolicy />);
    expect(screen.getByText(/1. Information Collection/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Use of Information/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Data Protection/i)).toBeInTheDocument();
    expect(screen.getByText(/4. Sharing Information/i)).toBeInTheDocument();
  });

  it("renders Arabic text", () => {
    render(<PrivacyPolicy />);
    expect(screen.getAllByText(/جمع المعلومات/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/استخدام المعلومات/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/حماية المعلومات/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/مشاركة المعلومات/i)[0]).toBeInTheDocument();
  });

  it("renders the security footer", () => {
    render(<PrivacyPolicy />);
    expect(
      screen.getByText(/Secure & Encrypted Experience/i),
    ).toBeInTheDocument();
  });
});
