import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock lazy loaded pages to verify routing without rendering huge trees
vi.mock("./pages/Home/homePage", () => ({
  default: () => <div>Home Page</div>,
}));
vi.mock("./pages/products/productPage", () => ({
  default: () => <div>Products Page</div>,
}));
vi.mock("./pages/products/productDetailsPage", () => ({
  default: () => <div>Product Details Page</div>,
}));
vi.mock("./pages/Cart/cartPage", () => ({
  default: () => <div>Cart Page</div>,
}));
vi.mock("./pages/Wishlist/wishlistPage", () => ({
  default: () => <div>Wishlist Page</div>,
}));
vi.mock("./pages/Profile/profilePage", () => ({
  default: () => <div>Profile Page</div>,
}));
vi.mock("./pages/Orders/ordersPage", () => ({
  default: () => <div>Orders Page</div>,
}));
vi.mock("./pages/Orders/orderDetailsPage", () => ({
  default: () => <div>Order Details Page</div>,
}));
vi.mock("./pages/NotFound", () => ({
  default: () => <div>Not Found Page</div>,
}));

// Mock components
vi.mock("./components/Loading", () => ({
  default: () => <div>Loading...</div>,
}));
vi.mock("./components/NetworkStatus", () => ({
  default: () => <div>Network Status</div>,
}));
vi.mock("./components/ScrollToTop", () => ({ default: () => null }));
vi.mock("./components/ProtectedRoute", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock react-toastify
vi.mock("react-toastify", () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: { error: vi.fn(), success: vi.fn() },
}));

// Mock react-router-dom's BrowserRouter since App uses Routes/Route but implies a Router wraps it
// However, App.tsx DOES NOT appear to wrap itself in a BrowserRouter.
// Usually App is wrapped in main.tsx.
// correctly, `render` with `MemoryRouter` works if App contains `Routes`.
// If App contained `BrowserRouter`, we'd have to mock it or avoiding wrapping it again.
// Looking at App.tsx, it just returns <div>...<Routes>...</div>. So we wrap with MemoryRouter.

describe("App Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders home page on default route", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    // Initial loading state might appear due to Suspense
    // await waitFor(() => expect(screen.getByText("Loading...")).toBeInTheDocument());

    // Then content
    await waitFor(() =>
      expect(screen.getByText("Home Page")).toBeInTheDocument(),
    );
  });

  it("renders 404 page for unknown route", async () => {
    render(
      <MemoryRouter initialEntries={["/unknown-route"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText("Not Found Page")).toBeInTheDocument(),
    );
  });

  it("renders toast container", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("toast-container")).toBeInTheDocument();
  });
});
