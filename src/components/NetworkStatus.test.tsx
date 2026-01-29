import { render, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import NetworkStatus from "./NetworkStatus";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    dismiss: vi.fn(),
  },
}));

describe("NetworkStatus Component", () => {
  const setOnline = (online: boolean) => {
    vi.stubGlobal("navigator", { ...navigator, onLine: online });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows error toast when offline on mount", () => {
    setOnline(false);
    render(<NetworkStatus />);

    expect(toast.error).toHaveBeenCalledWith(
      "No internet connection",
      expect.any(Object),
    );
  });

  it("does not show error toast when online on mount", () => {
    setOnline(true);
    render(<NetworkStatus />);

    expect(toast.error).not.toHaveBeenCalled();
  });

  it("shows error toast when network goes offline", () => {
    setOnline(true);
    render(<NetworkStatus />);

    act(() => {
      setOnline(false);
      window.dispatchEvent(new Event("offline"));
    });

    expect(toast.error).toHaveBeenCalledWith(
      "No internet connection",
      expect.any(Object),
    );
  });

  it("shows success toast and dismisses offline toast when network comes back online", () => {
    // Start offline
    setOnline(false);
    render(<NetworkStatus />);
    expect(toast.error).toHaveBeenCalled();

    // Go online
    act(() => {
      setOnline(true);
      window.dispatchEvent(new Event("online"));
    });

    expect(toast.dismiss).toHaveBeenCalledWith("offline-toast");
    expect(toast.success).toHaveBeenCalledWith(
      "Connection restored",
      expect.any(Object),
    );
  });

  it("renders nothing when online", () => {
    setOnline(true);
    const { container } = render(<NetworkStatus />);
    expect(container.firstChild).toBeNull();
  });
});
