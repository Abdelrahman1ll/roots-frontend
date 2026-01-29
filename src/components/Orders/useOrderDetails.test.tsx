import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import useOrderDetails from "./useOrderDetails";
import React from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

/* =======================
   🔹 Helper wrapper
======================= */
const wrapper =
  (user: any) =>
  ({ children }: { children: React.ReactNode }) => {
    const mockValue = { user, initializing: false, setUser: vi.fn() } as any;
    return (
      <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
    );
  };

/* =======================
   🔹 Mock react-router
======================= */
vi.mock("react-router-dom", () => ({
  useParams: () => ({ id: "1" }),
}));

/* =======================
   🔹 Mock toast
======================= */
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

/* =======================
   🔹 Mock formatter
======================= */
vi.mock("../../utils/formatters", () => ({
  formatEndDateArabic: vi.fn((date: string) => `formatted-${date}`),
}));

/* =======================
   🔹 Mock Orders APIs
======================= */
vi.mock("../../redux/Orders/apiOrders", () => ({
  useGetOwnerOrdersQuery: (_: any, opts: any) => ({
    data: opts?.skip
      ? undefined
      : {
          orders: [
            {
              id: 1,
              isConfirmed: true,
              isShipped: false,
              isDelivered: false,
            },
          ],
        },
    refetch: vi.fn(),
    isLoading: false,
  }),

  useGetUserOrdersQuery: (_: any, opts: any) => ({
    data: opts?.skip
      ? undefined
      : {
          orders: [
            {
              id: 1,
              isConfirmed: true,
              isShipped: true,
              isDelivered: false,
            },
          ],
        },
    refetch: vi.fn(),
    isLoading: false,
  }),

  useGetAdminOrdersQuery: (_: any, opts: any) => ({
    data: opts?.skip
      ? undefined
      : {
          orders: [
            {
              id: 1,
              isConfirmed: true,
              isShipped: true,
              isDelivered: true,
            },
          ],
        },
    refetch: vi.fn(),
    isLoading: false,
  }),
}));

/* =======================
   🧪 Tests
======================= */
describe("useOrderDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return order for USER role", () => {
    const { result } = renderHook(() => useOrderDetails(), {
      wrapper: wrapper({ role: "user" }),
    });

    expect(result.current.role).toBe("user");
    expect(result.current.order?.id).toBe(1);
    expect(result.current.actualIndex).toBe(1); // confirmed + shipped
  });

  it("should return order for OWNER role", () => {
    const { result } = renderHook(() => useOrderDetails(), {
      wrapper: wrapper({ role: "owner" }),
    });

    expect(result.current.role).toBe("owner");
    expect(result.current.order?.isConfirmed).toBe(true);
    expect(result.current.actualIndex).toBe(0);
  });

  it("should return order for ADMIN role", () => {
    const { result } = renderHook(() => useOrderDetails(), {
      wrapper: wrapper({ role: "admin" }),
    });

    expect(result.current.role).toBe("admin");
    expect(result.current.order?.isDelivered).toBe(true);
    expect(result.current.actualIndex).toBe(2);
  });

  it("should handle unauthorized user", () => {
    renderHook(() => useOrderDetails(), {
      wrapper: wrapper({ role: "guest" }),
    });

    expect(toast.error).toHaveBeenCalledWith(
      "You are not authorized to view this page.",
    );
  });

  it("should return correct specialSteps structure", () => {
    const { result } = renderHook(() => useOrderDetails(), {
      wrapper: wrapper({ role: "admin" }),
    });

    expect(result.current.specialSteps).toHaveLength(3);
    expect(result.current.specialSteps[0].label).toBe("Confirmed");
    expect(result.current.specialSteps[2].label).toBe("Delivered");
  });
});
