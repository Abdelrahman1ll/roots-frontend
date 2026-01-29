import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiEmailOrderDispatcher } from "./apiEmailOrderDispatcher";
import { setupApiStore } from "../../test/setupApiStore";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

vi.mock("../auth/baseQueryWithReauth", () => ({
  baseQueryWithReauth: vi.fn().mockResolvedValue({ data: {} }),
}));

describe("ApiEmailOrderDispatcher", () => {
  let store: ReturnType<typeof setupApiStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupApiStore(ApiEmailOrderDispatcher);
  });

  it("should have the correct reducer path", () => {
    expect(ApiEmailOrderDispatcher.reducerPath).toBe("apiEmailOrderDispatcher");
  });

  it("getEmailOrderDispatcher query should return the correct URL and method", async () => {
    await store.dispatch(
      ApiEmailOrderDispatcher.endpoints.getEmailOrderDispatcher.initiate(
        undefined,
      ),
    );

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/email-order-dispatcher",
        method: "GET",
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("postEmailOrderDispatcher mutation should return the correct URL, method, and body", async () => {
    const data = { email: "test@example.com" };
    await store.dispatch(
      ApiEmailOrderDispatcher.endpoints.postEmailOrderDispatcher.initiate(data),
    );

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/email-order-dispatcher",
        method: "POST",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("patchEmailOrderDispatcher mutation should return the correct URL, method, and body", async () => {
    const data = { active: false };
    const id = "789";
    await store.dispatch(
      ApiEmailOrderDispatcher.endpoints.patchEmailOrderDispatcher.initiate({
        data,
        id,
      }),
    );

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `/email-order-dispatcher/${id}`,
        method: "PATCH",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("deleteEmailOrderDispatcher mutation should return the correct URL and method", async () => {
    const id = "789";
    await store.dispatch(
      ApiEmailOrderDispatcher.endpoints.deleteEmailOrderDispatcher.initiate(id),
    );

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `/email-order-dispatcher/${id}`,
        method: "DELETE",
      }),
      expect.any(Object),
      undefined,
    );
  });
});
