import React from "react";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useHeader from "./useHeader";
import { AuthContext } from "../../context/AuthContext";
import { SignupContext } from "../../context/SignupContext";
import { useGetCartQuery } from "../../redux/Cart/apiCart";

/* ================= MOCKS ================= */

// ---------- React Router ----------
const navigateMock = vi.fn();
let searchParamsState = new URLSearchParams();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useSearchParams: () => [
      searchParamsState,
      vi.fn((params: URLSearchParams) => {
        searchParamsState = params;
      }),
    ],
  };
});

// ---------- RTK Query ----------
const refetchCartMock = vi.fn();

vi.mock("../../redux/Cart/apiCart", () => ({
  useGetCartQuery: vi.fn(() => ({
    data: undefined,
    refetch: refetchCartMock,
  })),
}));

/* ================= WRAPPER ================= */

const wrapper =
  (
    authValue: any,
    signupValue: any = { isVerify: false, setIsVerify: vi.fn() },
  ) =>
  ({ children }: { children: React.ReactNode }) => {
    return (
      <AuthContext.Provider value={authValue}>
        <SignupContext.Provider value={signupValue}>
          {children}
        </SignupContext.Provider>
      </AuthContext.Provider>
    );
  };

/* ================= TESTS ================= */

describe("useHeader hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGetCartQuery).mockReturnValue({
      data: undefined,
      refetch: refetchCartMock,
    } as any);
    searchParamsState = new URLSearchParams();
    localStorage.clear();
  });

  it("initializes with default values", () => {
    const { result } = renderHook(() => useHeader(), {
      wrapper: wrapper({ user: null, logout: vi.fn() }),
    });

    expect(result.current.isMenuOpen).toBe(false);
    expect(result.current.isSearch).toBe(false);
    expect(result.current.isOpen).toBe(false);
    expect(result.current.selected.name).toBe("Egypt");
    expect(result.current.totalItems).toBe(0);
  });

  it("reads isSearch from localStorage", () => {
    localStorage.setItem("isSearch", "true");

    const { result } = renderHook(() => useHeader(), {
      wrapper: wrapper({ user: null, logout: vi.fn() }),
    });

    expect(result.current.isSearchLocal).toBe(true);
  });

  it("syncs nameInput with URL search param", () => {
    searchParamsState.set("name", "iphone");

    const { result } = renderHook(() => useHeader(), {
      wrapper: wrapper({ user: null, logout: vi.fn() }),
    });

    expect(result.current.nameInput).toBe("iphone");
  });

  it("updates URL when nameInput changes (debounced)", async () => {
    const { result } = renderHook(() => useHeader(), {
      wrapper: wrapper({ user: null, logout: vi.fn() }),
    });

    act(() => {
      result.current.setNameInput("samsung");
    });

    await new Promise((r) => setTimeout(r, 600));

    expect(searchParamsState.get("name")).toBe("samsung");
  });

  it("toggles country dropdown", () => {
    const { result } = renderHook(() => useHeader(), {
      wrapper: wrapper({ user: null, logout: vi.fn() }),
    });

    act(() => {
      result.current.toggleCountryDropdown();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("calculates cart items when user role is user", () => {
    vi.mocked(useGetCartQuery).mockReturnValue({
      data: {
        carts: {
          items: [{ id: 1 }, { id: 2 }],
        },
      } as any,
      refetch: refetchCartMock,
    } as any);

    const { result } = renderHook(() => useHeader(), {
      wrapper: wrapper({
        user: { role: "user" },
        logout: vi.fn(),
      }),
    });

    expect(result.current.totalItems).toBe(2);
    expect(refetchCartMock).toHaveBeenCalled();
  });

  it("does not fetch cart when user is not a user", () => {
    const { result } = renderHook(() => useHeader(), {
      wrapper: wrapper({
        user: { role: "admin" },
        logout: vi.fn(),
      }),
    });

    expect(result.current.totalItems).toBe(0);
    expect(refetchCartMock).not.toHaveBeenCalled();
  });

  it("exposes logout function from AuthContext", () => {
    const logoutMock = vi.fn();

    const { result } = renderHook(() => useHeader(), {
      wrapper: wrapper({
        user: { role: "user" },
        logout: logoutMock,
      }),
    });

    act(() => {
      result.current.handleLogout();
    });

    expect(logoutMock).toHaveBeenCalled();
  });
});
