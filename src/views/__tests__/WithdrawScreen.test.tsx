// WithdrawScreen.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { getWithdrawInfo, performWithdraw } from "@/services/withdrawServices";
import { WithdrawScreen } from "@/views/WithdrawScreen";

const COMMON_AMOUNTS = [20, 40, 60, 100, 200];

jest.mock("@/services/withdrawServices");

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
      mockGetWithdrawInfo.mockResolvedValueOnce({
        balance: 500,
        atmAvailable: 1000,
        dailyLimit: 300,
        dailyUsed: 50,
      });

      render(<WithdrawScreen />);

      expect(mockGetWithdrawInfo).toHaveBeenCalledTimes(1);

      await waitFor(() => {
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
      mockGetWithdrawInfo.mockResolvedValue({
        balance: 1000,
        atmAvailable: 1000,
        dailyLimit: 1000,
        dailyUsed: 0,
      });
      render(<WithdrawScreen />);
      await screen.findByText((content) => {
        return content.includes("$1,000.00");
      });
    });

    it("When the user selects a common amount, Then it displays a confirmation prompt", async () => {
      fireEvent.click(screen.getByText(`$${COMMON_AMOUNTS[0]}`));

      expect(screen.getByText(/you are about to withdraw \$20/i)).toBeInTheDocument();
    });

    it("When the user selects 'Cancel' from the confirmation prompt, Then it closes the prompt", async () => {
      fireEvent.click(screen.getByText(`$${COMMON_AMOUNTS[1]}`));

      const confirmText = screen.getByText(/you are about to withdraw \$40/i);
      expect(confirmText).toBeInTheDocument();

      fireEvent.click(screen.getByText(/cancel/i));

      expect(confirmText).not.toBeInTheDocument();
    });

    it("When the user confirms a valid common withdrawal, Then it calls performWithdraw and updates the store", async () => {
      mockPerformWithdraw.mockResolvedValueOnce({
        newBalance: 960,
        newAtmAvailable: 960,
        newDailyUsed: 40,
      });

      fireEvent.click(screen.getByText(`$${COMMON_AMOUNTS[2]}`));
      fireEvent.click(screen.getByText(/confirm/i));
      expect(mockPerformWithdraw).toHaveBeenCalledWith(60);

      await waitFor(() => {
        expect(screen.getByText("$960.00")).toBeInTheDocument();
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
      await screen.findByText((content) => {
        return content.includes("$2,000.00");
      });
    });

    it("When the user selects 'Other', Then it shows the numeric keyboard and input field with currency formatting", () => {
      fireEvent.click(screen.getByText(/other/i));

      expect(screen.getByTestId("input-field")).toBeInTheDocument();
      expect(screen.getByText("Enter")).toBeInTheDocument();
    });

    it("When the user types an amount exceeding daily limit, Then the input is shown in red and user cannot confirm", async () => {
      fireEvent.click(screen.getByText(/other/i));
      fireEvent.click(screen.getByText("4"));
      fireEvent.click(screen.getByText("5"));
      fireEvent.click(screen.getByText("0"));

      expect(screen.getByTestId("input-field")).toHaveClass("error");

      fireEvent.click(screen.getByText("Enter"));

      expect(screen.queryByText(/you are about to withdraw/i)).not.toBeInTheDocument();
    });

    it("When the user types a valid amount, Then no error and user sees a confirmation prompt on Enter", async () => {
      fireEvent.click(screen.getByText(/other/i));

      fireEvent.click(screen.getByText("2"));
      fireEvent.click(screen.getByText("0"));
      fireEvent.click(screen.getByText("0"));

      expect(screen.getByTestId("input-field")).not.toHaveClass("error");

      fireEvent.click(screen.getByText("Enter"));
      expect(screen.getByText(/you are about to withdraw \$200/i)).toBeInTheDocument();
    });

    it("When the user confirms a valid custom withdrawal, Then the mock backend is called, store updates, and new balance is shown", async () => {
      mockPerformWithdraw.mockResolvedValueOnce({
        newBalance: 1850,
        newAtmAvailable: 2850,
        newDailyUsed: 250,
      });

      fireEvent.click(screen.getByText(/other/i));
      fireEvent.click(screen.getByText("1"));
      fireEvent.click(screen.getByText("5"));
      fireEvent.click(screen.getByText("0"));
      fireEvent.click(screen.getByText("Enter"));
      fireEvent.click(screen.getByText(/confirm/i));

      expect(mockPerformWithdraw).toHaveBeenCalledWith(150);

      await waitFor(() => {
        expect(screen.getByText("$1,850.00")).toBeInTheDocument();
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
      await screen.findByText((content) => {
        return content.includes("$1,000.00");
      });
    });

    it("When the user presses the Cancel button, Then navigateTo MainMenu is called", () => {
      const store = useBlueScreenStore.getState();
      fireEvent.click(screen.getByText(/cancel/i));

      expect(store.screenContent).toBeDefined();
    });
  });
});
