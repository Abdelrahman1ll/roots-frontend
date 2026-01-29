import { describe, it, expect, vi, beforeEach } from "vitest";
import { paymentApi } from "./apiPayment";
import { setupApiStore } from "../../test/setupApiStore";
import { baseQueryWithReauth } from "../auth/baseQueryWithReauth";

vi.mock("../auth/baseQueryWithReauth", () => ({
  baseQueryWithReauth: vi.fn().mockResolvedValue({ data: {} }),
}));

describe("paymentApi", () => {
  let store: ReturnType<typeof setupApiStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupApiStore(paymentApi);
  });

  it("should have the correct reducer path", () => {
    expect(paymentApi.reducerPath).toBe("paymentApi");
  });

  it("postPayment mutation should return the correct URL, method, and body", async () => {
    const data = { amount: 100, currency: "USD" };
    await store.dispatch(paymentApi.endpoints.postPayment.initiate(data));

    expect(baseQueryWithReauth).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/payment/init-payment",
        method: "POST",
        body: data,
      }),
      expect.any(Object),
      undefined,
    );
  });
});
