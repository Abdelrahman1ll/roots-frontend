import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiDiscountCodes } from "./apiDiscountCodes";
import { setupApiStore } from "../../test/setupApiStore";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

vi.mock("../auth/baseQueryWithReauth", () => ({
  baseQueryWithReauth: vi.fn().mockResolvedValue({ data: {} }),
}));

describe("ApiDiscountCodes", () => {
  let store: ReturnType<typeof setupApiStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupApiStore(ApiDiscountCodes);
  });

  it("should have the correct reducer path", () => {
    expect(ApiDiscountCodes.reducerPath).toBe("apiDiscountCodes");
  });

  it("GetDiscountCodes query should return the correct URL and method", async () => {
    await store.dispatch(
      ApiDiscountCodes.endpoints.GetDiscountCodes.initiate(undefined),
    );

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/discount-codes",
        method: "GET",
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("PostValidateDiscountCode query should return the correct URL, method, and body", async () => {
    const data = { code: "SAVE10" };
    await store.dispatch(
      ApiDiscountCodes.endpoints.PostValidateDiscountCode.initiate(data),
    );

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/discount-codes/user",
        method: "POST",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("PostDiscountCodes query should return the correct URL, method, and body", async () => {
    const data = { code: "NEW20", discount: 20 };
    await store.dispatch(
      ApiDiscountCodes.endpoints.PostDiscountCodes.initiate(data),
    );

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/discount-codes",
        method: "POST",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("PatchDiscountCodes query should return the correct URL, method, and body", async () => {
    const data = { discount: 20 };
    const id = "456";
    await store.dispatch(
      ApiDiscountCodes.endpoints.PatchDiscountCodes.initiate({ data, id }),
    );

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `/discount-codes/${id}`,
        method: "PATCH",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("DeleteDiscountCodes query should return the correct URL and method", async () => {
    const id = "456";
    await store.dispatch(
      ApiDiscountCodes.endpoints.DeleteDiscountCodes.initiate(id),
    );

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `/discount-codes/${id}`,
        method: "DELETE",
      }),
      expect.any(Object),
      undefined,
    );
  });
});
