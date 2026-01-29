import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiProducts } from "./apiProducts";
import { setupApiStore } from "../../test/setupApiStore";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

vi.mock("../auth/baseQueryWithReauth", () => ({
  baseQueryWithReauth: vi.fn().mockResolvedValue({ data: {} }),
}));

describe("ApiProducts", () => {
  let store: ReturnType<typeof setupApiStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupApiStore(ApiProducts);
  });

  it("should have the correct reducer path", () => {
    expect(ApiProducts.reducerPath).toBe("apiProducts");
  });

  it("GetProducts query should return the correct URL", async () => {
    const url = "/products?category=1";
    await store.dispatch(ApiProducts.endpoints.GetProducts.initiate(url));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url,
        method: "GET",
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("GetProductId query should return the correct URL and method", async () => {
    const id = "prod123";
    await store.dispatch(ApiProducts.endpoints.GetProductId.initiate(id));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `/products/${id}`,
        method: "GET",
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("PostProduct mutation should return the correct URL, method and body", async () => {
    const data = { name: "New Product" };
    await store.dispatch(ApiProducts.endpoints.PostProduct.initiate(data));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/products",
        method: "POST",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });
});
