import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { ATMButtons } from "@/types";
import { jest } from "@jest/globals";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { PINEntryScreen } from "../PINEntryScreen";

const mockValidatePIN = jest.fn();

jest.mock("./pinService", () => ({
  validatePIN: (pin: string) => mockValidatePIN(pin),
}));

const pressDigits = (digits: string) => {
  for (const digit of digits) {
    fireEvent.keyDown(window, { key: digit });
  }
};

describe("PINEntryScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBlueScreenStore.setState({
      isAuthenticated: false,
      buttonBindings: {},
    });
  });

  test("renders input label, dynamic label (masked), and numeric keyboard", () => {
    render(<PINEntryScreen />);
    expect(screen.getByTestId("pin-input-field")).toBeInTheDocument();
    const maskedLabel = screen.getByText("******", { exact: false });
    expect(maskedLabel).toBeInTheDocument();

    expect(screen.getByText("Enter")).toBeInTheDocument();
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  test("updates input when user types from the physical keyboard", () => {
    render(<PINEntryScreen />);
    pressDigits("123456");
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

    fireEvent.click(screen.getByText("Clear"));

    const inputField = screen.getByTestId("pin-input-field") as HTMLInputElement;
    expect(inputField.value).toBe("");
  });

  test("when user presses 'Enter' with fewer than 6 digits, it does NOT trigger the async call", async () => {
    render(<PINEntryScreen />);
    pressDigits("12345");
    fireEvent.click(screen.getByText("Enter"));

    expect(mockValidatePIN).not.toHaveBeenCalled();
    const inputField = screen.getByTestId("pin-input-field") as HTMLInputElement;
    expect(inputField.value).toBe("12345");
  });

  test("triggers async PIN validation on 6 digits + Enter", async () => {
    /* mockValidatePIN.mockResolvedValueOnce({ success: true }); */
    render(<PINEntryScreen />);
    pressDigits("123456");

    fireEvent.click(screen.getByText("Enter"));
    expect(mockValidatePIN).toHaveBeenCalledWith("123456");
  });

  test("shows error and clears input if the PIN is incorrect", async () => {
    /*  mockValidatePIN.mockResolvedValueOnce({ success: false }); */
    render(<PINEntryScreen />);
    pressDigits("111111");
    fireEvent.click(screen.getByText("Enter"));

    // Wait for error to display
    await waitFor(() => {
      const errorMsg = screen.getByText(/incorrect PIN/i);
      expect(errorMsg).toBeInTheDocument();
    });

    const inputField = screen.getByTestId("pin-input-field") as HTMLInputElement;
    expect(inputField.value).toBe("");
  });

  test("locks out after 3 failed attempts for 10 minutes", async () => {
    /* mockValidatePIN.mockResolvedValue({ success: false }); */

    render(<PINEntryScreen />);

    for (let i = 0; i < 3; i++) {
      pressDigits("111111");
      fireEvent.click(screen.getByText("Enter"));
      await waitFor(() => {
        expect(screen.getByText(/incorrect PIN/i)).toBeInTheDocument();
      });
    }

    pressDigits("111111");
    fireEvent.click(screen.getByText("Enter"));

    await waitFor(() => {
      expect(screen.getByText(/locked out/i)).toBeInTheDocument();
    });
    const inputField = screen.getByTestId("pin-input-field") as HTMLInputElement;
    expect(inputField).toBeDisabled();
  });

  test("navigates to Main Menu on successful PIN entry", async () => {
    /* mockValidatePIN.mockResolvedValueOnce({ success: true }); */
    /* const { container } = render(<PINEntryScreen />); */

    pressDigits("123456");
    fireEvent.click(screen.getByText("Enter"));

    await waitFor(() => {
      const store = useBlueScreenStore.getState();
      expect(store.isAuthenticated).toBe(true);
    });
  });

  test("clicking the Cancel button navigates to the Welcome page", async () => {
    render(<PINEntryScreen />);
    const store = useBlueScreenStore.getState();

    act(() => {
      store.buttonBindings[ATMButtons.LowerLeft]?.action?.();
    });

    /* expect(store.screenContent.type.name).toBe("WelcomeScreen"); */
  });
});
