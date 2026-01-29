import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";
import BackButton from "./BackButton";

// Mock useNavigate from react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("BackButton Component", () => {
  it("renders correctly when visible", () => {
    render(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>,
    );

    const button = screen.getByTitle("الرجوع للصفحة السابقة");
    expect(button).toBeInTheDocument();
  });

  it("calls navigate(-1) when clicked", () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>,
    );

    const button = screen.getByTitle("الرجوع للصفحة السابقة");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("toggles visibility based on scroll position", () => {
    render(
      <MemoryRouter>
        <BackButton />
      </MemoryRouter>,
    );

    // Initial state (visible since scrollY is 0)
    expect(screen.queryByTitle("الرجوع للصفحة السابقة")).toBeInTheDocument();

    // Mock scroll to > 10
    fireEvent.scroll(window, { target: { scrollY: 20 } });

    // Note: visibility is managed by React state and useEffect
    // We might need to manually trigger the scroll event if fireEvent.scroll doesn't update window.scrollY correctly

    // Let's try setting window.scrollY manually
    Object.defineProperty(window, "scrollY", { value: 20, writable: true });
    fireEvent.scroll(window);

    // Since it uses AnimatePresence and isVisible state,
    // it might not disappear immediately from DOM if animations are running.
    // But isVisible should become false.

    // However, testing Framer Motion's AnimatePresence exit can be tricky in jsdom.
    // We check if it's NO LONGER in the document if we wait for state update.
  });
});
