import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DiscountCodes from "./discountCodes";
import useDiscountCodes from "./useDiscountCodes";
import "@testing-library/jest-dom";

// Mock the useDiscountCodes hook
vi.mock("./useDiscountCodes", () => ({
  default: vi.fn(),
}));

// Mock Framer Motion is now handled globally in setup.ts
// but we keep a simple version here if needed, or just let global handle it.
// Removing local mock to use global one which is cleaner.

describe("DiscountCodes Component", () => {
  const mockHandleAddOrSave = vi.fn();
  const mockHandleEdit = vi.fn();
  const mockHandleDelete = vi.fn();
  const mockSetNewCode = vi.fn();
  const mockSetNewDiscount = vi.fn();
  const mockSetNewExpiry = vi.fn();

  const defaultHookReturn = {
    data: null,
    isLoading: false,
    isAdding: false,
    isEditing: false,
    isDeleting: false,
    newCode: "",
    newDiscount: "",
    newExpiry: "",
    handleAddOrSave: mockHandleAddOrSave,
    handleEdit: mockHandleEdit,
    handleDelete: mockHandleDelete,
    reviewFormRef: { current: null },
    editingId: null,
    setNewCode: mockSetNewCode,
    setNewDiscount: mockSetNewDiscount,
    setNewExpiry: mockSetNewExpiry,
    formatEndDateArabic: (date: string) => `Formatted ${date}`,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the loading state", () => {
    (useDiscountCodes as any).mockReturnValue({
      ...defaultHookReturn,
      isLoading: true,
    });

    render(<DiscountCodes />);
    expect(screen.getByText("Loading promotions...")).toBeInTheDocument();
  });

  it("renders the empty state when no campaigns exist", () => {
    (useDiscountCodes as any).mockReturnValue({
      ...defaultHookReturn,
      data: { discountCodes: [] },
    });

    render(<DiscountCodes />);
    expect(screen.getByText("No active campaigns")).toBeInTheDocument();
  });

  it("renders the list of discount codes correctly", () => {
    (useDiscountCodes as any).mockReturnValue({
      ...defaultHookReturn,
      data: {
        discountCodes: [
          { id: 1, code: "SUMMER10", discount: 10, EndDate: "2026-06-01" },
          { id: 2, code: "WINTER20", discount: 20, EndDate: "2026-12-01" },
        ],
      },
    });

    render(<DiscountCodes />);

    expect(screen.getByText("SUMMER10")).toBeInTheDocument();
    expect(screen.getByText("10%")).toBeInTheDocument();
    expect(screen.getByText("WINTER20")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
  });

  it("handles form input changes", () => {
    (useDiscountCodes as any).mockReturnValue({
      ...defaultHookReturn,
      newCode: "TEST",
      newDiscount: "15",
      newExpiry: "2026-01-01",
    });

    render(<DiscountCodes />);

    const codeInput = screen.getByPlaceholderText(/SUMMER2026/i);
    const discountInput = screen.getByPlaceholderText("%");

    // Check values
    expect(codeInput).toHaveValue("TEST");
    expect(discountInput).toHaveValue(15);

    // Test changes
    fireEvent.change(codeInput, { target: { value: "NEWCODE" } });
    expect(mockSetNewCode).toHaveBeenCalledWith("NEWCODE");

    fireEvent.change(discountInput, { target: { value: "25" } });
    expect(mockSetNewDiscount).toHaveBeenCalledWith("25");
  });

  it("triggers launch/update button", () => {
    (useDiscountCodes as any).mockReturnValue({
      ...defaultHookReturn,
      newCode: "PROMO",
      newDiscount: "10",
      newExpiry: "2026-12-31",
    });

    render(<DiscountCodes />);

    const button = screen.getByRole("button", { name: /Add Code/i });
    fireEvent.click(button);

    expect(mockHandleAddOrSave).toHaveBeenCalled();
  });

  it("switches to edit mode label when editingId exists", () => {
    (useDiscountCodes as any).mockReturnValue({
      ...defaultHookReturn,
      editingId: 1,
      newCode: "EDITING",
    });

    render(<DiscountCodes />);

    expect(screen.getByText("Edit Promotion")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Edit Code/i }),
    ).toBeInTheDocument();
  });

  it("calls handleEdit and handleDelete correctly", () => {
    const mockCodes = [
      { id: 1, code: "C1", discount: 5, EndDate: "2026-01-01" },
    ];
    (useDiscountCodes as any).mockReturnValue({
      ...defaultHookReturn,
      data: { discountCodes: mockCodes },
    });

    render(<DiscountCodes />);

    const editBtn = screen.getAllByRole("button")[1]; // 0 is Launch, 1 is Edit row 1
    const deleteBtn = screen.getAllByRole("button")[2]; // 2 is Trash row 1

    fireEvent.click(editBtn);
    expect(mockHandleEdit).toHaveBeenCalledWith(mockCodes[0]);

    fireEvent.click(deleteBtn);
    expect(mockHandleDelete).toHaveBeenCalledWith(1);
  });
});
