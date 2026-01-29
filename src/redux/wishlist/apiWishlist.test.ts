import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiWishlist } from "./apiWishlist";
import { setupApiStore } from "../../test/setupApiStore";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

vi.mock("../auth/baseQueryWithReauth", () => ({
  baseQueryWithReauth: vi.fn().mockResolvedValue({ data: {} }),
}));

describe("ApiWishlist", () => {
  let store: ReturnType<typeof setupApiStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupApiStore(ApiWishlist);
  });

  it("should have the correct reducer path", () => {
    expect(ApiWishlist.reducerPath).toBe("apiWishlist");
  });

  it("getWishlist query should return the correct URL and method", async () => {
    await store.dispatch(ApiWishlist.endpoints.getWishlist.initiate(undefined));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/wishlist/user",
        method: "GET",
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("postWishlist mutation should return the correct URL, method, and body", async () => {
    const data = { productId: "123" };
    await store.dispatch(ApiWishlist.endpoints.postWishlist.initiate(data));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/wishlist",
        method: "POST",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("deleteWishlist mutation should return the correct URL and method", async () => {
    const id = "123";
    await store.dispatch(ApiWishlist.endpoints.deleteWishlist.initiate(id));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `/wishlist/${id}`,
        method: "DELETE",
      }),
      expect.any(Object),
      undefined,
    );
  });
});
