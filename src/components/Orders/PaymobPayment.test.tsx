import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PaymobPayment from "./PaymobPayment";
import { usePostPaymentMutation } from "../../redux/Payment/apiPayment";
import "@testing-library/jest-dom";

// Mock the API hook
vi.mock("../../redux/Payment/apiPayment", () => ({
  usePostPaymentMutation: vi.fn(),
}));

describe("PaymobPayment Component", () => {
  const mockPaymentData = {
    amount: 1000,
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    phone_number: "0123456789",
    city: "Cairo",
  };

  const mockOnCardValidityChange = vi.fn();
  const mockTriggerPayRef = { current: null };
  const mockSetIsPaying = vi.fn();
  const mockHandlePayment = vi.fn();

  const mockPostPayment = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(usePostPaymentMutation).mockReturnValue([
      mockPostPayment,
      { isError: false } as any,
    ]);
  });

  it("renders loading state initially", async () => {
    mockPostPayment.mockReturnValue({
      unwrap: () => new Promise(() => {}), // Never resolves
    });

    render(
      <PaymobPayment
        paymentData={mockPaymentData}
        onCardValidityChange={mockOnCardValidityChange}
        triggerPayRef={mockTriggerPayRef}
        setIsPaying={mockSetIsPaying}
        handlePayment={mockHandlePayment}
      />,
    );

    expect(document.querySelector(".animate-dot")).toBeInTheDocument();
  });

  it("renders iframe when payment initialization succeeds", async () => {
    mockPostPayment.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          clientSecret: "test-secret",
          publicKey: "test-key",
          orderPaymentId: "test-id",
        }),
    });

    render(
      <PaymobPayment
        paymentData={mockPaymentData}
        onCardValidityChange={mockOnCardValidityChange}
        triggerPayRef={mockTriggerPayRef}
        setIsPaying={mockSetIsPaying}
        handlePayment={mockHandlePayment}
      />,
    );

    await waitFor(() => {
      const iframe = document.querySelector("iframe");
      expect(iframe).toBeInTheDocument();
    });
  });

  it("shows error message if payment initialization fails", async () => {
    vi.mocked(usePostPaymentMutation).mockReturnValue([
      mockPostPayment,
      { isError: true } as any,
    ]);
    mockPostPayment.mockReturnValue({
      unwrap: () => Promise.reject(new Error("Failed")),
    });

    render(
      <PaymobPayment
        paymentData={mockPaymentData}
        onCardValidityChange={mockOnCardValidityChange}
        triggerPayRef={mockTriggerPayRef}
        setIsPaying={mockSetIsPaying}
        handlePayment={mockHandlePayment}
      />,
    );

    expect(
      await screen.findByText(/Something went wrong/i),
    ).toBeInTheDocument();
  });

  it("listens for window messages correctly", async () => {
    mockPostPayment.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          clientSecret: "test-secret",
          publicKey: "test-key",
          orderPaymentId: "test-id",
        }),
    });

    render(
      <PaymobPayment
        paymentData={mockPaymentData}
        onCardValidityChange={mockOnCardValidityChange}
        triggerPayRef={mockTriggerPayRef}
        setIsPaying={mockSetIsPaying}
        handlePayment={mockHandlePayment}
      />,
    );

    // Simulate CARD_VALID message
    window.postMessage({ type: "CARD_VALID", isValid: true }, "*");

    await waitFor(() => {
      expect(mockOnCardValidityChange).toHaveBeenCalledWith(true);
    });
  });
});

// Since Vitest doesn't have an 'iframe' role by default in all environments,
// we might need to adjust the selector or mock more heavily if it fails.
// But mostly we are testing the React logic around the iframe.
