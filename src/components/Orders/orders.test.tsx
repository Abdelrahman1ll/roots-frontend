import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Orders from "./orders";
import useOrders from "./useOrders";
import type { OrderType } from "../../types/OrderType";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock useOrders hook
vi.mock("./useOrders", () => ({
  __esModule: true,
  default: vi.fn(),
}));

// Mock Framer Motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    h1: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <h1 {...props}>{children}</h1>,
    h2: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <h2 {...props}>{children}</h2>,
    h3: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <h3 {...props}>{children}</h3>,
    p: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <p {...props}>{children}</p>,
    span: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <span {...props}>{children}</span>,
  },
}));

// Mock Lucide icons
vi.mock("lucide-react", () => ({
  Package: () => <div data-testid="package-icon" />,
  ShoppingBag: () => <div data-testid="bag-icon" />,
  ChevronRight: () => <div data-testid="chevron-icon" />,
}));

// Mock Skeleton
vi.mock("../Skeleton", () => ({
  SkeletonList: () => <div data-testid="skeleton-list" />,
}));

describe("Orders Component", () => {
  const mockOrders = [
    {
      id: "1",
      orderNumber: "ORD-001",
      totalPrice: 1500,
      createdAt: "2023-10-01",
      items: [{}, {}],
      isDelivered: true,
    },
    {
      id: "2",
      orderNumber: "ORD-002",
      totalPrice: 2000,
      createdAt: "2023-10-02",
      items: [{}],
      isShipped: true,
    },
  ] as unknown as OrderType[];

  const mockUseOrders = {
    orders: mockOrders,
    isLoading: false,
    formatEndDateArabic: vi.fn((date) => date),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useOrders).mockReturnValue(mockUseOrders);
  });

  it("renders order history title correctly", () => {
    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Order/)).toBeInTheDocument();
    expect(screen.getByText(/History/)).toBeInTheDocument();
  });

  it("renders list of orders correctly", () => {
    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>,
    );

    expect(screen.getByText("#ORD-001")).toBeInTheDocument();
    expect(screen.getByText("#ORD-002")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
    expect(screen.getByText("Shipped")).toBeInTheDocument();
    expect(screen.getByText("1,500")).toBeInTheDocument();
    expect(screen.getByText("2,000")).toBeInTheDocument();
  });

  it("shows skeletons when loading", () => {
    vi.mocked(useOrders).mockReturnValue({
      ...mockUseOrders,
      isLoading: true,
      orders: [] as OrderType[],
    });

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("skeleton-list")).toBeInTheDocument();
  });

  it("shows empty state when no orders found", () => {
    vi.mocked(useOrders).mockReturnValue({
      ...mockUseOrders,
      orders: [] as OrderType[],
    });

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>,
    );

    expect(screen.getByText("No Orders Yet")).toBeInTheDocument();
    expect(screen.getByText("Start Shopping")).toBeInTheDocument();
  });
});
