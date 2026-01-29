import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useProfile from "./useProfile";
import { AuthContext } from "../../context/AuthContext";
import * as apiUsers from "../../redux/users/apiUsers";
import * as apiDiscountCodes from "../../redux/DiscountCodes/apiDiscountCodes";
import { toast } from "react-toastify";
import React from "react";

vi.mock("../../redux/users/apiUsers");
vi.mock("../../redux/DiscountCodes/apiDiscountCodes");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useProfile Hook", () => {
  const mockUser = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "01012345678",
    birthday: "1990-01-01",
    PROFILE: false,
  };

  const mockSetUser = vi.fn();
  const mockPatchUsers = vi.fn();
  const mockValidateDiscountCode = vi.fn();
  const mockUnwrap = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockPatchUsers.mockReturnValue({ unwrap: mockUnwrap });
    mockValidateDiscountCode.mockReturnValue({ unwrap: mockUnwrap });

    vi.mocked(apiUsers.usePatchUsersByIdMutation).mockReturnValue([
      mockPatchUsers,
      { isLoading: false },
    ] as any);

    vi.mocked(
      apiDiscountCodes.usePostValidateDiscountCodeMutation,
    ).mockReturnValue([mockValidateDiscountCode, { isLoading: false }] as any);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthContext.Provider
      value={{
        user: mockUser as any,
        setUser: mockSetUser,
        logout: vi.fn(),
        initializing: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

  it("initializes with user data from AuthContext", () => {
    const { result } = renderHook(() => useProfile(), { wrapper });
    expect(result.current.userData.firstName).toBe("John");
    expect(result.current.userData.email).toBe("john@example.com");
  });

  it("updates progress based on filled fields", async () => {
    const { result } = renderHook(() => useProfile(), { wrapper });

    // Initial progress with mockUser (all fields filled)
    // progress = 20 + 4*20 = 100
    expect(result.current.progress).toBe(100);

    act(() => {
      result.current.handleChange({
        target: { name: "firstName", value: "" },
      } as any);
    });

    await waitFor(() => {
      expect(result.current.progress).toBe(80);
    });
  });

  it("handles Reward Logic when profile is complete", async () => {
    const completeUser = { ...mockUser, PROFILE: true };
    const completeWrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider
        value={{
          user: completeUser as any,
          setUser: mockSetUser,
          logout: vi.fn(),
          initializing: false,
        }}
      >
        {children}
      </AuthContext.Provider>
    );

    mockUnwrap.mockResolvedValue({
      discountCode: { code: "PROFILE", discount: 10 },
    });

    const { result } = renderHook(() => useProfile(), {
      wrapper: completeWrapper,
    });

    await waitFor(() => {
      expect(mockValidateDiscountCode).toHaveBeenCalledWith({
        code: "PROFILE",
      });
      expect(result.current.rewardVisible).toBe(true);
      expect(result.current.reward.code).toBe("PROFILE");
    });
  });

  it("validates first name and last name length", async () => {
    const { result } = renderHook(() => useProfile(), { wrapper });

    act(() => {
      result.current.handleChange({
        target: { name: "firstName", value: "A" },
      } as any);
      result.current.handleChange({
        target: { name: "lastName", value: "B" },
      } as any);
    });

    await act(async () => {
      await result.current.handleSave({ preventDefault: vi.fn() } as any);
    });

    expect(result.current.errors.firstName).toContain(
      "between 2 and 50 characters",
    );
    expect(result.current.errors.lastName).toContain(
      "between 2 and 50 characters",
    );
  });

  it("validates Egyptian phone number", async () => {
    const { result } = renderHook(() => useProfile(), { wrapper });

    act(() => {
      result.current.handleChange({
        target: { name: "phone", value: "123456" },
      } as any);
    });

    await act(async () => {
      await result.current.handleSave({ preventDefault: vi.fn() } as any);
    });

    expect(result.current.errors.phone).toBe(
      "Phone number must be 11 valid digits",
    );
  });

  it("validates birthday (minimum age 10)", async () => {
    const { result } = renderHook(() => useProfile(), { wrapper });
    const tooYoung = new Date();
    tooYoung.setFullYear(tooYoung.getFullYear() - 5);

    act(() => {
      result.current.handleChange({
        target: {
          name: "birthday",
          value: tooYoung.toISOString().split("T")[0],
        },
      } as any);
    });

    await act(async () => {
      await result.current.handleSave({ preventDefault: vi.fn() } as any);
    });

    expect(result.current.errors.birthday).toBe(
      "Birthday indicates an age below the allowed minimum",
    );
  });

  it("submits the form successfully", async () => {
    const { result } = renderHook(() => useProfile(), { wrapper });
    mockUnwrap.mockResolvedValue({});

    await act(async () => {
      await result.current.handleSave({ preventDefault: vi.fn() } as any);
    });

    expect(mockPatchUsers).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Profile saved successfully");
    expect(mockSetUser).toHaveBeenCalled();
  });

  it("handles submission error", async () => {
    const { result } = renderHook(() => useProfile(), { wrapper });
    mockUnwrap.mockRejectedValue({ data: { message: "API Error" } });

    await act(async () => {
      await result.current.handleSave({ preventDefault: vi.fn() } as any);
    });

    expect(toast.error).toHaveBeenCalledWith("API Error");
  });
});
