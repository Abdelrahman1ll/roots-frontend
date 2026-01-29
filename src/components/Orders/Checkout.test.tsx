import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Checkout from "./Checkout";
import useCheckout from "./useCheckout";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock useCheckout hook
vi.mock("./useCheckout", () => ({
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
    p: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <p {...props}>{children}</p>,
    button: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <button {...props}>{children}</button>,
    section: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <section {...props}>{children}</section>,
    span: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock Lucide icons
vi.mock("lucide-react", () => ({
  Loader2: () => <div data-testid="loader-icon" />,
  CreditCard: () => <div data-testid="card-icon" />,
  Smartphone: () => <div data-testid="phone-icon" />,
  Wallet: () => <div data-testid="wallet-icon" />,
  Truck: () => <div data-testid="truck-icon" />,
  ShoppingCart: () => <div data-testid="cart-icon" />,
  ChevronDown: () => <div data-testid="chevron-icon" />,
  Info: () => <div data-testid="info-icon" />,
  ShieldCheck: () => <div data-testid="shield-icon" />,
  Tag: () => <div data-testid="tag-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />,
}));

// Mock PaymobIframe
vi.mock("./PaymobIframe", () => ({
  __esModule: true,
  default: () => <div data-testid="paymob-iframe" />,
}));

describe("Checkout Component", () => {
  const mockUseCheckout = {
    discount: 0,
    errorMsg: "",
    openSection: "",
    errors: {},
    applyDiscount: vi.fn(),
    handleSelectMethod: vi.fn(),
    handlePayment: vi.fn(),
    deliveryFee: 50,
    finalTotal: 1050,
    setPromoCode: vi.fn(),
    isLoading: false,
    orderLoading: false,
    paymentMethod: "",
    promoCode: "",
    firstName: "",
    setFirstName: vi.fn(),
    lastName: "",
    setLastName: vi.fn(),
    state: "",
    setState: vi.fn(),
    addressDetails: "",
    setAddressDetails: vi.fn(),
    phone1: "",
    setPhone1: vi.fn(),
    phone2: "",
    setPhone2: vi.fn(),
    data: {
      carts: {
        items: [
          {
            id: "1",
            product: {
              id: "p1",
              name: "Product 1",
              price: 1000,
              images: ["image1.jpg"],
            },
            quantity: 1,
            sizes: { size: "M", length: 70, width: 50 },
          },
        ],
        total: 1000,
      },
    },
    setErrors: vi.fn(),
    navigate: vi.fn(),
    isFirstOrder: false,
    filteredStates: ["Cairo", "Giza"],
    setSearch: vi.fn(),
    setIsDropdownOpen: vi.fn(),
    isDropdownOpen: false,
    search: "",
    saveAddress: false,
    setSaveAddress: vi.fn(),
    email: "test@example.com",
    isCardValid: false,
    setIsCardValid: vi.fn(),
    setIsPaying: vi.fn(),
    isPaying: false,
    payRef: { current: null },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCheckout).mockReturnValue(
      mockUseCheckout as unknown as ReturnType<typeof useCheckout>,
    );
  });

  it("renders shipping details correctly", () => {
    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>,
    );

    expect(screen.getByText("Shipping Details")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. John/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Doe/i)).toBeInTheDocument();
  });

  it("renders order summary correctly", () => {
    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>,
    );

    expect(screen.getByText("Order Summary")).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getAllByText(/EGP 1,000/)[0]).toBeInTheDocument();
  });

  it("calls setFirstName when first name input changes", () => {
    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>,
    );

    const input = screen.getByPlaceholderText(/e.g. John/i);
    fireEvent.change(input, { target: { value: "John" } });
    expect(mockUseCheckout.setFirstName).toHaveBeenCalledWith("John");
  });

  it("displays promo discount when applied", () => {
    vi.mocked(useCheckout).mockReturnValue({
      ...mockUseCheckout,
      discount: 10,
    } as unknown as ReturnType<typeof useCheckout>);

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Discount applied: 10% OFF/i)).toBeInTheDocument();
    expect(screen.getByText(/Promo Discount/i)).toBeInTheDocument();
  });

  it("handles payment method selection", () => {
    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>,
    );

    const cardMethod = screen.getByText("Card");
    fireEvent.click(cardMethod);
    expect(mockUseCheckout.handleSelectMethod).toHaveBeenCalledWith(
      "credit_card",
    );
  });
});
