import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { ATMButtons } from "@/types";
import { jest } from "@jest/globals";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { PINEntryScreen } from "../PINEntryScreen";

// A helper to mock the “backend” call; must remain truly async
// so we can test concurrency, etc.
const mockValidatePIN = jest.fn();

jest.mock("./pinService", () => ({
  validatePIN: (pin: string) => mockValidatePIN(pin),
}));

// A small utility to press a series of numeric keys
const pressDigits = (digits: string) => {
  for (const digit of digits) {
    fireEvent.keyDown(window, { key: digit });
  }
};

describe("PINEntryScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Optionally reset store or re-initialize it to a known state
    useBlueScreenStore.setState({
      isAuthenticated: false,
      buttonBindings: {},
      // ... plus anything else to ensure we start fresh
    });
  });

  test("renders input label, dynamic label (masked), and numeric keyboard", () => {
    render(<PINEntryScreen />);
    // Input label
    expect(screen.getByTestId("pin-input-field")).toBeInTheDocument();
    // Dynamic label (should be masked by default)
    const maskedLabel = screen.getByText("******", { exact: false });
    expect(maskedLabel).toBeInTheDocument();

    // Numeric keyboard - using “Enter” and “Clear” as anchors to confirm
    expect(screen.getByText("Enter")).toBeInTheDocument();
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  test("updates input when user types from the physical keyboard", () => {
    render(<PINEntryScreen />);
    pressDigits("123456");
    // The dynamic label is masked, but we can check the underlying input’s value
    const inputField = screen.getByTestId("pin-input-field") as HTMLInputElement;
    expect(inputField.value).toBe("123456");
  });

  test("updates input when user presses numeric keyboard buttons", () => {
    render(<PINEntryScreen />);

    fireEvent.click(screen.getByText("1"));
    fireEvent.click(screen.getByText("2"));
    fireEvent.click(screen.getByText("3"));
    fireEvent.click(screen.getByText("4"));
    fireEvent.click(screen.getByText("5"));
    fireEvent.click(screen.getByText("6"));

    const inputField = screen.getByTestId("pin-input-field") as HTMLInputElement;
    expect(inputField.value).toBe("123456");
  });

  test("clears input when the user clicks or presses 'Clear'", () => {
    render(<PINEntryScreen />);
    pressDigits("123456");

    // Clear via on-screen button
    fireEvent.click(screen.getByText("Clear"));

    const inputField = screen.getByTestId("pin-input-field") as HTMLInputElement;
    expect(inputField.value).toBe("");
  });

  test("when user presses 'Enter' with fewer than 6 digits, it does NOT trigger the async call", async () => {
    render(<PINEntryScreen />);
    pressDigits("12345"); // 5 digits
    fireEvent.click(screen.getByText("Enter"));

    expect(mockValidatePIN).not.toHaveBeenCalled();
    const inputField = screen.getByTestId("pin-input-field") as HTMLInputElement;
    // Should remain the same 5 digits
    expect(inputField.value).toBe("12345");
  });

  test("triggers async PIN validation on 6 digits + Enter", async () => {
    mockValidatePIN.mockResolvedValueOnce({ success: true }); // mock success
    render(<PINEntryScreen />);
    pressDigits("123456");

    // Now press Enter
    fireEvent.click(screen.getByText("Enter"));
    expect(mockValidatePIN).toHaveBeenCalledWith("123456");
  });

  test("shows error and clears input if the PIN is incorrect", async () => {
    mockValidatePIN.mockResolvedValueOnce({ success: false });
    render(<PINEntryScreen />);
    pressDigits("111111");
    fireEvent.click(screen.getByText("Enter"));

    // Wait for error to display
    await waitFor(() => {
      const errorMsg = screen.getByText(/incorrect PIN/i);
      expect(errorMsg).toBeInTheDocument();
    });

    // Underlying input should reset
    const inputField = screen.getByTestId("pin-input-field") as HTMLInputElement;
    expect(inputField.value).toBe("");
  });

  test("locks out after 3 failed attempts for 10 minutes", async () => {
    mockValidatePIN.mockResolvedValue({ success: false });

    render(<PINEntryScreen />);

    // Make 3 incorrect attempts
    for (let i = 0; i < 3; i++) {
      pressDigits("111111");
      fireEvent.click(screen.getByText("Enter"));
      // Wait for error
      await waitFor(() => {
        expect(screen.getByText(/incorrect PIN/i)).toBeInTheDocument();
      });
    }

    // Attempt #4 should show lock-out
    pressDigits("111111");
    fireEvent.click(screen.getByText("Enter"));

    await waitFor(() => {
      expect(screen.getByText(/locked out/i)).toBeInTheDocument();
    });
    // And we might confirm we cannot enter more digits
    const inputField = screen.getByTestId("pin-input-field") as HTMLInputElement;
    expect(inputField).toBeDisabled();
  });

  test("navigates to Main Menu on successful PIN entry", async () => {
    // mock success
    mockValidatePIN.mockResolvedValueOnce({ success: true });
    const { container } = render(<PINEntryScreen />);

    pressDigits("123456");
    fireEvent.click(screen.getByText("Enter"));

    await waitFor(() => {
      // We'll check that the store isAuthenticated = true, or
      // that the screen content changes to the Main Menu
      const store = useBlueScreenStore.getState();
      expect(store.isAuthenticated).toBe(true);
      // We might also expect some text from the MainMenu to appear
      // or some specific effect that indicates navigation success.
    });
  });

  test("clicking the Cancel button navigates to the Welcome page", async () => {
    render(<PINEntryScreen />);
    const store = useBlueScreenStore.getState();

    // The Cancel button might be in store.buttonBindings[ATMButtons.LEFT_BOTTOM],
    // but if you have a rendered button, you might test it directly:
    act(() => {
      // If we have a real button on the UI, you can do `fireEvent.click(screen.getByText("Cancel"))`
      // If the store-based approach is purely logic, you might do:
      store.buttonBindings[ATMButtons.LowerLeft]?.action?.();
    });

    // Expect the screen to be the WelcomeScreen
    expect(store.screenContent.type.name).toBe("WelcomeScreen");
  });
});
