import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ATM } from "../ATM";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { ATMButtons } from "@/types";

/* TODO: Verify profoundly this test suite when Jest bug with assets get solved as it is now outdated to the functionality. */
describe("ATM Machine Component", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockWithdraw: () => void, mockDeposit: () => void, mockBalance: () => void, store: any;

  beforeEach(() => {
    mockWithdraw = jest.fn();
    mockDeposit = jest.fn();
    mockBalance = jest.fn();
    store = useBlueScreenStore.getState();
    store.clearButtonBindings();
  });

  describe("Given the ATM renders", () => {
    it("When rendered, Then it should display all static elements", () => {
      render(<ATM />);
      expect(screen.getByTestId("atm-container")).toBeInTheDocument();
      expect(screen.getByTestId("blue-screen")).toBeInTheDocument();
      expect(screen.getAllByTestId("atm-button")).toHaveLength(8);
    });

    it("When no functions are bound, Then buttons should be inactive", () => {
      render(<ATM />);
      const buttons = screen.getAllByTestId("atm-button");
      buttons.forEach((button) => fireEvent.click(button));

      expect(mockWithdraw).not.toHaveBeenCalled();
      expect(mockDeposit).not.toHaveBeenCalled();
      expect(mockBalance).not.toHaveBeenCalled();
    });
  });

  describe("Given functions are dynamically bound", () => {
    it("When a function is bound to a button, Then clicking it should trigger only that function", () => {
      store.setButtonBinding(ATMButtons.UpperLeft, { label: "Withdraw", action: mockWithdraw });
      store.setButtonBinding(ATMButtons.MiddleTopLeft, { label: "Deposit", action: mockDeposit });

      render(<ATM />);

      fireEvent.click(screen.getByText("Withdraw"));
      fireEvent.click(screen.getByText("Deposit"));

      expect(mockWithdraw).toHaveBeenCalledTimes(1);
      expect(mockDeposit).toHaveBeenCalledTimes(1);
      expect(mockBalance).not.toHaveBeenCalled();
    });

    it("When clicking an unbound button, Then no function should trigger", () => {
      store.setButtonBinding(ATMButtons.UpperLeft, { label: "Withdraw", action: mockWithdraw });

      render(<ATM />);

      fireEvent.click(screen.getByText("Withdraw"));
      fireEvent.click(screen.getAllByTestId("atm-button")[3]);

      expect(mockWithdraw).toHaveBeenCalledTimes(1);
      expect(mockDeposit).not.toHaveBeenCalled();
      expect(mockBalance).not.toHaveBeenCalled();
    });

    it("When a new function is bound to an already bound button, Then the previous function should be removed", () => {
      store.setButtonBinding(ATMButtons.UpperLeft, { label: "Withdraw", action: mockWithdraw });

      render(<ATM />);
      fireEvent.click(screen.getByText("Withdraw"));
      expect(mockWithdraw).toHaveBeenCalledTimes(1);

      store.setButtonBinding(ATMButtons.UpperLeft, { label: "Balance", action: mockBalance });

      fireEvent.click(screen.getByText("Balance"));
      expect(mockBalance).toHaveBeenCalledTimes(1);
      expect(mockWithdraw).toHaveBeenCalledTimes(1);
    });

    it("When a function is removed, Then its label and action should disappear", () => {
      store.setButtonBinding(ATMButtons.UpperLeft, { label: "Withdraw", action: mockWithdraw });

      render(<ATM />);
      expect(screen.getByText("Withdraw")).toBeInTheDocument();

      store.setButtonBinding(ATMButtons.UpperLeft, {});

      expect(screen.queryByText("Withdraw")).not.toBeInTheDocument();
    });

    it("When the screen changes, Then all previous bindings should reset", () => {
      store.setButtonBinding(ATMButtons.UpperLeft, { label: "Withdraw", action: mockWithdraw });

      render(<ATM />);
      fireEvent.click(screen.getByText("Withdraw"));
      expect(mockWithdraw).toHaveBeenCalledTimes(1);

      store.clearButtonBindings();
      expect(screen.queryByText("Withdraw")).not.toBeInTheDocument();
    });
  });

  describe("Given a composable screen is provided via store", () => {
    it("When a component is set, Then it should render inside the BlueScreen", () => {
      render(<ATM />);
      store.setScreenContent(<h1 data-testid="screen-content">Welcome</h1>);

      expect(screen.getByTestId("screen-content")).toHaveTextContent("Welcome");
    });

    it("When the screen updates, Then the new content should replace the previous one", () => {
      render(<ATM />);

      store.setScreenContent(<h1>Screen 1</h1>);
      expect(screen.getByText("Screen 1")).toBeInTheDocument();

      store.setScreenContent(<h1>Screen 2</h1>);
      expect(screen.queryByText("Screen 1")).not.toBeInTheDocument();
      expect(screen.getByText("Screen 2")).toBeInTheDocument();
    });
  });
});
