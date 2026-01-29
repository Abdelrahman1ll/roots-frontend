import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import useCheckout from "./useCheckout";
import { useGetCartQuery } from "../../redux/Cart/apiCart";
import { useGetDeliveryQuery } from "../../redux/Delivery/apiDelivery";
import { usePostValidateDiscountCodeMutation } from "../../redux/DiscountCodes/apiDiscountCodes";
import { usePostOrdersMutation } from "../../redux/Orders/apiOrders";
import { useGetUserOrdersQuery } from "../../redux/Orders/apiOrders";
import { AuthContext } from "../../context/AuthContext";
import type { UserType } from "../../types/UserType";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Mock dependencies
vi.mock("../../redux/Cart/apiCart", () => ({ useGetCartQuery: vi.fn() }));
vi.mock("../../redux/Delivery/apiDelivery", () => ({
  useGetDeliveryQuery: vi.fn(),
}));
vi.mock("../../redux/DiscountCodes/apiDiscountCodes", () => ({
  usePostValidateDiscountCodeMutation: vi.fn(),
}));
vi.mock("../../redux/Orders/apiOrders", () => ({
  usePostOrdersMutation: vi.fn(),
  useGetUserOrdersQuery: vi.fn(),
}));
vi.mock("react-router-dom", () => ({ useNavigate: vi.fn() }));
vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

// Mock Audio play function and Geolocation
beforeAll(() => {
  window.HTMLMediaElement.prototype.play = vi.fn();
  Object.defineProperty(global.navigator, "geolocation", {
    value: {
      getCurrentPosition: vi.fn(),
      watchPosition: vi.fn(),
      clearWatch: vi.fn(),
    },
    writable: true,
  });
  // Mock window.scroll
  window.scroll = vi.fn();
  window.scrollTo = vi.fn();
});

describe("useCheckout Hook", () => {
  const mockNavigate = vi.fn();
  const mockUser = { email: "test@example.com" };
  const mockValidateDiscount = vi.fn();
  const mockPostOrders = vi.fn();
  const mockRefetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useGetCartQuery).mockReturnValue({
      data: {
        carts: {
          items: [],
          total: 0,
          user: { PROFILE: false, BIRTHDAY: false },
        },
      },
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: undefined,
      isFetching: false,
      isUninitialized: false,
      refetch: vi.fn(),
      startedTimeStamp: Date.now(),
      fulfilledTimeStamp: Date.now(),
      currentData: undefined,
      endpointName: "getCart",
      originalArgs: undefined,
      requestId: "test-request-id",
      status: "fulfilled" as const,
    } as any);
    vi.mocked(useGetDeliveryQuery).mockReturnValue({
      data: {
        deliveries: [{ id: 1, deliveryPriceClose: 50, deliveryPriceFar: 80 }],
      },
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: undefined,
      isFetching: false,
      isUninitialized: false,
      refetch: vi.fn(),
      startedTimeStamp: Date.now(),
      fulfilledTimeStamp: Date.now(),
      currentData: undefined,
      endpointName: "getDelivery",
      originalArgs: undefined,
      requestId: "test-request-id",
      status: "fulfilled" as const,
    } as any);
    vi.mocked(usePostValidateDiscountCodeMutation).mockReturnValue([
      mockValidateDiscount,
      { isLoading: false } as any,
    ]);
    vi.mocked(usePostOrdersMutation).mockReturnValue([
      mockPostOrders,
      { isLoading: false } as any,
    ]);
    vi.mocked(useGetUserOrdersQuery).mockReturnValue({
      refetch: mockRefetch,
    } as any);
    // Clear localStorage
    localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider
      value={{
        user: mockUser as UserType,
        setUser: vi.fn(),
        logout: vi.fn(),
        initializing: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

  it("initializes with default values and user email", () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    expect(result.current.email).toBe("test@example.com");
    expect(result.current.firstName).toBe("");
    expect(result.current.paymentMethod).toBe("");
  });

  it("calculates delivery fee correctly for close area", () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    act(() => {
      result.current.setState("Cairo");
    });

    expect(result.current.deliveryFee).toBe(50);
  });

  it("calculates delivery fee correctly for far area", () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    act(() => {
      result.current.setState("Luxor");
    });

    expect(result.current.deliveryFee).toBe(80);
  });

  it("applies discount code correctly", async () => {
    mockValidateDiscount.mockReturnValue({
      unwrap: () =>
        Promise.resolve({ discountCode: { code: "PROMO10", discount: 10 } }),
    });

    const { result } = renderHook(() => useCheckout(), { wrapper });

    act(() => {
      result.current.setPromoCode("PROMO10");
    });

    await act(async () => {
      await result.current.applyDiscount();
    });

    expect(result.current.discount).toBe(10);
    expect(result.current.errorMsg).toBe("");
  });

  it("validates form correctly", async () => {
    vi.mocked(useGetCartQuery).mockReturnValue({
      data: {
        carts: {
          items: [{ id: 1 }],
          total: 100,
          id: "cart1",
          user: { PROFILE: false, BIRTHDAY: false },
        },
      },
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: undefined,
      isFetching: false,
      isUninitialized: false,
      refetch: vi.fn(),
      startedTimeStamp: Date.now(),
      fulfilledTimeStamp: Date.now(),
      currentData: undefined,
      endpointName: "getCart",
      originalArgs: undefined,
      requestId: "test-request-id",
      status: "fulfilled" as const,
    } as any);

    const { result } = renderHook(() => useCheckout(), { wrapper });

    // Try to pay without filling form
    await act(async () => {
      await result.current.handlePayment();
    });

    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0);
    expect(mockPostOrders).not.toHaveBeenCalled();
  });

  it("handles successful payment", async () => {
    vi.mocked(useGetCartQuery).mockReturnValue({
      data: {
        carts: {
          items: [{ id: 1 }],
          total: 100,
          id: "cart1",
          user: { PROFILE: false, BIRTHDAY: false },
        },
      },
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: undefined,
      isFetching: false,
      isUninitialized: false,
      refetch: vi.fn(),
      startedTimeStamp: Date.now(),
      fulfilledTimeStamp: Date.now(),
      currentData: undefined,
      endpointName: "getCart",
      originalArgs: undefined,
      requestId: "test-request-id",
      status: "fulfilled" as const,
    } as any);

    mockPostOrders.mockReturnValue({ unwrap: () => Promise.resolve({}) });

    const { result } = renderHook(() => useCheckout(), { wrapper });

    act(() => {
      result.current.setFirstName("John");
      result.current.setLastName("Doe");
      result.current.setState("Cairo");
      result.current.setAddressDetails("123 Street");
      result.current.setPhone1("01023456789");
      result.current.handleSelectMethod("cash_on_delivery");
    });

    await act(async () => {
      await result.current.handlePayment();
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Order placed successfully");
      expect(mockNavigate).toHaveBeenCalledWith("/orders");
    });
  });

  it("loads and saves address to localStorage", () => {
    localStorage.setItem(
      "checkoutAddress",
      JSON.stringify({
        firstName: "Saved",
        lastName: "User",
        state: "Giza",
        addressDetails: "Saved St",
        phone1: "01123456789",
        phone2: "",
      }),
    );

    const { result } = renderHook(() => useCheckout(), { wrapper });

    expect(result.current.firstName).toBe("Saved");
    expect(result.current.saveAddress).toBe(true);

    act(() => {
      result.current.setFirstName("Updated");
    });

    const saved = JSON.parse(localStorage.getItem("checkoutAddress")!);
    expect(saved.firstName).toBe("Updated");
  });
});
