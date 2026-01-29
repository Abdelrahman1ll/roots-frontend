import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, type Mock,vi , beforeEach } from "vitest";
import useEmailOrderDispatcher from "./useEmailOrderDispatcher";
import { toast } from "react-toastify";
import { validateEmail } from "../../utils/validators";

/* ================= MOCKS ================= */

// Mock toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock validator
vi.mock("../../utils/validators", () => ({
  validateEmail: vi.fn(),
}));

// Mock RTK Query hooks
const postMock = vi.fn();
const patchMock = vi.fn();
const deleteMock = vi.fn();
const refetchMock = vi.fn();

vi.mock("../../redux/EmailOrderDispatcher/apiEmailOrderDispatcher", () => ({
  usePostEmailOrderDispatcherMutation: () => [
    postMock.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    }),
  ],

  usePatchEmailOrderDispatcherMutation: () => [
    patchMock.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    }),
  ],

  useDeleteEmailOrderDispatcherMutation: () => [
    deleteMock.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({}),
    }),
  ],

  useGetEmailOrderDispatcherQuery: () => ({
    data: { dispatchers: [] },
    isLoading: false,
    refetch: refetchMock,
  }),
}));

/* ================= TESTS ================= */

describe("useEmailOrderDispatcher hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with default state", () => {
    const { result } = renderHook(() => useEmailOrderDispatcher());

    expect(result.current.customerName).toBe("");
    expect(result.current.customerEmail).toBe("");
    expect(result.current.errors).toEqual({ name: "", email: "" });
    expect(result.current.editingId).toBeNull();
  });

  it("validates empty name", async () => {
    const { result } = renderHook(() => useEmailOrderDispatcher());

    await act(async () => {
      await result.current.handleSendEmail();
    });

    expect(result.current.errors.name).toBe("Name is required");
  });

  it("validates empty email", async () => {
    const { result } = renderHook(() => useEmailOrderDispatcher());

    act(() => {
      result.current.setCustomerName("Aramex");
    });

    await act(async () => {
      await result.current.handleSendEmail();
    });

    expect(result.current.errors.email).toBe("Email is required");
  });

  it("validates invalid email format", async () => {
    (validateEmail as Mock).mockReturnValue(false);

    const { result } = renderHook(() => useEmailOrderDispatcher());

    act(() => {
      result.current.setCustomerName("Aramex");
      result.current.setCustomerEmail("invalid-email");
    });

    await act(async () => {
      await result.current.handleSendEmail();
    });

    expect(result.current.errors.email).toBe("Email is not valid");
  });

  it("sends email successfully", async () => {
    (validateEmail as Mock).mockReturnValue(true);

    const { result } = renderHook(() => useEmailOrderDispatcher());

    act(() => {
      result.current.setCustomerName("DHL");
      result.current.setCustomerEmail("dhl@test.com");
    });

    await act(async () => {
      await result.current.handleSendEmail();
    });

    expect(toast.success).toHaveBeenCalledWith("Email sent successfully");
    expect(refetchMock).toHaveBeenCalled();
    expect(result.current.customerName).toBe("");
    expect(result.current.customerEmail).toBe("");
  });

  it("handles delete successfully", async () => {
    const { result } = renderHook(() => useEmailOrderDispatcher());

    await act(async () => {
      await result.current.handleDelete(1);
    });

    expect(toast.success).toHaveBeenCalledWith("Order deleted successfully");
    expect(refetchMock).toHaveBeenCalled();
  });

  it("sets edit state correctly", () => {
    const { result } = renderHook(() => useEmailOrderDispatcher());

    act(() => {
      result.current.handleEdit({
        id: 5,
        name: "FedEx",
        email: "fedex@test.com",
      });
    });

    expect(result.current.editingId).toBe(5);
    expect(result.current.customerName).toBe("FedEx");
    expect(result.current.customerEmail).toBe("fedex@test.com");
  });

  it("saves edit successfully", async () => {
    const { result } = renderHook(() => useEmailOrderDispatcher());

    act(() => {
      result.current.handleEdit({
        id: 3,
        name: "UPS",
        email: "ups@test.com",
      });
    });

    await act(async () => {
      await result.current.handleSaveEdit();
    });

    expect(toast.success).toHaveBeenCalledWith("Order updated successfully");
    expect(refetchMock).toHaveBeenCalled();
    expect(result.current.editingId).toBeNull();
  });
});
