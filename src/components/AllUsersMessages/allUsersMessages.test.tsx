import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AllUsersMessages from "./allUsersMessages";
import { useSendEmailMutation } from "../../redux/Email/apiEmail";
import { toast } from "react-toastify";
import "@testing-library/jest-dom";

// Mock the API hook
vi.mock("../../redux/Email/apiEmail", () => ({
  useSendEmailMutation: vi.fn(),
}));

// Mock toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock Framer Motion
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

// Mock icons
vi.mock("lucide-react", () => ({
  Mail: () => <div data-testid="mail-icon" />,
  MessageSquareText: () => <div data-testid="message-icon" />,
  Send: () => <div data-testid="send-icon" />,
  Megaphone: () => <div data-testid="megaphone-icon" />,
}));

describe("AllUsersMessages Component", () => {
  const mockSendEmail = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSendEmailMutation).mockReturnValue([
      mockSendEmail,
      { isLoading: false } as unknown as { isLoading: boolean },
    ] as unknown as ReturnType<typeof useSendEmailMutation>);
  });

  it("renders the form elements correctly", () => {
    render(<AllUsersMessages />);

    expect(screen.getByText("Broadcast Message")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Big Summer Sale/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Type your message here/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Send to All Customers/i }),
    ).toBeDisabled();
  });

  it("enables the send button when both subject and message are provided", () => {
    render(<AllUsersMessages />);

    const subjectInput = screen.getByPlaceholderText(/Big Summer Sale/i);
    const messageInput = screen.getByPlaceholderText(/Type your message here/i);
    const sendButton = screen.getByRole("button", {
      name: /Send to All Customers/i,
    });

    fireEvent.change(subjectInput, { target: { value: "Hello" } });
    fireEvent.change(messageInput, { target: { value: "World" } });

    expect(sendButton).not.toBeDisabled();
  });

  it("calls sendEmail mutation and shows success message on successful submission", async () => {
    const unwrapMock = vi.fn().mockResolvedValue({});
    mockSendEmail.mockReturnValue({ unwrap: unwrapMock });

    render(<AllUsersMessages />);

    const subjectInput = screen.getByPlaceholderText(/Big Summer Sale/i);
    const messageInput = screen.getByPlaceholderText(/Type your message here/i);
    const sendButton = screen.getByRole("button", {
      name: /Send to All Customers/i,
    });

    fireEvent.change(subjectInput, { target: { value: "Special Offer" } });
    fireEvent.change(messageInput, {
      target: { value: "Get 50% off everything!" },
    });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockSendEmail).toHaveBeenCalledWith({
        subject: "Special Offer",
        message: "Get 50% off everything!",
      });
      expect(unwrapMock).toHaveBeenCalled();
    });

    expect(toast.success).toHaveBeenCalledWith("Email sent successfully!");
    expect(
      screen.getByText("Message sent successfully to all customers!"),
    ).toBeInTheDocument();

    // Inputs should be cleared
    expect(subjectInput).toHaveValue("");
    expect(messageInput).toHaveValue("");
  });

  it("shows error toast on failed submission", async () => {
    const unwrapMock = vi.fn().mockRejectedValue(new Error("Failed"));
    mockSendEmail.mockReturnValue({ unwrap: unwrapMock });

    render(<AllUsersMessages />);

    const subjectInput = screen.getByPlaceholderText(/Big Summer Sale/i);
    const messageInput = screen.getByPlaceholderText(/Type your message here/i);
    const sendButton = screen.getByRole("button", {
      name: /Send to All Customers/i,
    });

    fireEvent.change(subjectInput, { target: { value: "Fail Test" } });
    fireEvent.change(messageInput, { target: { value: "Broken message" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to send email. Please try again.",
      );
    });
  });

  it("shows loading state while sending", () => {
    vi.mocked(useSendEmailMutation).mockReturnValue([
      mockSendEmail,
      { isLoading: true } as unknown as { isLoading: boolean },
    ] as unknown as ReturnType<typeof useSendEmailMutation>);

    render(<AllUsersMessages />);

    expect(screen.getByText("Sending Broadcast...")).toBeInTheDocument();
  });
});
