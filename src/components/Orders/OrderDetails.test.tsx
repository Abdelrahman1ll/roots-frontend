import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import OrderDetails from "./OrderDetails";
import useOrderDetails from "./useOrderDetails";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock useOrderDetails hook
vi.mock("./useOrderDetails", () => ({
  __esModule: true,
  default: vi.fn(),
}));

// Mock Framer Motion
// Mock Framer Motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    h4: ({ children, ...props }: any) => <h4 {...props}>{children}</h4>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

// Mock Lucide icons
vi.mock("lucide-react", () => ({
  Truck: () => <div data-testid="truck-icon" />,
  User: () => <div data-testid="user-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />,
  CheckCircle2: () => <div data-testid="check-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  ShoppingCart: () => <div data-testid="cart-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Phone: () => <div data-testid="phone-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  CreditCard: () => <div data-testid="credit-card-icon" />,
  Package: () => <div data-testid="package-icon" />,
}));

// Mock components
vi.mock("./OrderProgress", () => ({
  __esModule: true,
  default: () => <div data-testid="order-progress" />,
}));

vi.mock("../Skeleton", () => ({
  SkeletonList: () => <div data-testid="skeleton-list" />,
}));

describe("OrderDetails Component", () => {
  const mockOrder = {
    orderNumber: "ORD-12345",
    paymentMethod: "credit_card",
    paymentId: "pay_98765",
    isPaid: true,
    isCanceled: false,
    createdAt: "2023-10-01T10:00:00Z",
    totalPrice: 1050,
    deliveryPrice: 50,
    items: [
      {
        id: 1,
        product: {
          name: "Test Product",
          images: ["image1.jpg"],
          price: 1000,
        },
        quantity: 1,
        sizes: { size: "L", length: 70, width: 50 },
        price: 1000,
      },
    ],
    user: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "0123456789",
      birthday: "1990-01-01",
    },
    addresses: {
      fullName: "John",
      lastName: "Doe",
      city: "Cairo",
      country: "Egypt",
      address: "123 Street",
      phone: "0123456789",
    },
  };

  const mockUseOrderDetails = {
    order: mockOrder,
    specialSteps: [
      { label: "Ordered", key: "isOrdered", icon: () => null },
      { label: "Shipped", key: "isShipped", icon: () => null },
    ],
    actualIndex: 0,
    formatEndDateArabic: vi.fn((date) => date),
    refetchOrders: vi.fn(),
    role: "admin",
    isLoadingOrders: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useOrderDetails).mockReturnValue(
      mockUseOrderDetails as unknown as ReturnType<typeof useOrderDetails>,
    );
  });

  it("renders order basic info correctly", () => {
    render(
      <BrowserRouter>
        <OrderDetails />
      </BrowserRouter>,
    );

    expect(screen.getByText("Order Details")).toBeInTheDocument();
    expect(screen.getByText("ID: ORD-12345")).toBeInTheDocument();
    expect(screen.getByText("Credit Card")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("renders customer and shipping info for admin", () => {
    render(
      <BrowserRouter>
        <OrderDetails />
      </BrowserRouter>,
    );

    expect(screen.getByText("Customer Information")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Shipping Details")).toBeInTheDocument();
    expect(screen.getByText("Cairo, Egypt")).toBeInTheDocument();
  });

  it("renders order items correctly", () => {
    render(
      <BrowserRouter>
        <OrderDetails />
      </BrowserRouter>,
    );

    expect(screen.getByText("Order Items")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getAllByText(/1,000/)[0]).toBeInTheDocument();
    expect(screen.getAllByText("Subtotal")[0]).toBeInTheDocument();
  });

  it("renders price summary correctly", () => {
    render(
      <BrowserRouter>
        <OrderDetails />
      </BrowserRouter>,
    );

    expect(screen.getByText("Final Summary")).toBeInTheDocument();
    expect(screen.getByText("1,050.00 EGP")).toBeInTheDocument();
  });

  it("shows skeleton when loading", () => {
    vi.mocked(useOrderDetails).mockReturnValue({
      ...mockUseOrderDetails,
      isLoadingOrders: true,
    } as unknown as ReturnType<typeof useOrderDetails>);

    render(
      <BrowserRouter>
        <OrderDetails />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("skeleton-list")).toBeInTheDocument();
  });
});
