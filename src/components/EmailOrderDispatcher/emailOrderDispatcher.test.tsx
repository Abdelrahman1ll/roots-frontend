import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EmailOrderDispatcher from "./emailOrderDispatcher";
import useEmailOrderDispatcher from "./useEmailOrderDispatcher";
import "@testing-library/jest-dom";

// Mock the useEmailOrderDispatcher hook
vi.mock("./useEmailOrderDispatcher", () => ({
  default: vi.fn(),
}));

// Mock Framer Motion
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

describe("EmailOrderDispatcher Component", () => {
  const mockHandleSendEmail = vi.fn();
  const mockHandleDelete = vi.fn();
  const mockHandleEdit = vi.fn();
  const mockHandleSaveEdit = vi.fn();
  const mockSetCustomerName = vi.fn();
  const mockSetCustomerEmail = vi.fn();

  const defaultHookReturn = {
    data: null,
    isLoading: false,
    customerName: "",
    setCustomerName: mockSetCustomerName,
    customerEmail: "",
    setCustomerEmail: mockSetCustomerEmail,
    errors: { name: "", email: "" },
    handleSendEmail: mockHandleSendEmail,
    handleDelete: mockHandleDelete,
    handleEdit: mockHandleEdit,
    handleSaveEdit: mockHandleSaveEdit,
    reviewFormRef: { current: null },
    formatEndDateArabic: (date: string) => `Formatted ${date}`,
    editingId: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the loading state", () => {
    (useEmailOrderDispatcher as any).mockReturnValue({
      ...defaultHookReturn,
      isLoading: true,
    });

    render(<EmailOrderDispatcher />);
    expect(screen.getByText("Loading dispatchers...")).toBeInTheDocument();
  });

  it("renders the empty state when no dispatch rules exist", () => {
    (useEmailOrderDispatcher as any).mockReturnValue({
      ...defaultHookReturn,
      data: { dispatchers: [] },
    });

    render(<EmailOrderDispatcher />);
    expect(screen.getByText("No active dispatch rules")).toBeInTheDocument();
  });

  it("renders the list of dispatchers correctly", () => {
    (useEmailOrderDispatcher as any).mockReturnValue({
      ...defaultHookReturn,
      data: {
        dispatchers: [
          {
            id: 1,
            name: "Aramex",
            email: "aramex@test.com",
            dispatchedAt: "2026-01-01",
          },
          {
            id: 2,
            name: "DHL",
            email: "dhl@test.com",
            dispatchedAt: "2026-01-02",
          },
        ],
      },
    });

    render(<EmailOrderDispatcher />);

    expect(screen.getByText("Aramex")).toBeInTheDocument();
    expect(screen.getByText("aramex@test.com")).toBeInTheDocument();
    expect(screen.getByText("DHL")).toBeInTheDocument();
    expect(screen.getByText("dhl@test.com")).toBeInTheDocument();
  });

  it("handles form input changes", () => {
    (useEmailOrderDispatcher as any).mockReturnValue({
      ...defaultHookReturn,
      customerName: "Aramex",
      customerEmail: "orders@aramex.com",
    });

    render(<EmailOrderDispatcher />);

    const nameInput = screen.getByPlaceholderText(/Ex: Aramex Express/i);
    const emailInput = screen.getByPlaceholderText("orders@logistics.com");

    expect(nameInput).toHaveValue("Aramex");
    expect(emailInput).toHaveValue("orders@aramex.com");

    fireEvent.change(nameInput, { target: { value: "DHL" } });
    expect(mockSetCustomerName).toHaveBeenCalledWith("DHL");

    fireEvent.change(emailInput, { target: { value: "orders@dhl.com" } });
    expect(mockSetCustomerEmail).toHaveBeenCalledWith("orders@dhl.com");
  });

  it("displays validation errors", () => {
    (useEmailOrderDispatcher as any).mockReturnValue({
      ...defaultHookReturn,
      errors: { name: "Name is required", email: "Email is not valid" },
    });

    render(<EmailOrderDispatcher />);

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is not valid")).toBeInTheDocument();
  });

  it("triggers add/save button correctly", () => {
    // Test Add
    (useEmailOrderDispatcher as any).mockReturnValue({
      ...defaultHookReturn,
      customerName: "Test",
      customerEmail: "test@test.com",
    });

    const { rerender } = render(<EmailOrderDispatcher />);
    fireEvent.click(screen.getByRole("button", { name: /Add Routing Rule/i }));
    expect(mockHandleSendEmail).toHaveBeenCalled();

    // Test Save Edit
    (useEmailOrderDispatcher as any).mockReturnValue({
      ...defaultHookReturn,
      editingId: 1,
      customerName: "Edit",
      customerEmail: "edit@test.com",
    });

    rerender(<EmailOrderDispatcher />);
    fireEvent.click(
      screen.getByRole("button", { name: /Update Configuration/i }),
    );
    expect(mockHandleSaveEdit).toHaveBeenCalled();
  });

  it("calls handleEdit and handleDelete correctly", () => {
    const mockDispatchers = [
      { id: 1, name: "Partner", email: "partner@test.com" },
    ];
    (useEmailOrderDispatcher as any).mockReturnValue({
      ...defaultHookReturn,
      data: { dispatchers: mockDispatchers },
    });

    render(<EmailOrderDispatcher />);

    const buttons = screen.getAllByRole("button");
    // Index 0: Add/Update Global button
    // Index 1: Edit partner 1
    // Index 2: Trash partner 1

    fireEvent.click(buttons[1]);
    expect(mockHandleEdit).toHaveBeenCalledWith(mockDispatchers[0]);

    fireEvent.click(buttons[2]);
    expect(mockHandleDelete).toHaveBeenCalledWith(1);
  });
});
