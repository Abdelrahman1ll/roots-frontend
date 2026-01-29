import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import GoogleSignup from "./googleSignup";
import { AuthContext } from "../../context/AuthContext";
import { useUsersSignupGoogleMutation } from "../../redux/users/apiUsers";
import "@testing-library/jest-dom";

// Mock the mutation hook
vi.mock("../../redux/users/apiUsers", () => ({
  useUsersSignupGoogleMutation: vi.fn(),
}));

// Mock GoogleLogin component
// Note: handling 'onSuccess' prop mock in test manually or via this mock
vi.mock("@react-oauth/google", () => ({
  GoogleLogin: ({
    onSuccess,
    onError,
  }: {
    onSuccess: (res: any) => void;
    onError: () => void;
  }) => (
    <div>
      <button onClick={() => onSuccess({ credential: "mock-token" })}>
        Mock Google Login Success
      </button>
      <button onClick={() => onError()}>Mock Google Login Error</button>
    </div>
  ),
}));

describe("GoogleSignup Component", () => {
  const mockSetUser = vi.fn();
  const mockOnClose = vi.fn();
  const mockSignupGoogle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useUsersSignupGoogleMutation as any).mockReturnValue([mockSignupGoogle]);
  });

  const renderWithContext = () => {
    return render(
      <AuthContext.Provider
        value={
          {
            user: null,
            setUser: mockSetUser,
            logout: vi.fn(),
            initializing: false,
          } as any
        }
      >
        <GoogleSignup onClose={mockOnClose} />
      </AuthContext.Provider>,
    );
  };

  it("renders google login button", () => {
    renderWithContext();
    expect(screen.getByText("Mock Google Login Success")).toBeInTheDocument();
  });

  it("calls signupGoogle mutation and sets user on success", async () => {
    const mockUserResponse = { id: 1, name: "Google User" };
    mockSignupGoogle.mockReturnValue({
      unwrap: () => Promise.resolve(mockUserResponse),
    });

    renderWithContext();

    fireEvent.click(screen.getByText("Mock Google Login Success"));

    await waitFor(() => {
      expect(mockSignupGoogle).toHaveBeenCalledWith({
        token_google: "mock-token",
      });
      expect(mockSetUser).toHaveBeenCalledWith(mockUserResponse);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("handles Google login failure from component", () => {
    renderWithContext();
    fireEvent.click(screen.getByText("Mock Google Login Error"));
    // Since toast is mocked or not shown, we just ensure no mutation call if error happens at component level
    // checking expectations based on component logic
    expect(mockSignupGoogle).not.toHaveBeenCalled();
  });
});
