import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AboutUs from "./aboutUs";
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
  Sparkles: () => <svg data-testid="sparkles-icon" />,
  ShieldCheck: () => <svg data-testid="shield-check-icon" />,
  Heart: () => <svg data-testid="heart-icon" />,
  CircleDot: () => <svg data-testid="circle-dot-icon" />,
}));

describe("AboutUs Component", () => {
  it("renders the main heading correctly", () => {
    render(<AboutUs />);
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Us/i)).toBeInTheDocument();
    expect(screen.getByText(/The Brand Story/i)).toBeInTheDocument();
  });

  it("renders all brand values in both English and Arabic", () => {
    render(<AboutUs />);

    // Value 1
    expect(
      screen.getByText(/We are a contemporary clothing brand/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/نحن علامة ملابس عصرية/i)).toBeInTheDocument();

    // Value 2
    expect(
      screen.getByText(/Our designs offer a calm, confident style/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/تصاميمنا تمنحك أسلوبًا هادئًا/i),
    ).toBeInTheDocument();

    // Value 3
    expect(
      screen.getByText(/Combining practicality with refined taste/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/تجمع بين العملية والذوق الرفيع/i),
    ).toBeInTheDocument();
  });

  it("renders the correct icons", () => {
    render(<AboutUs />);
    expect(screen.getByTestId("sparkles-icon")).toBeInTheDocument();
    expect(screen.getByTestId("shield-check-icon")).toBeInTheDocument();
    expect(screen.getByTestId("heart-icon")).toBeInTheDocument();
    // CircleDot is used multiple times in the header
    const circleDots = screen.getAllByTestId("circle-dot-icon");
    expect(circleDots.length).toBeGreaterThan(0);
  });

  it("renders the sign-off text", () => {
    render(<AboutUs />);
    expect(screen.getByText(/Crafted for Excellence/i)).toBeInTheDocument();
  });
});
