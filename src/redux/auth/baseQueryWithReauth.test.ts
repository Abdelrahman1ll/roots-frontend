import { describe, it, expect, vi, beforeEach } from "vitest";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import { baseQueryWithReauth } from "./baseQueryWithReauth";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";

/* ------------------------------------------------------------------ */
/*                               Mocks                                */
/* ------------------------------------------------------------------ */

vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

vi.mock("crypto-js", () => ({
  default: {
    AES: {
      decrypt: vi.fn(),
      encrypt: vi.fn(),
    },
    enc: {
      Utf8: "utf8",
    },
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("../../api/baseUrl", () => ({
  default: "http://api.test",
}));

/* Mock fetchBaseQuery */
const { mockBaseQuery } = vi.hoisted(() => ({
  mockBaseQuery: vi.fn(),
}));

vi.mock("@reduxjs/toolkit/query/react", async () => {
  const actual = await vi.importActual<
    typeof import("@reduxjs/toolkit/query/react")
  >("@reduxjs/toolkit/query/react");

  return {
    ...actual,
    fetchBaseQuery: () => mockBaseQuery,
  };
});

/* ------------------------------------------------------------------ */
/*                               Helpers                              */
/* ------------------------------------------------------------------ */

const mockUser = {
  accessToken: "old-token",
  refreshToken: "refresh-token",
};

const encryptMock = (user: object) => JSON.stringify(user);

const decryptMock = (user: object) => ({
  toString: vi.fn(() => JSON.stringify(user)),
});

/* ------------------------------------------------------------------ */
/*                                Tests                               */
/* ------------------------------------------------------------------ */

describe("baseQueryWithReauth", () => {
  const api = { signal: {} as AbortSignal } as unknown as any;
  const extraOptions = {};

  beforeEach(() => {
    vi.clearAllMocks();

    (import.meta as unknown as { env: Record<string, string> }).env = {
      VITE_SECRET_KEY: "test-secret",
      VITE_NODE_ENV: "development",
    };
  });

  /* --------------------------------------------------------------- */
  /* 1️⃣ Success without 401                                        */
  /* --------------------------------------------------------------- */

  it("returns result directly when request succeeds", async () => {
    mockBaseQuery.mockResolvedValueOnce({ data: "success" });

    const result = await baseQueryWithReauth(
      "test" as unknown as FetchArgs,
      api,
      extraOptions,
    );

    expect(result).toEqual({ data: "success" });
    expect(mockBaseQuery).toHaveBeenCalledOnce();
  });

  /* --------------------------------------------------------------- */
  /* 2️⃣ 401 + refresh fails                                        */
  /* --------------------------------------------------------------- */

  it("shows error when refresh token request fails", async () => {
    vi.mocked(Cookies.get as (name: string) => string).mockReturnValue(
      encryptMock(mockUser),
    );
    vi.mocked(CryptoJS.AES.decrypt).mockReturnValue(
      decryptMock(mockUser) as unknown as ReturnType<
        typeof CryptoJS.AES.decrypt
      >,
    );

    mockBaseQuery
      .mockResolvedValueOnce({ error: { status: 401 } }) // original request
      .mockRejectedValueOnce(new Error("refresh failed")); // refresh request

    const result = await baseQueryWithReauth(
      "test" as unknown as FetchArgs,
      api,
      extraOptions,
    );

    expect(toast.error).toHaveBeenCalledWith(
      "Session expired. Please login again.",
    );
    expect(result).toEqual({ error: { status: 401 } });
  });

  /* --------------------------------------------------------------- */
  /* 3️⃣ 401 + refresh succeeds                                    */
  /* --------------------------------------------------------------- */

  it("refreshes token and retries original request", async () => {
    const newAccessToken = "new-token";

    vi.mocked(Cookies.get as (name: string) => string).mockReturnValue(
      encryptMock(mockUser),
    );

    vi.mocked(CryptoJS.AES.decrypt).mockReturnValue(
      decryptMock(mockUser) as unknown as ReturnType<
        typeof CryptoJS.AES.decrypt
      >,
    );

    vi.mocked(CryptoJS.AES.encrypt).mockReturnValue({
      toString: () => "new-encrypted-user",
    } as unknown as ReturnType<typeof CryptoJS.AES.encrypt>);

    mockBaseQuery
      // original request → 401
      .mockResolvedValueOnce({ error: { status: 401 } })
      // refresh token request
      .mockResolvedValueOnce({
        data: { accessToken: newAccessToken },
      })
      // retry original request
      .mockResolvedValueOnce({ data: "success-after-refresh" });

    const result = await baseQueryWithReauth(
      "test" as unknown as FetchArgs,
      api,
      extraOptions,
    );

    expect(mockBaseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/auth/refresh",
        method: "POST",
        body: { refreshToken: mockUser.refreshToken },
      }),
      api,
      extraOptions,
    );

    expect(Cookies.set).toHaveBeenCalled();
    expect(result).toEqual({ data: "success-after-refresh" });
  });
});
