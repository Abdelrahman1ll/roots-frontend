import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import EditUserOwner from "./EditUserOwner";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as apiUsers from "../../redux/users/apiUsers";
import "@testing-library/jest-dom";

// Mock hooks
vi.mock("../../redux/users/apiUsers", () => ({
  useGetUsersQuery: vi.fn(),
  usePatchUsersOwnerByIdMutation: vi.fn(),
}));

// Mock toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    button: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("EditUserOwner Component", () => {
  const mockPatchUsersOwnerById = vi.fn();
  const mockUser = {
    id: 123,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "01234567890",
    birthday: "1990-01-01T00:00:00.000Z",
    role: "user",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (apiUsers.useGetUsersQuery as Mock).mockReturnValue({
      data: { users: [mockUser] },
      isLoading: false,
    });
    (apiUsers.usePatchUsersOwnerByIdMutation as Mock).mockReturnValue([
      mockPatchUsersOwnerById,
      { isLoading: false },
    ]);
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={["/edit-user-owner/123"]}>
        <Routes>
          <Route path="/edit-user-owner/:id" element={<EditUserOwner />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it("renders loading spinner when loading", () => {
    (apiUsers.useGetUsersQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    const { container } = renderComponent();
    // Check for spinner logic roughly
    expect(
      container.getElementsByClassName("animate-spin").length,
    ).toBeGreaterThan(0);
  });

  it("renders form with user data", async () => {
    renderComponent();

    // The inputs should be populated
    // Note: inputs have 'value' prop controlled by state, initial state set in useEffect
    await waitFor(() => {
      expect(screen.getByPlaceholderText("John")).toHaveValue("John");
      expect(screen.getByPlaceholderText("Doe")).toHaveValue("Doe");
      expect(screen.getByPlaceholderText("john@example.com")).toHaveValue(
        "john@example.com",
      );
    });
  });

  it("updates form state on input change", async () => {
    renderComponent();

    // Wait for data to load
    await waitFor(() =>
      expect(screen.getByPlaceholderText("John")).toHaveValue("John"),
    );

    const firstNameInput = screen.getByPlaceholderText("John");
    fireEvent.change(firstNameInput, {
      target: { value: "Jane", name: "firstName" },
    });

    expect(firstNameInput).toHaveValue("Jane");
  });

  it("submits the form with updated data", async () => {
    mockPatchUsersOwnerById.mockReturnValue({
      unwrap: () => Promise.resolve(),
    });

    renderComponent();
    await waitFor(() =>
      expect(screen.getByPlaceholderText("John")).toHaveValue("John"),
    );

    const submitBtn = screen.getByText("Save User Profile");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockPatchUsersOwnerById).toHaveBeenCalledWith({
        id: "123",
        data: expect.objectContaining({
          firstName: "John",
          // ... other fields
        }),
      });
    });
  });
});
