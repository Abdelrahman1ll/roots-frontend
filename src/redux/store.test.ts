import { describe, it, expect } from "vitest";
import { store } from "./store";

describe("Redux Store", () => {
  it("should be configured with the correct reducers", () => {
    const state = store.getState();
    expect(state.apiUsers).toBeDefined();
    expect(state.apiProducts).toBeDefined();
    expect(state.apiReviews).toBeDefined();
    expect(state.apiWishlist).toBeDefined();
    expect(state.apiDiscountCodes).toBeDefined();
    expect(state.apiDelivery).toBeDefined();
    expect(state.apiCart).toBeDefined();
    expect(state.apiEmailOrderDispatcher).toBeDefined();
    expect(state.apiEmail).toBeDefined();
    expect(state.apiOrders).toBeDefined();
    expect(state.paymentApi).toBeDefined();
    expect(state.apiCategory).toBeDefined();
    expect(state.apiColor).toBeDefined();
  });
});
