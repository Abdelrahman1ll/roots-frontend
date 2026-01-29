import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Profile from "./profile";
import useProfile from "./useProfile";
import "@testing-library/jest-dom";

// Mock the custom hook
vi.mock("./useProfile", () => ({
  default: vi.fn(),
}));

// Mock framer-motion
// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock Lucide Icons
vi.mock("lucide-react", () => ({
  Gift: () => <svg />,
  User: () => <svg />,
  Mail: () => <svg />,
  Phone: () => <svg />,
  Calendar: () => <svg />,
  BadgeCheck: () => <svg />,
}));

describe("Profile Component", () => {
  const mockHandleChange = vi.fn();
  const mockHandleSave = vi.fn((e) => e.preventDefault());

  const mockUseProfileValues = {
    userData: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "01012345678",
      birthday: "1990-01-01T00:00:00Z",
    },
    handleChange: mockHandleChange,
    handleSave: mockHandleSave,
    progress: 80,
    errors: {
      firstName: "",
      lastName: "",
      phone: "",
      birthday: "",
    },
    isLoading: false,
    rewardVisible: false,
    reward: { code: "PROFILE", discount: 20 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useProfile).mockReturnValue(
      mockUseProfileValues as unknown as ReturnType<typeof useProfile>,
    );
  });

  it("renders profile header and name", () => {
    render(<Profile />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders progress bar with correct percentage", () => {
    render(<Profile />);
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("displays 'Reward Unlocked!' when rewardVisible is true", () => {
    vi.mocked(useProfile).mockReturnValue({
      ...mockUseProfileValues,
      rewardVisible: true,
    } as unknown as ReturnType<typeof useProfile>);
    render(<Profile />);
    expect(screen.getByText("Reward Unlocked!")).toBeInTheDocument();
    expect(screen.getByText(/20% discount/i)).toBeInTheDocument();
    expect(screen.getByText("PROFILE")).toBeInTheDocument();
  });

  it("displays validation errors", () => {
    vi.mocked(useProfile).mockReturnValue({
      ...mockUseProfileValues,
      errors: {
        ...mockUseProfileValues.errors,
        phone: "Phone number must be 11 valid digits",
      },
    } as unknown as ReturnType<typeof useProfile>);
    render(<Profile />);
    expect(
      screen.getByText("Phone number must be 11 valid digits"),
    ).toBeInTheDocument();
  });

  it("calls handleChange when input fields are changed", () => {
    render(<Profile />);
    const firstNameInput = screen.getByPlaceholderText("John");
    fireEvent.change(firstNameInput, {
      target: { value: "Jane", name: "firstName" },
    });
    expect(mockHandleChange).toHaveBeenCalled();
  });

  it("calls handleSave on form submission", () => {
    render(<Profile />);
    const saveButton = screen.getByRole("button", { name: /Save Changes/i });
    fireEvent.click(saveButton);
    expect(mockHandleSave).toHaveBeenCalled();
  });

  it("disables save button and shows loading spinner when isLoading is true", () => {
    vi.mocked(useProfile).mockReturnValue({
      ...mockUseProfileValues,
      isLoading: true,
    } as unknown as ReturnType<typeof useProfile>);
    render(<Profile />);
    const saveButton = screen.getByRole("button");
    expect(saveButton).toBeDisabled();
  });
});
