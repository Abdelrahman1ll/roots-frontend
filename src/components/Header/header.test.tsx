import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Header from "./header";
import useHeader from "./useHeader";

// Mock the useHeader hook
vi.mock("./useHeader", () => ({
  default: vi.fn(),
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  motion: new Proxy(
    {},
    {
      get: (_target, _prop) => {
        return ({
          children,
          ...props
        }: {
          children: React.ReactNode;
          [key: string]: unknown;
        }) => {
          // Return button for semantic correctness if prop is button, else div
          if (_prop === "button") return <button {...props}>{children}</button>;
          return <div {...props}>{children}</div>;
        };
      },
    },
  ),
}));

// Mock SearchInput and UserMenu to avoid complex dependencies
vi.mock("./search", () => ({
  default: () => <div data-testid="search-input" />,
}));
vi.mock("./UserMenu", () => ({
  default: () => <div data-testid="user-menu" />,
}));

describe("Header Component", () => {
  const mockSetIsMenuOpen = vi.fn();
  const mockSetSearch = vi.fn();
  const mockSetIsOpen = vi.fn();
  const mockSetSelected = vi.fn();
  const mockSetNameInput = vi.fn();
  const mockHandleLogout = vi.fn();
  const mockOpenSignup = vi.fn();
  const mockSetIsSearchLocal = vi.fn();
  const mockNavigate = vi.fn();
  const mockToggleCountryDropdown = vi.fn();

  const defaultMockValues = {
    isMenuOpen: false,
    setIsMenuOpen: mockSetIsMenuOpen,
    isSearch: false,
    setSearch: mockSetSearch,
    isOpen: false,
    setIsOpen: mockSetIsOpen,
    selected: { name: "Egypt", flag: "/eg.svg" },
    setSelected: mockSetSelected,
    nameInput: "",
    setNameInput: mockSetNameInput,
    handleLogout: mockHandleLogout,
    user: null,
    totalItems: 0,
    countries: [{ name: "Egypt", flag: "/eg.svg" }],
    openSignup: mockOpenSignup,
    isSearchLocal: false,
    navigate: mockNavigate,
    setIsSearchLocal: mockSetIsSearchLocal,
    desktopDropdownRef: { current: null },
    mobileDropdownRef: { current: null },
    toggleCountryDropdown: mockToggleCountryDropdown,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useHeader as any).mockReturnValue(defaultMockValues);
  });

  it("renders desktop navigation links", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("All Products")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });

  it("renders the brand name", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    // We expect the brand name to be rendered at least once (for desktop and mobile)
    const brandElements = screen.getAllByText(/ROOTS/i); // Assuming BRAND_NAME is ROOTS
    expect(brandElements.length).toBeGreaterThan(0);
  });

  it("renders Login button if no user is present", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const loginButtons = screen.getAllByLabelText("Login");
    expect(loginButtons.length).toBeGreaterThan(0);

    fireEvent.click(loginButtons[0]);
    expect(mockOpenSignup).toHaveBeenCalled();
  });

  it("renders UserMenu if user is logged in", () => {
    (useHeader as any).mockReturnValue({
      ...defaultMockValues,
      user: { name: "Test User" },
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getAllByTestId("user-menu").length).toBeGreaterThan(0);
  });

  it("displays correct cart item count", () => {
    (useHeader as any).mockReturnValue({
      ...defaultMockValues,
      totalItems: 5,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("5").length).toBeGreaterThan(0);
  });

  it("toggles mobile menu when hamburger is clicked", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const menuButton = screen.getByRole("button", { name: /Open menu/i });
    fireEvent.click(menuButton);
    expect(mockSetIsMenuOpen).toHaveBeenCalled();
  });

  it("shows search input when search is active", () => {
    (useHeader as any).mockReturnValue({
      ...defaultMockValues,
      isSearch: true,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("search-input")).toBeInTheDocument();
  });
});
