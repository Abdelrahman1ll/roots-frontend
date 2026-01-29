import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import useOrderProgress from "./useOrderProgress";
import type { OrderType } from "../../types/OrderType";

/* =======================
   🔹 Mock RTK Mutations
======================= */
const patchIsPaidMock = vi.fn();
const patchIsConfirmedMock = vi.fn();
const patchIsShippedMock = vi.fn();
const patchIsDeliveredMock = vi.fn();
const patchIsCanceledMock = vi.fn();

vi.mock("../../redux/Orders/apiOrders", () => ({
  usePatchIsPaidOrdersMutation: () => [patchIsPaidMock],
  usePatchIsConfirmedOrdersMutation: () => [patchIsConfirmedMock],
  usePatchIsShippedOrdersMutation: () => [patchIsShippedMock],
  usePatchIsDeliveredOrdersMutation: () => [patchIsDeliveredMock],
  usePatchIsCanceledOrdersMutation: () => [patchIsCanceledMock],
}));

/* =======================
   🧪 Tests
======================= */
describe("useOrderProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseOrder: OrderType = {
    id: 1,
    isPaid: false,
    isConfirmed: false,
    isShipped: false,
    isDelivered: false,
    isCanceled: false,
  } as OrderType;

  it("should initialize states from order", () => {
    const { result } = renderHook(() =>
      useOrderProgress({
        order: {
          ...baseOrder,
          isPaid: true,
          isConfirmed: true,
        },
      }),
    );

    expect(result.current.isPaid).toBe(true);
    expect(result.current.isConfirmed).toBe(true);
    expect(result.current.isShipped).toBe(false);
    expect(result.current.isDelivered).toBe(false);
    expect(result.current.isCanceled).toBe(false);
  });

  it("should update states when order changes", () => {
    const { result, rerender } = renderHook(
      ({ order }) => useOrderProgress({ order }),
      {
        initialProps: {
          order: baseOrder,
        },
      },
    );

    expect(result.current.isPaid).toBe(false);

    rerender({
      order: {
        ...baseOrder,
        isPaid: true,
        isShipped: true,
      },
    });

    expect(result.current.isPaid).toBe(true);
    expect(result.current.isShipped).toBe(true);
  });
});
