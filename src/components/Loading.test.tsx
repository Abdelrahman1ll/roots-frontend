import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Loading from "./Loading";

describe("Loading Component", () => {
  it("renders the loading orb", () => {
    render(<Loading />);
    const orb = document.querySelector(".animate-orb-float");
    expect(orb).toBeInTheDocument();
  });

  it("has the correct layout classes", () => {
    const { container } = render(<Loading />);
    const outerDiv = container.firstChild as HTMLElement;

    expect(outerDiv).toHaveClass(
      "fixed",
      "inset-0",
      "flex",
      "justify-center",
      "items-center",
    );
  });

  it("does not render the brand name ROOTS", () => {
    // The previous test said it SHOULD NOT render
    const { queryByText } = render(<Loading />);
    expect(queryByText("ROOTS")).not.toBeInTheDocument();
  });

  it("renders the loading text", () => {
    const { getByText } = render(<Loading />);
    expect(getByText("Crafting Excellence")).toBeInTheDocument();
  });
});
