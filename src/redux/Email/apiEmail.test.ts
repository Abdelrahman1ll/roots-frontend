import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiEmail } from "./apiEmail";
import { setupApiStore } from "../../test/setupApiStore";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

vi.mock("../auth/baseQueryWithReauth", () => ({
  baseQueryWithReauth: vi.fn().mockResolvedValue({ data: {} }),
}));

describe("ApiEmail", () => {
  let store: ReturnType<typeof setupApiStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupApiStore(ApiEmail);
  });

  it("should have the correct reducer path", () => {
    expect(ApiEmail.reducerPath).toBe("apiEmail");
  });

  it("sendEmail mutation should return the correct URL, method, and body", async () => {
    const data = { to: "test@example.com", subject: "Hello", body: "World" };
    await store.dispatch(ApiEmail.endpoints.sendEmail.initiate(data));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/email",
        method: "POST",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });
});
