import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PromoBar from "./PromoBar";

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
  },
}));

describe("PromoBar Component", () => {
  it("renders the promotion text correctly", () => {
    render(
      <MemoryRouter>
        <PromoBar />
      </MemoryRouter>,
    );

    expect(screen.getByText(/30% OFF/i)).toBeInTheDocument();
    expect(screen.getByText(/limited time!/i)).toBeInTheDocument();
    expect(screen.getByText(/OFFER/i)).toBeInTheDocument();
  });

  it("renders the shop link with correct destination", () => {
    render(
      <MemoryRouter>
        <PromoBar />
      </MemoryRouter>,
    );

    const shopLink = screen.getByRole("link", { name: /Shop/i });
    expect(shopLink).toBeInTheDocument();
    expect(shopLink.getAttribute("href")).toBe("/products");
  });
});
