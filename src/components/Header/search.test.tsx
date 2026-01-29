import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter, useNavigate, useSearchParams } from "react-router-dom";
import SearchInput from "./search";

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useSearchParams: vi.fn(),
  };
});

describe("SearchInput Component", () => {
  const mockSetSearch = vi.fn();
  const mockSetIsSearchLocal = vi.fn();
  const mockNavigate = vi.fn();
  const mockSetSearchParams = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams(),
      mockSetSearchParams,
    ]);

    // Create a container for the portal if document.body is not enough
    // But usually in JSDOM, document.body is fine.
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <SearchInput
          setSearch={mockSetSearch}
          setIsSearchLocal={mockSetIsSearchLocal}
        />
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText(/Search.../i)).toBeInTheDocument();
  });

  it("updates input value on change", () => {
    render(
      <MemoryRouter>
        <SearchInput
          setSearch={mockSetSearch}
          setIsSearchLocal={mockSetIsSearchLocal}
        />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(/Search.../i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test search" } });

    expect(input.value).toBe("test search");
  });

  it("triggers navigation and state updates on focus", () => {
    render(
      <MemoryRouter>
        <SearchInput
          setSearch={mockSetSearch}
          setIsSearchLocal={mockSetIsSearchLocal}
        />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(/Search.../i);
    fireEvent.focus(input);

    expect(mockSetIsSearchLocal).toHaveBeenCalledWith(true);
    expect(mockSetSearch).toHaveBeenCalledWith(true);
    expect(mockNavigate).toHaveBeenCalledWith("/products");
    expect(localStorage.getItem("isSearch")).toBe("true");
  });

  it("synchronizes with URL parameters with debounce", async () => {
    render(
      <MemoryRouter>
        <SearchInput
          setSearch={mockSetSearch}
          setIsSearchLocal={mockSetIsSearchLocal}
        />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(/Search.../i);
    fireEvent.change(input, { target: { value: "new value" } });

    // Should not call yet
    expect(mockSetSearchParams).not.toHaveBeenCalled();

    // Advance time for debounce
    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(mockSetSearchParams).toHaveBeenCalled();
    const calledParams = mockSetSearchParams.mock.calls[0][0];
    expect(calledParams.get("name")).toBe("new value");
  });

  it("clears everything when X is clicked", () => {
    render(
      <MemoryRouter>
        <SearchInput
          setSearch={mockSetSearch}
          setIsSearchLocal={mockSetIsSearchLocal}
        />
      </MemoryRouter>,
    );

    // Locate the X component. lucide-react names them as svg with aria-hidden or just class names.
    // In our case, it's a component with class "lucide lucide-x" or similar.
    // Let's use the className or just find the svg.
    const closeIcon = document.querySelector(".lucide-x");
    expect(closeIcon).toBeInTheDocument();

    fireEvent.mouseDown(closeIcon!);

    expect(mockSetIsSearchLocal).toHaveBeenCalledWith(false);
    expect(mockSetSearch).toHaveBeenCalledWith(false);
    expect(localStorage.getItem("isSearch")).toBeNull();

    // Check if name is cleared
    const input = screen.getByPlaceholderText(/Search.../i) as HTMLInputElement;
    expect(input.value).toBe("");
  });
});
