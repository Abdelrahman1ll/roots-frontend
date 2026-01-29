import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useSignup from "./useSignup";
import * as apiUsers from "../../redux/users/apiUsers";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import React from "react";

vi.mock("../../redux/users/apiUsers");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useSignup Hook", () => {
  const mockSetUser = vi.fn();
  const mockOnClose = vi.fn();
  const mockCheckEmail = vi.fn();
  const mockPostUser = vi.fn();
  const mockUnwrap = vi.fn();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider value={{ user: null, setUser: mockSetUser, logout: vi.fn(), initializing: false }}>
      {children}
    </AuthContext.Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    mockCheckEmail.mockReturnValue({ unwrap: mockUnwrap });
    mockPostUser.mockReturnValue({ unwrap: mockUnwrap });

    vi.mocked(apiUsers.useUsersCheckEmailMutation).mockReturnValue([
      mockCheckEmail,
      { isLoading: false },
    ] as any);

    vi.mocked(apiUsers.usePostUsersMutation).mockReturnValue([
      mockPostUser,
      { isLoading: false },
    ] as any);

    // Mock localStorage
    const store: Record<string, string> = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] || null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { store[key] = value; });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => { delete store[key]; });
  });

  it("handles initial state", () => {
    const { result } = renderHook(() => useSignup(mockOnClose), { wrapper });
    expect(result.current.email).toBe("");
    expect(result.current.showCodeInput).toBe(false);
    expect(result.current.code).toEqual(["", "", "", "", "", ""]);
  });

  it("handles email signup (check email)", async () => {
    const { result } = renderHook(() => useSignup(mockOnClose), { wrapper });
    mockUnwrap.mockResolvedValue({ success: true });

    act(() => {
      result.current.setEmail("test@example.com");
    });

    await act(async () => {
      await result.current.handleSignup({ preventDefault: vi.fn() } as any);
    });

    expect(mockCheckEmail).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(result.current.showCodeInput).toBe(true);
    expect(localStorage.getItem("email")).toBe("test@example.com");
  });

  it("handles OTP code changes", () => {
    const { result } = renderHook(() => useSignup(mockOnClose), { wrapper });
    
    act(() => {
      result.current.handleChange({ target: { value: "1" } } as any, 0);
    });

    expect(result.current.code[0]).toBe("1");
  });

  it("verifies OTP and completes signup", async () => {
    const { result } = renderHook(() => useSignup(mockOnClose), { wrapper });
    localStorage.setItem("email", "test@example.com");
    mockUnwrap.mockResolvedValue({ id: 1, email: "test@example.com" });

    act(() => {
      // Simulate filling the code
      result.current.handleChange({ target: { value: "123456" } } as any, 0);
    });

    await act(async () => {
      await result.current.handleVerifyCode({ preventDefault: vi.fn() } as any);
    });

    expect(mockPostUser).toHaveBeenCalledWith({
      email: "test@example.com",
      code: 123456,
    });
    expect(mockSetUser).toHaveBeenCalledWith({ id: 1, email: "test@example.com" });
    expect(toast.success).toHaveBeenCalledWith("Signup successfully");
    expect(mockOnClose).toHaveBeenCalled();
    expect(localStorage.getItem("email")).toBeNull();
  });

  it("handles invalid OTP code", async () => {
    const { result } = renderHook(() => useSignup(mockOnClose), { wrapper });
    
    act(() => {
      result.current.handleChange({ target: { value: "12" } } as any, 0);
    });

    await act(async () => {
      await result.current.handleVerifyCode({ preventDefault: vi.fn() } as any);
    });

    expect(toast.error).toHaveBeenCalledWith("Invalid code");
    expect(mockPostUser).not.toHaveBeenCalled();
  });
});
