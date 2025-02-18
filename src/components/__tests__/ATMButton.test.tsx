import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { ATMButton } from "../ATMButton";

describe("ATMButton", () => {
  const mockCallback = jest.fn();
  const keyboardKey = "Enter";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    render(<ATMButton label="Test" onClick={mockCallback} keyBinding={keyboardKey} />);

    expect(screen.getByRole("button", { name: "Test" })).toBeInTheDocument();
  });

  it("should call the provided callback function when clicked", () => {
    render(<ATMButton label="Test" onClick={mockCallback} keyBinding={keyboardKey} />);

    fireEvent.click(screen.getByRole("button", { name: "Test" }));

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("should trigger button click when the linked keyboard key is pressed", async () => {
    render(<ATMButton label="Test" onClick={mockCallback} keyBinding={keyboardKey} />);

    await userEvent.keyboard(`{${keyboardKey}}`);

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("should not trigger click on incorrect key press", async () => {
    render(<ATMButton label="Test" onClick={mockCallback} keyBinding={keyboardKey} />);

    await userEvent.keyboard("{Escape}");

    expect(mockCallback).not.toHaveBeenCalled();
  });
});
