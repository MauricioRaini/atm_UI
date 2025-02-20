import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Timer } from "../Timer";

jest.useFakeTimers();

describe("Timer Component", () => {
  const mockOnTimeout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Given the Timer component", () => {
    it("When rendered, Then it should start counting down from the given timeToLive value", () => {
      render(<Timer timeToLive={60} onTimeout={mockOnTimeout} />);
      expect(screen.getByText("1:00")).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByText("0:59")).toBeInTheDocument();
    });

    it("When the timer reaches 0, Then it should trigger the onTimeout function", () => {
      render(<Timer timeToLive={3} onTimeout={mockOnTimeout} />);

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(mockOnTimeout).toHaveBeenCalledTimes(1);
    });

    it("When a new timeToLive value is received, Then the countdown should reset", () => {
      const { rerender } = render(<Timer timeToLive={60} onTimeout={mockOnTimeout} />);
      expect(screen.getByText("1:00")).toBeInTheDocument();

      rerender(<Timer timeToLive={90} onTimeout={mockOnTimeout} />);
      expect(screen.getByText("1:30")).toBeInTheDocument();
    });

    it("When the countdown reaches 30 seconds, Then it should change text color and show a toast message", () => {
      render(<Timer timeToLive={31} onTimeout={mockOnTimeout} />);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByText("0:30")).toHaveClass("warning");
      expect(screen.getByText("Session will expire soon")).toBeInTheDocument();
    });

    it("When forceTimeout() is called, Then it should trigger an immediate logout", () => {
      const { getByTestId } = render(<Timer timeToLive={60} onTimeout={mockOnTimeout} />);
      act(() => {
        getByTestId("force-timeout-button").click();
      });

      expect(mockOnTimeout).toHaveBeenCalledTimes(1);
    });

    it("The timer should not reset unless a new timeToLive is received", () => {
      render(<Timer timeToLive={60} onTimeout={mockOnTimeout} />);
      act(() => {
        jest.advanceTimersByTime(30000);
      });

      expect(screen.getByText("0:30")).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(screen.getByText("0:29")).toBeInTheDocument();
    });
  });
});
