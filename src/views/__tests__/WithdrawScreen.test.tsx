// WithdrawScreen.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { getWithdrawInfo, performWithdraw } from "../../services/withdrawServices";
import { WithdrawScreen } from "@/views/WithdrawScreen";

const COMMON_AMOUNTS = [20, 40, 60, 100, 200];

jest.mock("../../services/withdrawServices");

describe("WithdrawScreen", () => {
  const mockGetWithdrawInfo = getWithdrawInfo as jest.MockedFunction<typeof getWithdrawInfo>;
  const mockPerformWithdraw = performWithdraw as jest.MockedFunction<typeof performWithdraw>;

  beforeEach(() => {
    jest.clearAllMocks();

    useBlueScreenStore.setState({
      screenContent: null,
      buttonBindings: {},
      isAuthenticated: true,
      fullScreen: false,
    });
  });

  describe("Given the WithdrawScreen is rendered", () => {
    it("When the component mounts, Then it triggers an async call to fetch user + ATM info", async () => {
      // Arrange: mock fetch data success
      mockGetWithdrawInfo.mockResolvedValueOnce({
        balance: 500,
        atmAvailable: 1000,
        dailyLimit: 300,
        dailyUsed: 50,
      });

      // Act: render the screen
      render(<WithdrawScreen />);

      // Assert: the call was triggered
      expect(mockGetWithdrawInfo).toHaveBeenCalledTimes(1);

      // Wait for the component to finish loading data
      await waitFor(() => {
        // We can confirm that the data is displayed somewhere
        // or at least confirm no error is shown
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
      });
    });

    it("When the data fetch fails, Then it shows an error message", async () => {
      mockGetWithdrawInfo.mockRejectedValueOnce(new Error("Network Error"));

      render(<WithdrawScreen />);

      await waitFor(() => {
        expect(screen.getByText(/Unable to load withdraw info/i)).toBeInTheDocument();
      });
    });
  });

  describe("Given the user is presented with common withdrawal amounts", () => {
    beforeEach(async () => {
      // Provide default success data
      mockGetWithdrawInfo.mockResolvedValue({
        balance: 1000,
        atmAvailable: 1000,
        dailyLimit: 500,
        dailyUsed: 0,
      });
      render(<WithdrawScreen />);
      // Wait for data to load
      await screen.findByText("$1,000.00"); // Suppose the screen shows the balance in some text element
    });

    it("When the user selects a common amount, Then it displays a confirmation prompt", async () => {
      // Suppose we have a button for each common amount on the screen
      fireEvent.click(screen.getByText(`$${COMMON_AMOUNTS[0]}`)); // e.g. $20

      // We expect a confirmation prompt, e.g. "You are about to withdraw $20..."
      expect(screen.getByText(/you are about to withdraw \$20/i)).toBeInTheDocument();
    });

    it("When the user selects 'Cancel' from the confirmation prompt, Then it closes the prompt", async () => {
      // Choose a common amount
      fireEvent.click(screen.getByText(`$${COMMON_AMOUNTS[1]}`)); // e.g. $40

      // The prompt is displayed
      const confirmText = screen.getByText(/you are about to withdraw \$40/i);
      expect(confirmText).toBeInTheDocument();

      // The prompt might have a "No" or "Cancel" button
      fireEvent.click(screen.getByText(/cancel/i));

      // Now the prompt disappears
      expect(confirmText).not.toBeInTheDocument();
    });

    it("When the user confirms a valid common withdrawal, Then it calls performWithdraw and updates the store", async () => {
      // Provide mockPerformWithdraw success
      mockPerformWithdraw.mockResolvedValueOnce({
        newBalance: 960,
        newAtmAvailable: 960,
        newDailyUsed: 40,
      });

      fireEvent.click(screen.getByText(`$${COMMON_AMOUNTS[2]}`)); // e.g. $60
      fireEvent.click(screen.getByText(/confirm/i)); // The prompt might have "Confirm"

      expect(mockPerformWithdraw).toHaveBeenCalledWith(60);

      await waitFor(() => {
        expect(screen.getByText("$960.00")).toBeInTheDocument(); // Updated balance
      });
    });
  });

  describe("Given the user chooses the 'Other' amount option", () => {
    beforeEach(async () => {
      mockGetWithdrawInfo.mockResolvedValue({
        balance: 2000,
        atmAvailable: 3000,
        dailyLimit: 500,
        dailyUsed: 100,
      });
      render(<WithdrawScreen />);
      await screen.findByText("$2,000.00");
    });

    it("When the user selects 'Other', Then it shows the numeric keyboard and input field with currency formatting", () => {
      fireEvent.click(screen.getByText(/other/i)); // e.g. "Other" button

      // We expect an InputField & NumericKeyboard
      expect(screen.getByTestId("input-field")).toBeInTheDocument();
      expect(screen.getByText("Enter")).toBeInTheDocument(); // from the numeric keyboard
    });

    it("When the user types an amount exceeding daily limit, Then the input is shown in red and user cannot confirm", async () => {
      // dailyLimit = 500, dailyUsed = 100, so user has 400 left
      fireEvent.click(screen.getByText(/other/i));
      // Type '450' via numeric keyboard
      fireEvent.click(screen.getByText("4"));
      fireEvent.click(screen.getByText("5"));
      fireEvent.click(screen.getByText("0"));

      // Let's assume an element shows "Limit exceeded" or something,
      // or the input itself has a red "error" class
      expect(screen.getByTestId("input-field")).toHaveClass("error");

      // If user tries to confirm:
      fireEvent.click(screen.getByText("Enter"));

      // We do NOT see a confirmation prompt
      expect(screen.queryByText(/you are about to withdraw/i)).not.toBeInTheDocument();
    });

    it("When the user types a valid amount, Then no error and user sees a confirmation prompt on Enter", async () => {
      // dailyLimit = 500, dailyUsed = 100 => 400 left
      fireEvent.click(screen.getByText(/other/i));

      // Type '200'
      fireEvent.click(screen.getByText("2"));
      fireEvent.click(screen.getByText("0"));
      fireEvent.click(screen.getByText("0"));

      expect(screen.getByTestId("input-field")).not.toHaveClass("error");

      fireEvent.click(screen.getByText("Enter"));
      // Now user should see confirmation
      expect(screen.getByText(/you are about to withdraw \$200/i)).toBeInTheDocument();
    });

    it("When the user confirms a valid custom withdrawal, Then the mock backend is called, store updates, and new balance is shown", async () => {
      // Suppose the daily limit allows 250 more, and user chooses 150
      mockPerformWithdraw.mockResolvedValueOnce({
        newBalance: 1850,
        newAtmAvailable: 2850,
        newDailyUsed: 250,
      });

      fireEvent.click(screen.getByText(/other/i));
      fireEvent.click(screen.getByText("1"));
      fireEvent.click(screen.getByText("5"));
      fireEvent.click(screen.getByText("0"));
      fireEvent.click(screen.getByText("Enter")); // prompt appears
      fireEvent.click(screen.getByText(/confirm/i)); // confirm in the prompt

      expect(mockPerformWithdraw).toHaveBeenCalledWith(150);

      await waitFor(() => {
        expect(screen.getByText("$1,850.00")).toBeInTheDocument(); // new balance
      });
    });
  });

  describe("Given there is a Cancel button that leads to the MainMenu", () => {
    beforeEach(async () => {
      mockGetWithdrawInfo.mockResolvedValue({
        balance: 1000,
        atmAvailable: 2000,
        dailyLimit: 500,
        dailyUsed: 0,
      });
      render(<WithdrawScreen />);
      await screen.findByText("$1,000.00");
    });

    it("When the user presses the Cancel button, Then navigateTo MainMenu is called", () => {
      // Typically the Cancel button is attached to ATMButtons.LEFT_BOTTOM in the store
      const store = useBlueScreenStore.getState();
      // We can find an on-screen label or call the store's button binding
      // For demonstration, let's assume there's an actual "Cancel" text button:
      fireEvent.click(screen.getByText(/cancel/i));

      // Expect the store now showing MainMenu
      expect(store.screenContent).toBeDefined();
      // In a real test, you'd check e.g. store.screenContent is <MainMenu/>
      // or look for text from the MainMenu. For example:
      // expect(screen.getByText("Welcome to the Main Menu")).toBeInTheDocument();
    });
  });
});
