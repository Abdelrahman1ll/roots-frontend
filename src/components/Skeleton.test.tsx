import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Skeleton, SkeletonList } from "./Skeleton";

describe("Skeleton Components", () => {
  describe("Skeleton", () => {
    it("renders with default classes", () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass("animate-pulse");
      expect(skeleton).toHaveClass("bg-gray-200");
    });

    it("applies custom className", () => {
      const { container } = render(<Skeleton className="custom-class" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass("custom-class");
    });
  });

  describe("SkeletonList", () => {
    it("renders the default number of items (5)", () => {
      const { container } = render(<SkeletonList />);
      // SkeletonList contains motion.divs which contains Skeletons.
      // Each motion.div has a Skeleton inside it.
      const skeletons = container.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBe(5);
    });

    it("renders the specified number of items", () => {
      const { container } = render(<SkeletonList count={3} />);
      const skeletons = container.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBe(3);
    });

    it("applies className to wrapper items", () => {
      const { container } = render(
        <SkeletonList count={1} className="item-class" />,
      );
      const wrapper = container.querySelector(".item-class");
      expect(wrapper).toBeInTheDocument();
    });
  });
});
