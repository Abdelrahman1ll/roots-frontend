import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiDelivery } from "./apiDelivery";
import { setupApiStore } from "../../test/setupApiStore";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

vi.mock("../auth/baseQueryWithReauth", () => ({
  baseQueryWithReauth: vi.fn().mockResolvedValue({ data: {} }),
}));

describe("ApiDelivery", () => {
  let store: ReturnType<typeof setupApiStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupApiStore(ApiDelivery);
  });

  it("should have the correct reducer path", () => {
    expect(ApiDelivery.reducerPath).toBe("apiDelivery");
  });

  it("getDelivery query should return the correct URL", async () => {
    await store.dispatch(ApiDelivery.endpoints.getDelivery.initiate(undefined));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      "/delivery",
      expect.any(Object),
      undefined,
    );
  });

  it("postDelivery mutation should return the correct URL, method, and body", async () => {
    const data = { price: 50 };
    await store.dispatch(ApiDelivery.endpoints.postDelivery.initiate(data));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/delivery",
        method: "POST",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("postFreeDelivery mutation should return the correct URL and method", async () => {
    await store.dispatch(
      ApiDelivery.endpoints.postFreeDelivery.initiate(undefined),
    );

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/delivery/free-delivery",
        method: "POST",
      }),
      expect.any(Object),
      undefined,
    );
  });
});
