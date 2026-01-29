import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiColor } from "./apiColor";
import { setupApiStore } from "../../test/setupApiStore";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

vi.mock("../auth/baseQueryWithReauth", () => ({
  baseQueryWithReauth: vi.fn().mockResolvedValue({ data: {} }),
}));

describe("ApiColor", () => {
  let store: ReturnType<typeof setupApiStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupApiStore(ApiColor);
  });

  it("should have the correct reducer path", () => {
    expect(ApiColor.reducerPath).toBe("apiColor");
  });

  it("getColors query should return the correct URL", async () => {
    await store.dispatch(ApiColor.endpoints.getColors.initiate(undefined));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      "/color",
      expect.any(Object),
      undefined,
    );
  });

  it("postColor query should return the correct method and body", async () => {
    const data = { name: "Red", hex: "#FF0000" };
    await store.dispatch(ApiColor.endpoints.postColor.initiate(data));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/color",
        method: "POST",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("patchColor query should return the correct URL, method and body", async () => {
    const data = { name: "Blue" };
    const id = "123";
    await store.dispatch(ApiColor.endpoints.patchColor.initiate({ data, id }));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `/color/${id}`,
        method: "PATCH",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("deleteColor query should return the correct URL and method", async () => {
    const id = "123";
    await store.dispatch(ApiColor.endpoints.deleteColor.initiate(id));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `/color/${id}`,
        method: "DELETE",
      }),
      expect.any(Object),
      undefined,
    );
  });
});
