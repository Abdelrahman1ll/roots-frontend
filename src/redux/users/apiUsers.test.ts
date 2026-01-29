import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiUsers } from "./apiUsers";
import { setupApiStore } from "../../test/setupApiStore";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

vi.mock("../auth/baseQueryWithReauth", () => ({
  baseQueryWithReauth: vi.fn().mockResolvedValue({ data: {} }),
}));

describe("ApiUsers", () => {
  let store: ReturnType<typeof setupApiStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupApiStore(ApiUsers);
  });

  it("should have the correct reducer path", () => {
    expect(ApiUsers.reducerPath).toBe("apiUsers");
  });

  it("UsersCheckEmail mutation should return the correct URL, method, and body", async () => {
    const data = { email: "test@example.com" };
    await store.dispatch(ApiUsers.endpoints.UsersCheckEmail.initiate(data));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/users/check-email",
        method: "POST",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("GetUsers query should return the correct URL and method", async () => {
    await store.dispatch(ApiUsers.endpoints.GetUsers.initiate(undefined));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/users",
        method: "GET",
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("PostUsers mutation should return the correct URL, method, and body", async () => {
    const data = { email: "test@example.com", code: 123456 };
    await store.dispatch(ApiUsers.endpoints.PostUsers.initiate(data));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/users",
        method: "POST",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });

  it("PatchUsersById mutation should return the correct URL and body", async () => {
    const data = { name: "New Name" };
    const id = "user123";
    await store.dispatch(
      ApiUsers.endpoints.PatchUsersById.initiate({ data, id }),
    );

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });
});
