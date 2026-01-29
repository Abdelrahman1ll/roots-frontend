import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DeliveryPrice from "./AddDelivery";
import {
  useGetDeliveryQuery,
  usePostDeliveryMutation,
  usePostFreeDeliveryMutation,
} from "../../redux/Delivery/apiDelivery";
import { toast } from "react-toastify";
import "@testing-library/jest-dom";

// Mock the API hooks
vi.mock("../../redux/Delivery/apiDelivery", () => ({
  useGetDeliveryQuery: vi.fn(),
  usePostDeliveryMutation: vi.fn(),
  usePostFreeDeliveryMutation: vi.fn(),
}));

// Mock toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock Framer Motion
// Mock Framer Motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("DeliveryPrice Component (AddDelivery)", () => {
  const mockRefetch = vi.fn();
  const mockPostDelivery = vi.fn();
  const mockPostFreeDelivery = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (usePostDeliveryMutation as any).mockReturnValue([
      mockPostDelivery,
      { isLoading: false },
    ]);
    (usePostFreeDeliveryMutation as any).mockReturnValue([
      mockPostFreeDelivery,
      { isLoading: false },
    ]);
  });

  it("renders current delivery prices correctly", () => {
    (useGetDeliveryQuery as any).mockReturnValue({
      data: {
        deliveries: [
          {
            id: 1,
            deliveryPriceClose: 50,
            deliveryPriceFar: 100,
            freeDelivery: false,
          },
        ],
      },
      refetch: mockRefetch,
    });

    render(<DeliveryPrice />);

    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Standard Billing")).toBeInTheDocument();
  });

  it("shows validation error when prices are invalid", async () => {
    (useGetDeliveryQuery as any).mockReturnValue({
      data: { deliveries: [] },
      refetch: mockRefetch,
    });

    render(<DeliveryPrice />);

    const updateButton = screen.getByRole("button", {
      name: /Update Shipping Rates/i,
    });

    // Try empty
    fireEvent.click(updateButton);
    expect(toast.error).toHaveBeenCalledWith(
      "Please enter a valid close delivery price",
    );

    // Try valid close but invalid far
    const nearInput = screen.getByPlaceholderText(/Near Region Rate/i);
    fireEvent.change(nearInput, { target: { value: "30" } });
    fireEvent.click(updateButton);
    expect(toast.error).toHaveBeenCalledWith(
      "Please enter a valid far delivery price",
    );
  });

  it("handles updating delivery prices successfully", async () => {
    const unwrapMock = vi.fn().mockResolvedValue({});
    mockPostDelivery.mockReturnValue({ unwrap: unwrapMock });

    (useGetDeliveryQuery as any).mockReturnValue({
      data: { deliveries: [] },
      refetch: mockRefetch,
    });

    render(<DeliveryPrice />);

    const nearInput = screen.getByPlaceholderText(/Near Region Rate/i);
    const farInput = screen.getByPlaceholderText(/Far Region Rate/i);
    const updateButton = screen.getByRole("button", {
      name: /Update Shipping Rates/i,
    });

    fireEvent.change(nearInput, { target: { value: "60" } });
    fireEvent.change(farInput, { target: { value: "120" } });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockPostDelivery).toHaveBeenCalledWith({
        deliveryPriceClose: 60,
        deliveryPriceFar: 120,
      });
      expect(unwrapMock).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "Delivery prices updated successfully",
      );
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it("toggles free delivery promotion", async () => {
    const unwrapMock = vi.fn().mockResolvedValue({});
    mockPostFreeDelivery.mockReturnValue({ unwrap: unwrapMock });

    (useGetDeliveryQuery as any).mockReturnValue({
      data: {
        deliveries: [
          {
            id: 1,
            deliveryPriceClose: 50,
            deliveryPriceFar: 100,
            freeDelivery: false,
          },
        ],
      },
      refetch: mockRefetch,
    });

    render(<DeliveryPrice />);

    // Open advanced settings
    const advancedButton = screen.getByRole("button", {
      name: /Advanced Configuration/i,
    });
    fireEvent.click(advancedButton);

    // Click override button
    const overrideButton = screen.getByRole("button", {
      name: /Override to Free Shipping/i,
    });
    fireEvent.click(overrideButton);

    await waitFor(() => {
      expect(mockPostFreeDelivery).toHaveBeenCalled();
      expect(unwrapMock).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Free Delivery Activated!");
    });
  });

  it("shows active promotion status when freeDelivery is true", () => {
    (useGetDeliveryQuery as any).mockReturnValue({
      data: {
        deliveries: [
          {
            id: 1,
            deliveryPriceClose: 0,
            deliveryPriceFar: 0,
            freeDelivery: true,
          },
        ],
      },
      refetch: mockRefetch,
    });

    render(<DeliveryPrice />);

    // Open advanced settings to see the status
    fireEvent.click(
      screen.getByRole("button", { name: /Advanced Configuration/i }),
    );

    expect(screen.getByText("Active Promotion")).toBeInTheDocument();
    expect(screen.getByText("Deactivate Free Delivery")).toBeInTheDocument();
  });
});
