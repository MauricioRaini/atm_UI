import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { NumericKeyboard } from "../NumericKeyboard/NumericKeyboard";

describe("🔢 Numeric Keyboard Component", () => {
  const mockOnNumberPress = jest.fn();
  const mockOnEnterPress = jest.fn();
  const mockOnClearPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("🖥️ Given the Numeric Keyboard renders", () => {
    it("✅ Then it should display number keys (0-9), 'Enter', and 'Clear' buttons", () => {
      render(
        <NumericKeyboard
          onNumberPress={mockOnNumberPress}
          onEnterPress={mockOnEnterPress}
          onClearPress={mockOnClearPress}
        />,
      );

      for (let i = 0; i <= 9; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }

      expect(screen.getByText("Enter")).toBeInTheDocument();
      expect(screen.getByText("Clear")).toBeInTheDocument();
    });
  });

  describe("🎯 Given a number key is clicked", () => {
    it("✅ Then it should call `onNumberPress` with the correct number", () => {
      render(
        <NumericKeyboard
          onNumberPress={mockOnNumberPress}
          onEnterPress={mockOnEnterPress}
          onClearPress={mockOnClearPress}
        />,
      );

      fireEvent.click(screen.getByText("5"));

      expect(mockOnNumberPress).toHaveBeenCalledTimes(1);
      expect(mockOnNumberPress).toHaveBeenCalledWith(5);
    });
  });

  describe("🟢 Given the 'Enter' button is clicked", () => {
    it("✅ Then it should call `onEnterPress`", () => {
      render(
        <NumericKeyboard
          onNumberPress={mockOnNumberPress}
          onEnterPress={mockOnEnterPress}
          onClearPress={mockOnClearPress}
        />,
      );

      fireEvent.click(screen.getByText("Enter"));

      expect(mockOnEnterPress).toHaveBeenCalledTimes(1);
    });
  });

  describe("🧹 Given the 'Clear' button is clicked", () => {
    it("✅ Then it should call `onClearPress`", () => {
      render(
        <NumericKeyboard
          onNumberPress={mockOnNumberPress}
          onEnterPress={mockOnEnterPress}
          onClearPress={mockOnClearPress}
        />,
      );

      fireEvent.click(screen.getByText("Clear"));

      expect(mockOnClearPress).toHaveBeenCalledTimes(1);
    });
  });

  describe("🔢 Given a user types a number key (0-9) on the keyboard", () => {
    it("✅ Then it should call `onNumberPress` with the correct number", async () => {
      render(
        <NumericKeyboard
          onNumberPress={mockOnNumberPress}
          onEnterPress={mockOnEnterPress}
          onClearPress={mockOnClearPress}
        />,
      );

      await userEvent.keyboard("7");

      expect(mockOnNumberPress).toHaveBeenCalledTimes(1);
      expect(mockOnNumberPress).toHaveBeenCalledWith(7);
    });
  });

  describe("🚀 Given a user presses the 'Enter' key", () => {
    it("✅ Then it should call `onEnterPress`", async () => {
      render(
        <NumericKeyboard
          onNumberPress={mockOnNumberPress}
          onEnterPress={mockOnEnterPress}
          onClearPress={mockOnClearPress}
        />,
      );

      await userEvent.keyboard("{Enter}");

      expect(mockOnEnterPress).toHaveBeenCalledTimes(1);
    });
  });

  describe("🔙 Given a user presses 'Backspace' key", () => {
    it("✅ Then it should call `onClearPress`", async () => {
      render(
        <NumericKeyboard
          onNumberPress={mockOnNumberPress}
          onEnterPress={mockOnEnterPress}
          onClearPress={mockOnClearPress}
        />,
      );

      await userEvent.keyboard("{Backspace}");

      expect(mockOnClearPress).toHaveBeenCalledTimes(1);
    });
  });

  describe("🚫 Given a user presses an invalid key", () => {
    it("✅ Then it should NOT trigger any action", async () => {
      render(
        <NumericKeyboard
          onNumberPress={mockOnNumberPress}
          onEnterPress={mockOnEnterPress}
          onClearPress={mockOnClearPress}
        />,
      );

      await userEvent.keyboard("A");

      expect(mockOnNumberPress).not.toHaveBeenCalled();
      expect(mockOnEnterPress).not.toHaveBeenCalled();
      expect(mockOnClearPress).not.toHaveBeenCalled();
    });
  });

  describe("📏 Given the Numeric Keyboard renders", () => {
    it("✅ Then it should display buttons in a proper ATM-like layout", () => {
      render(
        <NumericKeyboard
          onNumberPress={mockOnNumberPress}
          onEnterPress={mockOnEnterPress}
          onClearPress={mockOnClearPress}
        />,
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(12);

      expect(buttons[0]).toHaveTextContent("1");
      expect(buttons[1]).toHaveTextContent("2");
      expect(buttons[2]).toHaveTextContent("3");
      expect(buttons[3]).toHaveTextContent("4");
      expect(buttons[4]).toHaveTextContent("5");
      expect(buttons[5]).toHaveTextContent("6");
      expect(buttons[6]).toHaveTextContent("7");
      expect(buttons[7]).toHaveTextContent("8");
      expect(buttons[8]).toHaveTextContent("9");
      expect(buttons[9]).toHaveTextContent("0");
      expect(buttons[10]).toHaveTextContent("Clear");
      expect(buttons[11]).toHaveTextContent("Enter");
    });
  });
});
