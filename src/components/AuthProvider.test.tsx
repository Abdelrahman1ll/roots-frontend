import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider } from "./AuthProvider";
import { AuthContext } from "../context/AuthContext";
import Cookies from "js-cookie";
import { useContext } from "react";

vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

// We can mock crypto-js to return simple strings for testing
vi.mock("crypto-js", () => ({
  default: {
    AES: {
      encrypt: vi.fn(() => ({ toString: () => "encrypted_data" })),
      decrypt: vi.fn(() => ({
        toString: () => '{"user": {"id": 1, "firstName": "Test"}}',
      })),
    },
    enc: {
      Utf8: "utf8",
    },
  },
}));

describe("AuthProvider Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const TestConsumer = () => {
    const { user, initializing, setUser, logout } = useContext(AuthContext);
    if (initializing) return <div data-testid="loading">Loading...</div>;
    return (
      <div>
        <div data-testid="user">{user ? user.firstName : "no user"}</div>
        <button
          data-testid="login-btn"
          onClick={() =>
            setUser({
              user: {
                id: 1,
                firstName: "New User",
                email: "test@example.com",
                role: "user",
                createdAt: new Date().toISOString(),
              },
              accessToken: "token",
            })
          }
        >
          Login
        </button>
        <button data-testid="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    );
  };

  it("initializes with null user if no cookie exists", async () => {
    vi.mocked(Cookies.get).mockReturnValue(undefined as any);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user")).toHaveTextContent("no user");
  });

  it("initializes with user from cookie if it exists", async () => {
    vi.mocked(Cookies.get).mockReturnValue("some_encrypted_cookie" as any);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user")).toHaveTextContent("Test");
  });

  it("updates state and cookies on setUser (login)", async () => {
    vi.mocked(Cookies.get).mockReturnValue(undefined as any);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    const loginBtn = screen.getByTestId("login-btn");
    await act(async () => {
      loginBtn.click();
    });

    expect(screen.getByTestId("user")).toHaveTextContent("New User");
    expect(Cookies.set).toHaveBeenCalledWith(
      "user",
      "encrypted_data",
      expect.any(Object),
    );
  });

  it("clears state and cookies on logout", async () => {
    vi.mocked(Cookies.get).mockReturnValue("some_encrypted_cookie" as any);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    const logoutBtn = screen.getByTestId("logout-btn");
    await act(async () => {
      logoutBtn.click();
    });

    expect(screen.getByTestId("user")).toHaveTextContent("no user");
    expect(Cookies.remove).toHaveBeenCalledWith("user");
  });
});
