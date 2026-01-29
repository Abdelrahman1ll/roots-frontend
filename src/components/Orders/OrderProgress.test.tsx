import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import OrderProgress from "./OrderProgress";
import useOrderProgress from "./useOrderProgress";
import type { OrderType } from "../../types/OrderType";
import "@testing-library/jest-dom";

// Mock useOrderProgress hook
vi.mock("./useOrderProgress", () => ({
  __esModule: true,
  default: vi.fn(),
}));

// Mock Lucide icons
vi.mock("lucide-react", () => ({
  DollarSign: () => <div data-testid="dollar-icon" />,
  CheckCircle2: () => <div data-testid="check-icon" />,
  Package: () => <div data-testid="package-icon" />,
  Truck: () => <div data-testid="truck-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
}));

describe("OrderProgress Component", () => {
  const mockOrder = {
    id: "order_123",
    status: "pending",
  } as unknown as OrderType;

  const mockRefetch = vi.fn();

  const mockUseOrderProgress = {
    isPaid: false,
    isConfirmed: false,
    isShipped: false,
    isDelivered: false,
    isCanceled: false,
    patchIsPaid: vi.fn(),
    patchIsConfirmed: vi.fn(),
    patchIsShipped: vi.fn(),
    patchIsDelivered: vi.fn(),
    patchIsCanceled: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useOrderProgress).mockReturnValue(
      mockUseOrderProgress as unknown as ReturnType<typeof useOrderProgress>,
    );
  });

  it("renders order status buttons correctly", () => {
    render(<OrderProgress order={mockOrder} refetch={mockRefetch} />);

    expect(screen.getByText("Order Status")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
    expect(screen.getByText("Shipped")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
    expect(screen.getByText("Canceled")).toBeInTheDocument();
  });

  it("calls patch action and refetch when a button is clicked", async () => {
    render(<OrderProgress order={mockOrder} refetch={mockRefetch} />);

    const paidButton = screen.getByText("Paid");
    fireEvent.click(paidButton);

    await waitFor(() => {
      expect(mockUseOrderProgress.patchIsPaid).toHaveBeenCalledWith(
        "order_123",
      );
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it("shows active state for active statuses", () => {
    vi.mocked(useOrderProgress).mockReturnValue({
      ...mockUseOrderProgress,
      isPaid: true,
      isConfirmed: true,
    } as unknown as ReturnType<typeof useOrderProgress>);

    render(<OrderProgress order={mockOrder} refetch={mockRefetch} />);

    const paidButton = screen.getByText("Paid").closest("button");
    const confirmedButton = screen.getByText("Confirmed").closest("button");
    const shippedButton = screen.getByText("Shipped").closest("button");

    expect(paidButton).toHaveClass("bg-white");
    expect(confirmedButton).toHaveClass("bg-white");
    expect(shippedButton).not.toHaveClass("bg-white");
  });
});
