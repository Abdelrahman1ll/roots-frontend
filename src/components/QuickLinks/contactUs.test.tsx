import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ContactUs from "./contactUs";
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
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock Lucide Icons
vi.mock("lucide-react", () => ({
  Mail: () => <svg data-testid="mail-icon" />,
  Phone: () => <svg data-testid="phone-icon" />,
  Send: () => <svg data-testid="send-icon" />,
  CheckCircle2: () => <svg data-testid="check-circle-icon" />,
  Facebook: () => <svg data-testid="facebook-icon" />,
  Instagram: () => <svg data-testid="instagram-icon" />,
  Twitter: () => <svg data-testid="twitter-icon" />,
  CircleDot: () => <svg data-testid="circle-dot-icon" />,
}));

// Mock BrandText
vi.mock("../../BrandText", () => ({
  BRAND_EMAIL: "support@roots.com",
  BRAND_PHONE: "+20 123 456 7890",
}));

// Mock Formspree
const mockHandleSubmit = vi.fn();
vi.mock("@formspree/react", () => ({
  useForm: () => [
    { succeeded: false, submitting: false, errors: [] },
    mockHandleSubmit,
  ],
  ValidationError: () => <div data-testid="validation-error" />,
}));

describe("ContactUs Component", () => {
  it("renders the main heading and contact info", () => {
    render(<ContactUs />);
    expect(screen.getByText(/Let’s Start a/i)).toBeInTheDocument();
    expect(screen.getByText(/Conversation/i)).toBeInTheDocument();
    expect(screen.getByText("support@roots.com")).toBeInTheDocument();
    expect(screen.getByText("+20 123 456 7890")).toBeInTheDocument();
  });

  it("renders input fields correctly", () => {
    render(<ContactUs />);
    expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("john@example.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("How can we assist you today?"),
    ).toBeInTheDocument();
  });

  it("updates input values on change", () => {
    render(<ContactUs />);
    const nameInput = screen.getByPlaceholderText(
      "John Doe",
    ) as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
    expect(nameInput.value).toBe("Jane Doe");
  });

  it("submits the form", () => {
    render(<ContactUs />);

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText("John Doe"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("john@example.com"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("How can we assist you today?"),
      {
        target: { value: "Hello" },
      },
    );

    const submitButton = screen.getByText(/Send Message/i);
    fireEvent.click(submitButton);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
