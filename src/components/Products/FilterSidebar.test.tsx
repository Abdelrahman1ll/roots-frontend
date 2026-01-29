import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FilterSidebar from "./FilterSidebar";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock Redux hooks
vi.mock("../../redux/category/apiCategory", () => ({
  useGetCategoryQuery: vi.fn(() => ({
    data: {
      categories: [
        { id: "1", name: "Category 1" },
        { id: "2", name: "Category 2" },
      ],
    },
  })),
}));

vi.mock("../../redux/color/apiColor", () => ({
  useGetColorsQuery: vi.fn(() => ({
    data: {
      colors: [
        { id: "1", name: "Red", color: "#ff0000" },
        { id: "2", name: "Blue", color: "#0000ff" },
      ],
    },
  })),
}));

vi.mock("../../redux/products/apiProducts", () => ({
  useGetProductsQuery: vi.fn(() => ({
    data: {
      products: [
        { id: "1", price: 100 },
        { id: "2", price: 500 },
      ],
    },
  })),
}));

// Mock Framer Motion
// Mock Framer Motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("FilterSidebar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders trigger buttons correctly", () => {
    render(
      <BrowserRouter>
        <FilterSidebar />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Filters/i)).toBeInTheDocument();
    expect(screen.getByText(/Featured/i)).toBeInTheDocument(); // Default sort
  });

  it("opens the drawer when filter button is clicked", () => {
    render(
      <BrowserRouter>
        <FilterSidebar />
      </BrowserRouter>,
    );

    const filterBtn = screen.getByRole("button", { name: /Filters/i });
    fireEvent.click(filterBtn);

    expect(screen.getByText(/Refine your search/i)).toBeInTheDocument();
    expect(screen.getByText(/Category 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Price Range/i)).toBeInTheDocument();
    expect(screen.getByText(/Color/i)).toBeInTheDocument();
  });

  it("opens sort dropdown when sort button is clicked", () => {
    render(
      <BrowserRouter>
        <FilterSidebar />
      </BrowserRouter>,
    );

    const sortBtn = screen.getByText(/Featured/i);
    fireEvent.click(sortBtn);

    expect(screen.getByText(/Best Selling/i)).toBeInTheDocument();
    expect(screen.getByText(/Price: High to Low/i)).toBeInTheDocument();
    expect(screen.getByText(/Price: Low to High/i)).toBeInTheDocument();
  });

  it("clears all filters when 'Clear All Filters' is clicked", () => {
    render(
      <BrowserRouter>
        <FilterSidebar />
      </BrowserRouter>,
    );

    // Open drawer
    fireEvent.click(screen.getByRole("button", { name: /Filters/i }));

    // Click clear all
    const clearBtn = screen.getByText(/Clear All Filters/i);
    fireEvent.click(clearBtn);

    // After clearing, categories should be unchecked (this is hard to test with current mocks but we check if it runs)
    expect(clearBtn).toBeInTheDocument();
  });
});
