import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import WorldwideShipping from "./WorldwideShipping";
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
  Globe: () => <svg data-testid="globe-icon" />,
  Plane: () => <svg data-testid="plane-icon" />,
  Truck: () => <svg data-testid="truck-icon" />,
  MapPin: () => <svg data-testid="map-pin-icon" />,
  Search: () => <svg data-testid="search-icon" />,
  Navigation: () => <svg data-testid="navigation-icon" />,
  Activity: () => <svg data-testid="activity-icon" />,
}));

describe("WorldwideShipping Component", () => {
  it("renders the main heading correctly", () => {
    render(<WorldwideShipping />);
    expect(screen.getByText(/Shipping in/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Egypt/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Domestic Delivery/i)[0]).toBeInTheDocument();
  });

  it("renders status badge", () => {
    render(<WorldwideShipping />);
    expect(screen.getByText(/Logistics Network Active/i)).toBeInTheDocument();
    expect(screen.getByTestId("activity-icon")).toBeInTheDocument();
  });

  it("renders all shipping features in both English and Arabic", () => {
    render(<WorldwideShipping />);

    // Feature 1: All Governorates
    expect(screen.getByText(/All Governorates/i)).toBeInTheDocument();
    expect(screen.getByText(/جميع المحافظات/i)).toBeInTheDocument();
    expect(screen.getByTestId("globe-icon")).toBeInTheDocument();

    // Feature 2: Domestic Logistics
    expect(screen.getByText(/Domestic Logistics/i)).toBeInTheDocument();
    expect(screen.getByText(/خدمات لوجستية محلية/i)).toBeInTheDocument();
    expect(screen.getByTestId("plane-icon")).toBeInTheDocument();

    // Feature 3: Real-time Tracking
    expect(screen.getByText(/Real-time Tracking/i)).toBeInTheDocument();
    expect(screen.getByText(/تتبع اللحظي/i)).toBeInTheDocument();
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("renders statistics section", () => {
    render(<WorldwideShipping />);
    expect(screen.getByText("27")).toBeInTheDocument();
    expect(screen.getAllByText(/Egypt/i).length).toBeGreaterThan(0);
    expect(screen.getByText("3-7")).toBeInTheDocument();
    expect(screen.getAllByText(/Business Days/i).length).toBeGreaterThan(0);
    expect(screen.getByText("24/7")).toBeInTheDocument();
    expect(screen.getByText(/Order Tracking/i)).toBeInTheDocument();
  });

  it("renders footer text", () => {
    render(<WorldwideShipping />);
    expect(
      screen.getByText(/ROOTS Boutique — Connecting Fashion Across Egypt/i),
    ).toBeInTheDocument();
  });
});
