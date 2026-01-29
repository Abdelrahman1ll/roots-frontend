import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductForm from "./ProductForm";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock the custom hook
vi.mock("./useProductForm", () => ({
  default: vi.fn(),
}));

import useProductForm from "./useProductForm";

// Mock Framer Motion
// Mock Framer Motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock Lucide Icons
vi.mock("lucide-react", () => ({
  PlusCircle: () => <svg />,
  Package: () => <svg />,
  Tag: () => <svg />,
  Palette: () => <svg />,
  DollarSign: () => <svg />,
  Type: () => <svg />,
  FileText: () => <svg />,
  Ruler: () => <svg />,
  Layers: () => <svg />,
  ChevronDown: () => <svg />,
  Check: () => <svg />,
  Save: () => <svg />,
  Trash2: () => <svg />,
  Box: () => <svg />,
  Truck: () => <svg />,
  Zap: () => <svg />,
  Loader2: () => <svg />,
}));

describe("ProductForm Component", () => {
  const mockFormData = {
    name: "Test Product",
    price: "100",
    promotionalPrice: "90",
    description: "This is a test product description",
    category: "cat1",
    colors: "col1",
    stock: "10",
    wholesalePrice: "50",
    packagingCost: "5",
    marketingCosts: "10",
    sizes: [{ size: "M", length: "10", width: "10", stock: "10" }],
    viewPhotos: [],
    additionImages: [],
    removedImages: [],
  };

  const mockUseProductForm = {
    formData: mockFormData,
    errors: {
      name: "",
      description: "",
      price: "",
      promotionalPrice: "",
      category: "",
      stock: "",
      wholesalePrice: "",
      packagingCost: "",
      marketingCosts: "",
      sizes: [],
      colors: "",
      viewPhotos: [],
      removedImages: [],
      additionImages: [],
    },
    addSizeField: vi.fn(),
    removeSizeField: vi.fn(),
    handleSizeChange: vi.fn(),
    handleImageUpload: vi.fn(),
    removeImage: vi.fn(),
    handleSubmit: vi.fn((e) => e.preventDefault()),
    handleChange: vi.fn(),
    isLoadingPatch: false,
    isLoadingPost: false,
    categories: { categories: [{ id: "cat1", name: "Category 1" }] },
    isLoadingCategory: false,
    isErrorCategory: false,
    nameCategory: "Category 1",
    setNameCategory: vi.fn(),
    colors: { colors: [{ id: "col1", name: "Color 1" }] },
    isLoadingColors: false,
    isErrorColors: false,
    nameColors: "Color 1",
    setNameColors: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useProductForm).mockReturnValue(
      mockUseProductForm as unknown as ReturnType<typeof useProductForm>,
    );
  });

  it("renders 'Create Product' header in add mode", () => {
    render(
      <BrowserRouter>
        <ProductForm mode="add" />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Create Product/i)).toBeInTheDocument();
  });

  it("renders 'Edit Product' header in edit mode", () => {
    render(
      <BrowserRouter>
        <ProductForm mode="edit" />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Edit Product/i)).toBeInTheDocument();
  });

  it("displays form fields with correct values", () => {
    render(
      <BrowserRouter>
        <ProductForm mode="add" />
      </BrowserRouter>,
    );

    expect(screen.getByPlaceholderText(/Product Name/i)).toHaveValue(
      "Test Product",
    );
    expect(screen.getByPlaceholderText(/^Price$/)).toHaveValue(100);
    expect(
      screen.getByDisplayValue(/This is a test product description/i),
    ).toBeInTheDocument();
  });

  it("calls handleSubmit when the form is submitted", () => {
    render(
      <BrowserRouter>
        <ProductForm mode="add" />
      </BrowserRouter>,
    );

    const form = screen
      .getByRole("button", { name: /Finalize & Save Product/i })
      .closest("form");
    fireEvent.submit(form!);

    expect(mockUseProductForm.handleSubmit).toHaveBeenCalled();
  });
});
