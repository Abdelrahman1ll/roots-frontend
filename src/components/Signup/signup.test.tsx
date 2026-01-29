import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import Signup from "./signup";
import useSignup from "./useSignup";
import "@testing-library/jest-dom";

// Mock the hook
vi.mock("./useSignup", () => ({
  default: vi.fn(),
}));

// Mock GoogleSignup
vi.mock("./googleSignup", () => ({
  default: () => <div data-testid="google-signup">Google Signup Component</div>,
}));

// Mock framer-motion to render children directly without warnings
vi.mock("framer-motion", () => {
  const motionComponent = (Tag: string) => {
    return ({ children, ...props }: any) =>
      React.createElement(Tag, props, children);
  };

  return {
    motion: {
      div: motionComponent("div"),
      button: motionComponent("button"),
      p: motionComponent("p"),
      input: motionComponent("input"),
      span: motionComponent("span"),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// Mock icons
vi.mock("lucide-react", () => ({
  X: () => <svg data-testid="close-icon" />,
}));

describe("Signup Component", () => {
  const mockOnClose = vi.fn();
  const mockUseSignupDefaults = {
    email: "",
    setEmail: vi.fn(),
    showCodeInput: false,
    code: ["", "", "", "", "", ""],
    handleChange: vi.fn(),
    handleKeyDown: vi.fn(),
    handlePaste: vi.fn(),
    handleVerifyCode: vi.fn(),
    handleSignup: vi.fn((e) => e.preventDefault()),
    isLoading: false,
    isLoadingUser: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useSignup as Mock).mockReturnValue(mockUseSignupDefaults);
  });

  it("renders email input form initially", () => {
    render(<Signup onClose={mockOnClose} />);
    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByText("Send Verification Code")).toBeInTheDocument();
    expect(screen.getByTestId("google-signup")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<Signup onClose={mockOnClose} />);
    const closeBtn = screen.getByTitle("الاغلاق");
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("renders verification form when showCodeInput is true", () => {
    (useSignup as any).mockReturnValue({
      ...mockUseSignupDefaults,
      showCodeInput: true,
      email: "test@example.com",
    });

    render(<Signup onClose={mockOnClose} />);
    expect(screen.getByText("Check Your Email")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Verify & Sign Up")).toBeInTheDocument();
  });

  it("calls handleSignup on form submit", () => {
    const mockHandleSignup = vi.fn((e) => e.preventDefault());
    (useSignup as any).mockReturnValue({
      ...mockUseSignupDefaults,
      handleSignup: mockHandleSignup,
      email: "test@example.com",
    });

    render(<Signup onClose={mockOnClose} />);
    const submitBtn = screen.getByText("Send Verification Code");
    fireEvent.click(submitBtn);

    expect(mockHandleSignup).toHaveBeenCalled();
  });

  it("calls handleVerifyCode on verification form submit", () => {
    const mockHandleVerifyCode = vi.fn((e) => e.preventDefault());
    (useSignup as any).mockReturnValue({
      ...mockUseSignupDefaults,
      showCodeInput: true,
      handleVerifyCode: mockHandleVerifyCode,
      code: ["1", "2", "3", "4", "5", "6"],
    });

    render(<Signup onClose={mockOnClose} />);
    const verifyBtn = screen.getByText("Verify & Sign Up");
    fireEvent.click(verifyBtn);

    expect(mockHandleVerifyCode).toHaveBeenCalled();
  });
});
