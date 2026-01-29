import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useProductForm from "./useProductForm";
import * as apiProducts from "../../redux/products/apiProducts";
import * as apiCategory from "../../redux/category/apiCategory";
import * as apiColor from "../../redux/color/apiColor";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

vi.mock("../../redux/products/apiProducts");
vi.mock("../../redux/category/apiCategory");
vi.mock("../../redux/color/apiColor");
vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => "mock-url");

describe("useProductForm Hook", () => {
  const mockPostProduct = vi.fn();
  const mockPatchProduct = vi.fn();
  const mockUnwrap = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockPostProduct.mockReturnValue({ unwrap: mockUnwrap });
    mockPatchProduct.mockReturnValue({ unwrap: mockUnwrap });

    vi.mocked(apiCategory.useGetCategoryQuery).mockReturnValue({
      data: { categories: [{ id: 1, name: "Cat 1" }] },
      isLoading: false,
      isError: false,
    } as any);

    vi.mocked(apiColor.useGetColorsQuery).mockReturnValue({
      data: { colors: [{ id: 1, name: "Red" }] },
      isLoading: false,
      isError: false,
    } as any);

    vi.mocked(apiProducts.usePostProductMutation).mockReturnValue([
      mockPostProduct,
      { isLoading: false },
    ] as any);

    vi.mocked(apiProducts.usePatchProductMutation).mockReturnValue([
      mockPatchProduct,
      { isLoading: false },
    ] as any);

    vi.mocked(apiProducts.useGetProductsQuery).mockReturnValue({
      data: {
        products: [
          {
            id: 1,
            name: "Existing Product",
            category: { id: 1, name: "Cat 1" },
            colors: { id: 1, name: "Red" },
            images: ["img1.jpg"],
          },
        ],
      },
    } as any);

    vi.mocked(useParams).mockReturnValue({ id: "1" });
  });

  it("initializes with default values in add mode", () => {
    const { result } = renderHook(() => useProductForm("add"));
    expect(result.current.formData.name).toBe("");
    expect(result.current.formData.sizes).toHaveLength(1);
  });

  it("initializes with product data in edit mode", () => {
    const { result } = renderHook(() => useProductForm("edit"));
    expect(result.current.formData.name).toBe("Existing Product");
    expect(result.current.nameCategory).toBe("Cat 1");
  });

  it("updates form data on handleChange", () => {
    const { result } = renderHook(() => useProductForm("add"));
    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "New Product", type: "text" },
      } as any);
    });
    expect(result.current.formData.name).toBe("New Product");
  });

  it("manages size fields correctly", () => {
    const { result } = renderHook(() => useProductForm("add"));

    // Add size
    act(() => {
      result.current.addSizeField();
    });
    expect(result.current.formData.sizes).toHaveLength(2);

    // Update size
    act(() => {
      result.current.handleSizeChange(1, "size", "M");
    });
    expect(result.current.formData.sizes[1].size).toBe("M");

    // Remove size
    act(() => {
      result.current.removeSizeField(0);
    });
    expect(result.current.formData.sizes).toHaveLength(1);
    expect(result.current.formData.sizes[0].size).toBe("M");
  });

  it("handles image uploads", () => {
    const { result } = renderHook(() => useProductForm("add"));
    const file = new File([""], "test.png", { type: "image/png" });

    act(() => {
      result.current.handleImageUpload({
        target: { files: [file] },
      } as any);
    });

    expect(result.current.formData.additionImages).toContain(file);
    expect(result.current.formData.viewPhotos).toContain("mock-url");
  });

  it("validates form before submission", async () => {
    const { result } = renderHook(() => useProductForm("add"));

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(result.current.errors.name).toBeTruthy();
    expect(result.current.errors.viewPhotos).toBeTruthy();
    expect(mockPostProduct).not.toHaveBeenCalled();
  });

  it("submits the form successfully in add mode", async () => {
    const { result } = renderHook(() => useProductForm("add"));

    // Fill required fields
    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "Valid Name", type: "text" },
      } as any);
      result.current.handleChange({
        target: {
          name: "description",
          value: "Valid Description",
          type: "text",
        },
      } as any);
      result.current.handleChange({
        target: { name: "price", value: "100", type: "number" },
      } as any);
      result.current.handleChange({
        target: { name: "promotionalPrice", value: "200", type: "number" },
      } as any);
      result.current.handleChange({
        target: { name: "stock", value: "10", type: "number" },
      } as any);
      result.current.handleChange({
        target: { name: "wholesalePrice", value: "50", type: "number" },
      } as any);
      result.current.handleChange({
        target: { name: "packagingCost", value: "5", type: "number" },
      } as any);
      result.current.handleChange({
        target: { name: "marketingCosts", value: "5", type: "number" },
      } as any);

      // Select category and color
      result.current.handleChange({
        target: { name: "category", value: "1", type: "text" },
      } as any);
      result.current.handleChange({
        target: { name: "colors", value: "1", type: "text" },
      } as any);

      // Add image
      result.current.handleImageUpload({
        target: {
          files: [new File([""], "img.jpg", { type: "image/jpeg" })],
        },
      } as any);

      // Set size details
      result.current.handleSizeChange(0, "size", "L");
      result.current.handleSizeChange(0, "length", "10");
      result.current.handleSizeChange(0, "width", "5");
      result.current.handleSizeChange(0, "stock", "10");
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any);
    });

    expect(mockPostProduct).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Product added successfully!");
  });
});
