import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GlobalSignup from "./GlobalSignup";
import { SignupContext } from "../../context/SignupContext";
import "@testing-library/jest-dom";

// Mock the Signup component
vi.mock("./signup", () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="signup-modal">
      Signup Modal
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

describe("GlobalSignup Component", () => {
  it("renders nothing when showSignup is false", () => {
    const mockContextValue = {
      showSignup: false,
      openSignup: vi.fn(),
      closeSignup: vi.fn(),
    };

    const { container } = render(
      <SignupContext.Provider value={mockContextValue}>
        <GlobalSignup />
      </SignupContext.Provider>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders Signup modal when showSignup is true", () => {
    const mockContextValue = {
      showSignup: true,
      openSignup: vi.fn(),
      closeSignup: vi.fn(),
    };

    render(
      <SignupContext.Provider value={mockContextValue}>
        <GlobalSignup />
      </SignupContext.Provider>,
    );

    expect(screen.getByTestId("signup-modal")).toBeInTheDocument();
  });
});
