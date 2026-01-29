import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import useOrders from "./useOrders";
import React from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

/* ======================
   🔹 Mock RTK Query Hooks
====================== */
const ownerOrdersMock = { orders: [{ id: 1 }] };
const userOrdersMock = { orders: [{ id: 2 }, { id: 3 }] };
const adminOrdersMock = { orders: [{ id: 4 }] };

vi.mock("../../redux/Orders/apiOrders", () => ({
  useGetOwnerOrdersQuery: vi.fn(() => ({
    data: ownerOrdersMock,
    isLoading: false,
  })),
  useGetUserOrdersQuery: vi.fn(() => ({
    data: userOrdersMock,
    isLoading: false,
  })),
  useGetAdminOrdersQuery: vi.fn(() => ({
    data: adminOrdersMock,
    isLoading: false,
  })),
}));

vi.mock("react-toastify", () => ({
  toast: { error: vi.fn() },
}));

/* ======================
   🔹 Helper wrapper
====================== */
const wrapper =
  (user: any) =>
  ({ children }: { children: React.ReactNode }) => {
    const mockValue = { user, initializing: false, setUser: vi.fn() } as any;
    return (
      <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
    );
  };

/* ======================
   🔹 Tests
====================== */
describe("useOrders hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns user orders for role 'user'", () => {
    const { result } = renderHook(() => useOrders(), {
      wrapper: wrapper({ role: "user" }),
    });

    expect(result.current.orders.length).toBe(2);
    expect(result.current.orders[0].id).toBe(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.formatEndDateArabic).toBeTypeOf("function");
  });

  it("returns owner orders for role 'owner'", () => {
    const { result } = renderHook(() => useOrders(), {
      wrapper: wrapper({ role: "owner" }),
    });

    expect(result.current.orders.length).toBe(1);
    expect(result.current.orders[0].id).toBe(1);
    expect(result.current.isLoading).toBe(false);
  });

  it("returns admin orders for role 'admin'", () => {
    const { result } = renderHook(() => useOrders(), {
      wrapper: wrapper({ role: "admin" }),
    });

    expect(result.current.orders.length).toBe(1);
    expect(result.current.orders[0].id).toBe(4);
    expect(result.current.isLoading).toBe(false);
  });

  it("calls toast error if user has unknown role", () => {
    renderHook(() => useOrders(), {
      wrapper: wrapper({ role: "guest" }),
    });

    expect(toast.error).toHaveBeenCalledWith(
      "You are not authorized to view this page.",
    );
  });

  it("returns empty orders and isLoading false if user is null", () => {
    const { result } = renderHook(() => useOrders(), {
      wrapper: wrapper(null),
    });

    expect(result.current.orders).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});
