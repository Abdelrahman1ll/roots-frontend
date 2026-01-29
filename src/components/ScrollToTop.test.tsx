import {
  render,
  fireEvent,
  act,
  screen,
  waitFor,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route, Link } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

describe("ScrollToTop Component", () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = vi.fn();
    // Mock window.scrollY
    vi.stubGlobal("scrollY", 0);
  });

  const renderWithRouter = () => {
    return render(
      <MemoryRouter>
        <ScrollToTop />
      </MemoryRouter>,
    );
  };

  it("scrolls to top on pathname change", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/new-path" element={<div>New Path</div>} />
        </Routes>
        <Link to="/new-path">Navigate</Link>
      </MemoryRouter>,
    );

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });

    // Simulate pathname change by clicking link
    const link = screen.getByText("Navigate");
    fireEvent.click(link);

    // Should be called again for the new path
    expect(window.scrollTo).toHaveBeenCalledTimes(2);
  });

  it("shows button when scrolled down more than 300px", () => {
    const { queryByTitle } = renderWithRouter();

    expect(queryByTitle("الرجوع للأعلى")).not.toBeInTheDocument();

    // Set scroll position and trigger event
    vi.stubGlobal("scrollY", 400);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(queryByTitle("الرجوع للأعلى")).toBeInTheDocument();
  });

  it("hides button when scrolled back up", async () => {
    const { queryByTitle } = renderWithRouter();

    // Scroll down
    vi.stubGlobal("scrollY", 400);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(queryByTitle("الرجوع للأعلى")).toBeInTheDocument();

    // Scroll back up
    vi.stubGlobal("scrollY", 100);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    await waitFor(() => {
      expect(queryByTitle("الرجوع للأعلى")).not.toBeInTheDocument();
    });
  });

  it("scrolls to top when button is clicked", () => {
    const { getByTitle } = renderWithRouter();

    // Make it visible
    vi.stubGlobal("scrollY", 400);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    const button = getByTitle("الرجوع للأعلى");
    fireEvent.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});
