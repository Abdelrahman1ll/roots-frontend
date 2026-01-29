import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Footer from "./footer";
import { SignupContext } from "../../context/SignupContext";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { BRAND_NAME, BRAND_EMAIL } from "../../BrandText";

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
    h2: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <h2 {...props}>{children}</h2>,
    p: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <p {...props}>{children}</p>,
    a: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <a {...props}>{children}</a>,
    button: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <button {...props}>{children}</button>,
    span: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <span {...props}>{children}</span>,
  },
}));

describe("Footer Component", () => {
  const mockOpenSignup = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderFooter = () => {
    return render(
      <SignupContext.Provider
        value={{
          openSignup: mockOpenSignup,
          closeSignup: vi.fn(),
          showSignup: false,
        }}
      >
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      </SignupContext.Provider>,
    );
  };

  it("renders brand name and description", () => {
    renderFooter();
    expect(screen.getByText(BRAND_NAME)).toBeInTheDocument();
    expect(
      screen.getByText(/Elevating contemporary fashion/i),
    ).toBeInTheDocument();
  });

  it("renders explore links correctly", () => {
    renderFooter();
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Shipping & Delivery")).toBeInTheDocument();
  });

  it("renders policy links correctly", () => {
    renderFooter();
    expect(screen.getByText("Resources")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("Terms & Conditions")).toBeInTheDocument();
  });

  it("renders contact information", () => {
    renderFooter();
    expect(screen.getByText("Cairo, Egypt")).toBeInTheDocument();
    expect(screen.getByText(BRAND_EMAIL)).toBeInTheDocument();
  });

  it("triggers openSignup when interaction with newsletter occurs", () => {
    renderFooter();
    const joinButton = screen.getByRole("button", { name: "Join" });
    fireEvent.click(joinButton);
    expect(mockOpenSignup).toHaveBeenCalled();

    const emailInput = screen.getByPlaceholderText("email@example.com");
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    expect(mockOpenSignup).toHaveBeenCalled();
  });

  it("renders social media links", () => {
    renderFooter();
    expect(screen.getByLabelText("Follow us on Facebook")).toBeInTheDocument();
    expect(screen.getByLabelText("Follow us on Instagram")).toBeInTheDocument();
    expect(screen.getByLabelText("Follow us on Twitter")).toBeInTheDocument();
    expect(screen.getByLabelText("Follow us on TikTok")).toBeInTheDocument();
  });

  it("displays the correct current year in copyright", () => {
    renderFooter();
    const currentYear = new Date().getFullYear().toString();
    expect(
      screen.getByText(new RegExp(`© ${currentYear}`, "i")),
    ).toBeInTheDocument();
  });
});
