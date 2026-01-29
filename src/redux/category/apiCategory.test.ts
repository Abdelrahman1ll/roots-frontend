import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiCategory } from "./apiCategory";
import { setupApiStore } from "../../test/setupApiStore";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

vi.mock("../auth/baseQueryWithReauth", () => ({
  baseQueryWithReauth: vi.fn().mockResolvedValue({ data: {} }),
}));

describe("ApiCategory", () => {
  let store: ReturnType<typeof setupApiStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupApiStore(ApiCategory);
  });

  it("getCategory should call /category", async () => {
    await store.dispatch(ApiCategory.endpoints.getCategory.initiate(undefined));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      "/category",
      expect.any(Object),
      undefined,
    );
  });

  it("deleteCategory should DELETE /category/:id", async () => {
    const id = "456";

    await store.dispatch(ApiCategory.endpoints.deleteCategory.initiate(id));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      expect.any(Object),
      undefined,
    );
  });
});
