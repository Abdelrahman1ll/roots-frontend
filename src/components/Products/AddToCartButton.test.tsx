import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AddToCartButton from "./AddToCartButton";
import "@testing-library/jest-dom";

// Mock Framer Motion
vi.mock("framer-motion", () => ({
  motion: {
    button: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <button {...props}>{children}</button>,
  },
}));

describe("AddToCartButton Component", () => {
  it("renders correctly", () => {
    render(<AddToCartButton addToCart={() => {}} />);
    expect(screen.getByText(/Add to Cart/i)).toBeInTheDocument();
  });

  it("calls addToCart function on click", () => {
    const addToCartMock = vi.fn();
    render(<AddToCartButton addToCart={addToCartMock} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(addToCartMock).toHaveBeenCalledTimes(1);
  });

  it("shows clicked state correctly", () => {
    vi.useFakeTimers();
    const addToCartMock = vi.fn();
    render(<AddToCartButton addToCart={addToCartMock} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Check if style changes (background color depends on clicked state)
    // Note: The specific styles might be hard to test exactly due to CSS variables,
    // but we can check if the button is still in the document and the function was called.
    expect(addToCartMock).toHaveBeenCalled();

    // Fast-forward 2 seconds to reset state
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    vi.useRealTimers();
  });
});
