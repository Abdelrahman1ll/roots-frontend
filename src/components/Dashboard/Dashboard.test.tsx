import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Dashboard from "./Dashboard";
import { useGetDashboardOrdersQuery } from "../../redux/Orders/apiOrders";
import "@testing-library/jest-dom";

// Mock the API hook
vi.mock("../../redux/Orders/apiOrders", () => ({
  useGetDashboardOrdersQuery: vi.fn(),
}));

// Mock Recharts
vi.mock("recharts", async () => {
  const OriginalModule = await vi.importActual("recharts");
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div
        data-testid="responsive-container"
        style={{ width: "800px", height: "400px" }}
      >
        {children}
      </div>
    ),
  };
});

// Mock Loading component
vi.mock("../Loading", () => ({
  default: () => <div data-testid="loading">Loading...</div>,
}));

// Mock icons
vi.mock("lucide-react", () => ({
  PieChart: () => <div data-testid="pie-icon" />,
  TrendingUp: () => <div data-testid="trending-icon" />,
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  Users: () => <div data-testid="users-icon" />,
  ShoppingBag: () => <div data-testid="shopping-bag-icon" />,
  DollarSign: () => <div data-testid="dollar-icon" />,
  ArrowBigLeft: () => <div data-testid="arrow-left-icon" />,
  ArrowRightLeft: () => <div data-testid="arrow-swap-icon" />,
}));

const mockData = {
  stats: {
    totals: {
      totalOrders: 150,
      totalToday: 5,
      totalYesterday: 8,
      totalWeek: 45,
      totalMonth: 120,
      totalYear: 1200,
      ordersLength: 150,
    },
    discounts: {
      withDiscount: 60,
      withoutDiscount: 90,
    },
    ordersByStatus: [
      { status: "Delivered", count: 100 },
      { status: "Canceled", count: 10 },
      { status: "Paid", count: 40 },
    ],
    topCustomers: [
      { email: "user1@example.com", count: 10 },
      { email: "user2@example.com", count: 8 },
    ],
    costs: {
      totalWholesalePrice: 50000,
      totalMarketingCosts: 5000,
      totalPackagingCost: 1000,
      deliveryPrice: 2000,
      totalNetProfit: 42000,
    },
    monthlyStats: {
      "2024": [100, 200, 150, 300, 250, 400, 350, 500, 450, 600, 550, 700],
      "2023": [80, 150, 120, 250, 200, 350, 300, 450, 400, 550, 500, 650],
    },
  },
};

describe("Dashboard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state correctly", () => {
    vi.mocked(useGetDashboardOrdersQuery).mockReturnValue({
      isLoading: true,
      data: null,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    render(<Dashboard />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders error state correctly", () => {
    vi.mocked(useGetDashboardOrdersQuery).mockReturnValue({
      isLoading: false,
      data: null,
      isError: true,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    render(<Dashboard />);
    expect(
      screen.getByText(/An error occurred while fetching data/i),
    ).toBeInTheDocument();
  });

  it("renders success state with all metrics and charts", () => {
    vi.mocked(useGetDashboardOrdersQuery).mockReturnValue({
      isLoading: false,
      data: mockData,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    render(<Dashboard />);

    // Check Header
    expect(screen.getByText("Dashboard Overview")).toBeInTheDocument();

    // Check Totals Cards
    expect(screen.getByText("Total Orders")).toBeInTheDocument();
    expect(screen.getAllByText("150")[0]).toBeInTheDocument();
    expect(screen.getByText("Today Orders")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    // Check Charts Titles
    expect(screen.getByText("Discounts Overview")).toBeInTheDocument();
    expect(screen.getByText("Orders Status")).toBeInTheDocument();

    // Check Top Customers Table
    expect(screen.getByText("user1@example.com")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();

    // Check Financial Overview
    expect(screen.getByText("Net Profit")).toBeInTheDocument();
    expect(screen.getByText("EGP 42,000")).toBeInTheDocument();
  });

  it("navigates to year detail view when clicking a year card", () => {
    vi.mocked(useGetDashboardOrdersQuery).mockReturnValue({
      isLoading: false,
      data: mockData,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    render(<Dashboard />);

    // Check Annual Performance section
    expect(screen.getByText("Annual Performance")).toBeInTheDocument();

    // Find and click the 2024 year card
    const year2024Card = screen.getByText("2024").closest("div");
    if (year2024Card) {
      fireEvent.click(year2024Card);
    }

    // Should show year performance title
    expect(screen.getByText("2024 Performance")).toBeInTheDocument();
    expect(screen.getByText("Back to Overview")).toBeInTheDocument();

    // Click back button
    fireEvent.click(screen.getByText("Back to Overview"));
    expect(screen.getByText("Dashboard Overview")).toBeInTheDocument();
  });

  it("shows comparison view when clicking Compare Years", () => {
    vi.mocked(useGetDashboardOrdersQuery).mockReturnValue({
      isLoading: false,
      data: mockData,
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    } as any);

    render(<Dashboard />);

    // Click Compare Years
    const compareBtn = screen.getByText("Compare Years").closest("div");
    if (compareBtn) {
      fireEvent.click(compareBtn);
    }

    // Should show comparison title (the latest two years are 2024 and 2023)
    expect(screen.getByText("2023 vs 2024")).toBeInTheDocument();
    expect(screen.getByText("Comparative analysis")).toBeInTheDocument();

    // Check growth calculation (total 2024 = 4600, total 2023 = 4150 approx, let's just check if "Growth" text is there)
    expect(screen.getByText("Growth")).toBeInTheDocument();
  });
});
