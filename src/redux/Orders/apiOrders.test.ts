import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiOrders } from "./apiOrders";
import { setupApiStore } from "../../test/setupApiStore";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

vi.mock("../auth/baseQueryWithReauth", () => ({
  baseQueryWithReauth: vi.fn().mockResolvedValue({ data: {} }),
}));

describe("ApiOrders", () => {
  let store: ReturnType<typeof setupApiStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupApiStore(ApiOrders);
  });

  it("should have the correct reducer path", () => {
    expect(ApiOrders.reducerPath).toBe("apiOrders");
  });

  it("postOrders query should return the correct URL, method, and body", async () => {
    const data = { items: [] };
    await store.dispatch(ApiOrders.endpoints.postOrders.initiate(data));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/orders",
        method: "POST",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("getOwnerOrders query should return the correct URL and method", async () => {
    await store.dispatch(
      ApiOrders.endpoints.getOwnerOrders.initiate(undefined),
    );

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/orders/owner",
        method: "GET",
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("patchIsPaidOrders query should return the correct URL and method", async () => {
    const id = "123";
    await store.dispatch(ApiOrders.endpoints.patchIsPaidOrders.initiate(id));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `/orders/isPaid/${id}`,
        method: "PATCH",
      }),
      expect.any(Object),
      undefined,
    );
  });
});
