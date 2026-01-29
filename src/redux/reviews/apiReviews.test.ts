import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiReviews } from "./apiReviews";
import { setupApiStore } from "../../test/setupApiStore";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

vi.mock("../auth/baseQueryWithReauth", () => ({
  baseQueryWithReauth: vi.fn().mockResolvedValue({ data: {} }),
}));

describe("ApiReviews", () => {
  let store: ReturnType<typeof setupApiStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupApiStore(ApiReviews);
  });

  it("should have the correct reducer path", () => {
    expect(ApiReviews.reducerPath).toBe("apiReviews");
  });

  it("getReviews query should return the correct URL and method", async () => {
    const id = "prod123";
    await store.dispatch(ApiReviews.endpoints.getReviews.initiate(id));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `/reviews/${id}`,
        method: "GET",
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("postReviews mutation should return the correct URL, method, and body", async () => {
    const data = { comment: "Great!", rating: 5 };
    await store.dispatch(ApiReviews.endpoints.postReviews.initiate(data));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/reviews",
        method: "POST",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("patchReviews mutation should return the correct URL and body", async () => {
    const data = { comment: "Updated!" };
    const id = "rev123";
    await store.dispatch(
      ApiReviews.endpoints.patchReviews.initiate({ data, id }),
    );

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `/reviews/${id}`,
        method: "PATCH",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("deleteReviews mutation should return the correct URL and method", async () => {
    const id = "rev123";
    await store.dispatch(ApiReviews.endpoints.deleteReviews.initiate(id));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      expect.any(Object),
      undefined,
    );
  });
});
