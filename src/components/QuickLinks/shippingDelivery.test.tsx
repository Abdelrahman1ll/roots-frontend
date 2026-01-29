import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ShippingDelivery from "./shippingDelivery";
import "@testing-library/jest-dom";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    span: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <span {...props}>{children}</span>,
    h1: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <h1 {...props}>{children}</h1>,
  },
}));

// Mock Lucide Icons
vi.mock("lucide-react", () => ({
  Truck: () => <svg data-testid="truck-icon" />,
  MapPin: () => <svg data-testid="map-pin-icon" />,
  Clock: () => <svg data-testid="clock-icon" />,
  CreditCard: () => <svg data-testid="credit-card-icon" />,
}));

// Mock Redux hook
vi.mock("../../redux/Delivery/apiDelivery", () => ({
  useGetDeliveryQuery: vi.fn(() => ({
    data: {
      deliveries: [
        {
          id: 1,
          deliveryPriceClose: 60,
          deliveryPriceFar: 80,
        },
      ],
    },
    isLoading: false,
  })),
}));

describe("ShippingDelivery Component", () => {
  it("renders the main heading correctly", () => {
    render(<ShippingDelivery />);
    expect(screen.getAllByText(/Shipping/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Policy/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Logistics & Delivery/i)).toBeInTheDocument();
  });

  it("renders all shipping options with correct details", () => {
    render(<ShippingDelivery />);

    // Standard Shipping
    expect(screen.getByText(/Standard Shipping/i)).toBeInTheDocument();
    expect(screen.getByText(/الشحن القياسي/i)).toBeInTheDocument();
    expect(screen.getByText("60 EGP")).toBeInTheDocument();
    expect(screen.getByText(/Most Governorates/i)).toBeInTheDocument();
    expect(screen.getByTestId("truck-icon")).toBeInTheDocument();

    // Southern Governorates
    expect(screen.getByText(/Southern Governorates/i)).toBeInTheDocument();
    expect(screen.getByText(/محافظات الجنوب/i)).toBeInTheDocument();
    expect(screen.getByText("80 EGP")).toBeInTheDocument();
    expect(screen.getByText(/Southern Areas/i)).toBeInTheDocument();
    expect(screen.getByTestId("map-pin-icon")).toBeInTheDocument();

    // Delivery Timeframe
    expect(screen.getByText(/Delivery Timeframe/i)).toBeInTheDocument();
    expect(screen.getByText(/مدة التوصيل/i)).toBeInTheDocument();
    expect(screen.getByText("3-7 Days")).toBeInTheDocument();
    expect(screen.getByText(/Fast Delivery/i)).toBeInTheDocument();
    expect(screen.getByTestId("clock-icon")).toBeInTheDocument();
  });

  it("renders footer security note", () => {
    render(<ShippingDelivery />);
    expect(
      screen.getByText(/Secure Payments Upon Delivery or Online/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("credit-card-icon")).toBeInTheDocument();
  });
});
