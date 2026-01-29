import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Main from "./main";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock Cloudinary utils
vi.mock("../../utils/cloudinary", () => ({
  getCloudinaryUrl: vi.fn((id) => `mock-url-${id}`),
  getCloudinarySrcSet: vi.fn(() => "mock-srcset"),
}));
// Mock Framer Motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    img: ({ children, ...props }: any) => <img {...props}>{children}</img>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
  },
}));

describe("Main Component", () => {
  it("renders correctly", () => {
    render(
      <BrowserRouter>
        <Main />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Discover Your/i)).toBeInTheDocument();
    expect(screen.getByText(/Unique Style/i)).toBeInTheDocument();
    expect(screen.getByText(/Shop Collection/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Shop Collection/i }),
    ).toHaveAttribute("href", "/products");
  });

  it("renders fashion images", () => {
    render(
      <BrowserRouter>
        <Main />
      </BrowserRouter>,
    );

    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThan(0);
    // Hero image is eager loaded
    expect(images[0]).toHaveAttribute("loading", "eager");
  });
});
