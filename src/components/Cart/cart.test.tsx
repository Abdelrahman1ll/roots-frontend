import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Cart from "./cart";
import UseCart from "./useCart";
import "@testing-library/jest-dom";

// Mock the UseCart hook
vi.mock("./useCart", () => ({
  default: vi.fn(),
}));

// Mock Framer Motion is now handled globally in setup.ts

describe("Cart Component", () => {
  const mockDecreaseQuantity = vi.fn();
  const mockIncreaseQuantity = vi.fn();
  const mockRemoveItem = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeletons when isLoading is true", () => {
    (UseCart as any).mockReturnValue({
      isLoading: true,
      data: null,
      isError: false,
    });

    render(<Cart />);

    // Check for some classes or structure that indicates skeletons
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders empty cart message when no items are present", () => {
    (UseCart as any).mockReturnValue({
      isLoading: false,
      data: { carts: { items: [] } },
      isError: false,
      navigate: mockNavigate,
    });

    render(<Cart />);

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(screen.getByText("Start Shopping")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Start Shopping"));
    expect(mockNavigate).toHaveBeenCalledWith("/products");
  });

  it("renders error message when isError is true", () => {
    (UseCart as any).mockReturnValue({
      isLoading: false,
      data: null,
      isError: true,
      navigate: mockNavigate,
    });

    render(<Cart />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders cart items correctly when data is available", () => {
    const mockData = {
      carts: {
        items: [
          {
            id: 1,
            quantity: 2,
            sizes: { id: 101, size: "M", length: 70, width: 50, stock: 10 },
            product: {
              id: 501,
              name: "Luxury Mirror",
              price: 1500,
              images: ["image1.jpg"],
              stock: 10,
              total_stock: 20,
            },
          },
        ],
      },
    };

    (UseCart as any).mockReturnValue({
      isLoading: false,
      data: mockData,
      isError: false,
      decreaseQuantity: mockDecreaseQuantity,
      increaseQuantity: mockIncreaseQuantity,
      removeItem: mockRemoveItem,
      navigate: mockNavigate,
    });

    render(<Cart />);

    expect(screen.getByText("Luxury Mirror")).toBeInTheDocument();
    expect(screen.getByText("1500")).toBeInTheDocument();
    expect(screen.getByText("Size: M")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // Quantity
  });

  it("calls interaction handlers correctly", () => {
    const mockData = {
      carts: {
        items: [
          {
            id: 1,
            quantity: 2,
            sizes: { id: 101, size: "M", length: 70, width: 50, stock: 10 },
            product: {
              id: 501,
              name: "Luxury Mirror",
              price: 1500,
              images: ["image1.jpg"],
              stock: 10,
              total_stock: 20,
            },
          },
        ],
      },
    };

    (UseCart as any).mockReturnValue({
      isLoading: false,
      data: mockData,
      isError: false,
      decreaseQuantity: mockDecreaseQuantity,
      increaseQuantity: mockIncreaseQuantity,
      removeItem: mockRemoveItem,
      navigate: mockNavigate,
    });

    render(<Cart />);

    // Test increase
    fireEvent.click(screen.getByText("+"));
    expect(mockIncreaseQuantity).toHaveBeenCalledWith({ id: 1, quantity: 2 });

    // Test decrease
    fireEvent.click(screen.getByText("−"));
    expect(mockDecreaseQuantity).toHaveBeenCalledWith({ id: 1, quantity: 2 });

    // Test remove (X button)
    const removeButton = screen.getByRole("button", { name: /Remove item/i });
    // Let's find it more specifically if needed, but since it's the only one with X icon...
    fireEvent.click(removeButton);
    expect(mockRemoveItem).toHaveBeenCalledWith(1);

    // Test Checkout
    fireEvent.click(screen.getByText("Checkout"));
    expect(mockNavigate).toHaveBeenCalledWith("/checkout");
  });
});
