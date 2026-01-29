import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import Reviews from "./reviews";
import useReviews from "./useReviews"; // Import the hook to mock it
import { AuthContext, type AuthContextType } from "../../context/AuthContext";
import "@testing-library/jest-dom";

// Mock the custom hook
vi.mock("./useReviews", () => ({
  default: vi.fn(),
}));

// Mock framer-motion
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

// Mock Lucide Icons
vi.mock("lucide-react", () => ({
  Star: ({ onClick, ...props }: { onClick?: () => void; [key: string]: unknown }) => (
    <svg data-testid="star-icon" onClick={onClick} {...props} />
  ),
  MessageSquarePlus: () => <svg data-testid="message-icon" />,
  X: () => <svg data-testid="close-icon" />,
  Edit3: () => <svg data-testid="edit-icon" />,
  Trash2: () => <svg data-testid="trash-icon" />,
}));

describe("Reviews Component", () => {
  // Default mock values for useReviews
  const mockUseReviewsDefaults = {
    reviewsData: { review: [] },
    handleDeleteReview: vi.fn(),
    handleEditReview: vi.fn(),
    handleSubmitReview: vi.fn(),
    newRating: 0,
    setNewRating: vi.fn(),
    newComment: "",
    setNewComment: vi.fn(),
    hoverRating: 0,
    setHoverRating: vi.fn(),
    showReviews: false, // Initially hidden
    setShowReviews: vi.fn(),
    reviewFormRef: { current: null },
    editingReview: null,
  };

  const mockUser = {
    id: 1,
    firstName: "Test",
    lastName: "User",
  };

  // Helper to render with AuthContext
  const renderWithContext = (ui: React.ReactNode, user = mockUser) => {
    return render(
      <AuthContext.Provider
        value={
          {
            user,
            setUser: vi.fn(),
            logout: vi.fn(),
            initializing: false,
          } as unknown as AuthContextType
        }
      >
        {ui}
      </AuthContext.Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useReviews as Mock).mockReturnValue(mockUseReviewsDefaults);
  });

  it("renders the toggle button initially", () => {
    renderWithContext(<Reviews />);
    expect(screen.getByText("Customer Reviews")).toBeInTheDocument();
    expect(screen.getByText("Read Reviews or Write One")).toBeInTheDocument();
  });

  it("toggles the reviews panel when clicked", () => {
    // Mock showReviews as true to simulate open state
    (useReviews as Mock).mockReturnValue({
      ...mockUseReviewsDefaults,
      showReviews: true,
    });

    renderWithContext(<Reviews />);

    // Check if panel content is visible
    expect(screen.getByText("Write a Review")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("What did you like about this product?"),
    ).toBeInTheDocument();
    expect(screen.getByText("Close Panel")).toBeInTheDocument();
  });

  it("displays reviews when data is available", () => {
    const mockReviewsData = {
      review: [
        {
          id: 101,
          rating: 4,
          comment: "Great product!",
          createdAt: "2023-01-01T00:00:00Z",
          user: { id: 2, firstName: "Alice", lastName: "Smith" },
        },
      ],
    };

    (useReviews as Mock).mockReturnValue({
      ...mockUseReviewsDefaults,
      showReviews: true,
      reviewsData: mockReviewsData,
    });

    renderWithContext(<Reviews />);

    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Great product!")).toBeInTheDocument();
  });

  it("shows edit and delete buttons only for the review owner", () => {
    const mockReviewsData = {
      review: [
        { id: 101, user: { id: 1 }, comment: "My Review" }, // Match mockUser.id (1)
        { id: 102, user: { id: 2 }, comment: "Other Review" },
      ],
    };

    (useReviews as Mock).mockReturnValue({
      ...mockUseReviewsDefaults,
      showReviews: true,
      reviewsData: mockReviewsData,
    });

    renderWithContext(<Reviews />);

    // Should see buttons for "My Review"
    const editIcons = screen.queryAllByTestId("edit-icon");
    const trashIcons = screen.queryAllByTestId("trash-icon");

    // We expect 1 edit and 1 trash icon because only one review belongs to the user
    expect(editIcons.length).toBe(1);
    expect(trashIcons.length).toBe(1);
  });

  it("calls handleSubmitReview when submit button is clicked", () => {
    const mockHandleSubmit = vi.fn();
    (useReviews as Mock).mockReturnValue({
      ...mockUseReviewsDefaults,
      showReviews: true,
      handleSubmitReview: mockHandleSubmit,
    });

    renderWithContext(<Reviews />);

    const submitBtn = screen.getByText("Post Review");
    fireEvent.click(submitBtn);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("updates rating state when a star is clicked", () => {
    const mockSetNewRating = vi.fn();
    (useReviews as Mock).mockReturnValue({
      ...mockUseReviewsDefaults,
      showReviews: true,
      setNewRating: mockSetNewRating,
    });

    renderWithContext(<Reviews />);

    const stars = screen.getAllByTestId("star-icon");
    // Click the 5th star
    fireEvent.click(stars[4]);

    // Expect explicit value 5 if the component passes index + 1
    // The component map index is 0-4, so index 4 is the 5th star (value 5)
    expect(mockSetNewRating).toHaveBeenCalledWith(5);
  });
});
