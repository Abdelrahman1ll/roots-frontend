import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiCart } from "./apiCart";
import { setupApiStore } from "../../test/setupApiStore";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

vi.mock("../auth/baseQueryWithReauth", () => ({
  baseQueryWithReauth: vi.fn().mockResolvedValue({ data: {} }),
}));

describe("ApiCart", () => {
  let store: ReturnType<typeof setupApiStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupApiStore(ApiCart);
  });

  it("should have correct reducerPath", () => {
    expect(ApiCart.reducerPath).toBe("apiCart");
  });

  it("getCart should call /carts", async () => {
    await store.dispatch(ApiCart.endpoints.getCart.initiate(undefined));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      "/carts",
      expect.any(Object),
      undefined,
    );
  });

  it("postCart should POST /carts", async () => {
    const payload = { productId: "1", quantity: 2 };

    await store.dispatch(ApiCart.endpoints.postCart.initiate(payload));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/carts",
        method: "POST",
        body: payload,
      }),
      expect.any(Object),
      undefined,
    );
  });
});
