import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SignupProvider } from "./SignupProvider";
import { useContext } from "react";
import { SignupContext } from "../../context/SignupContext";
import "@testing-library/jest-dom";

// Test component to consume context
const TestComponent = () => {
  const { showSignup, openSignup, closeSignup } = useContext(SignupContext);
  return (
    <div>
      <span data-testid="status">{showSignup ? "OPEN" : "CLOSED"}</span>
      <button onClick={openSignup}>Open</button>
      <button onClick={closeSignup}>Close</button>
    </div>
  );
};

describe("SignupProvider Component", () => {
  it("provides default state as false (closed)", () => {
    render(
      <SignupProvider>
        <TestComponent />
      </SignupProvider>,
    );

    expect(screen.getByTestId("status")).toHaveTextContent("CLOSED");
  });

  it("updates state to open when openSignup is called", () => {
    render(
      <SignupProvider>
        <TestComponent />
      </SignupProvider>,
    );

    fireEvent.click(screen.getByText("Open"));
    expect(screen.getByTestId("status")).toHaveTextContent("OPEN");
  });

  it("updates state to closed when closeSignup is called", () => {
    render(
      <SignupProvider>
        <TestComponent />
      </SignupProvider>,
    );

    // Open first
    fireEvent.click(screen.getByText("Open"));
    expect(screen.getByTestId("status")).toHaveTextContent("OPEN");

    // Then close
    fireEvent.click(screen.getByText("Close"));
    expect(screen.getByTestId("status")).toHaveTextContent("CLOSED");
  });
});
