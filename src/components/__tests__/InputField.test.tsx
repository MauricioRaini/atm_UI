import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { InputField } from "../InputField";

describe("InputField", () => {
  const mockOnEnter = jest.fn();
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Given a numeric input field", () => {
    it("When rendered, Then it should display correctly", () => {
      render(<InputField value="" onEnter={mockOnEnter} onChange={mockOnChange} />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("When a user types numbers, Then it should accept input", async () => {
      render(<InputField value="" onEnter={mockOnEnter} onChange={mockOnChange} />);
      const input = screen.getByRole("textbox");

      await userEvent.type(input, "1234");
      expect(mockOnChange).toHaveBeenCalledTimes(4);
      expect(input).toHaveValue("1234");
    });

    it("When a user types non-numeric characters, Then it should ignore them", async () => {
      render(<InputField value="" onEnter={mockOnEnter} onChange={mockOnChange} />);
      const input = screen.getByRole("textbox");

      await userEvent.type(input, "abc123$@!");
      expect(mockOnChange).toHaveBeenCalledTimes(3);
      expect(input).toHaveValue("123");
    });

    it("When max length is reached, Then it should prevent further input", async () => {
      render(<InputField value="" maxLength={4} onEnter={mockOnEnter} onChange={mockOnChange} />);
      const input = screen.getByRole("textbox");

      await userEvent.type(input, "123456");
      expect(input).toHaveValue("1234");
    });
  });

  describe("Given an Enter key event", () => {
    it("When Enter is pressed, Then it should trigger the onEnter callback", async () => {
      render(<InputField value="1234" onEnter={mockOnEnter} onChange={mockOnChange} />);
      const input = screen.getByRole("textbox");

      await userEvent.type(input, "{Enter}");
      expect(mockOnEnter).toHaveBeenCalledTimes(1);
    });

    it("When other keys are pressed, Then it should not trigger onEnter", async () => {
      render(<InputField value="1234" onEnter={mockOnEnter} onChange={mockOnChange} />);
      const input = screen.getByRole("textbox");

      await userEvent.type(input, "{Escape}");
      expect(mockOnEnter).not.toHaveBeenCalled();
    });
  });

  describe("Given an external value update", () => {
    it("When value is updated via props, Then it should reflect in the input field", () => {
      const { rerender } = render(
        <InputField value="1234" onEnter={mockOnEnter} onChange={mockOnChange} />,
      );
      const input = screen.getByRole("textbox");

      expect(input).toHaveValue("1234");

      rerender(<InputField value="5678" onEnter={mockOnEnter} onChange={mockOnChange} />);
      expect(input).toHaveValue("5678");
    });
  });

  describe("Given an error state", () => {
    it("When error is true, Then the input should visually indicate an error", () => {
      render(<InputField value="1234" error onEnter={mockOnEnter} onChange={mockOnChange} />);
      const input = screen.getByRole("textbox");

      expect(input).toHaveClass("error");
    });
  });
});
