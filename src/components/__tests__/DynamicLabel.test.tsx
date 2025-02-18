import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DynamicLabel } from "../DynamicLabel";

jest.useFakeTimers();

describe("DynamicLabel", () => {
  const testText = "Hello, ATM!";
  const animationSpeed = 100;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Given a static text", () => {
    it("When the component is rendered, Then it should display immediately", () => {
      render(<DynamicLabel text={testText} animated={false} />);
      expect(screen.getByText(testText)).toBeInTheDocument();
    });
  });

  describe("Given an animated text", () => {
    it("When the component is rendered, Then it should start the typing effect smoothly", () => {
      render(<DynamicLabel text={testText} animated={true} typingSpeed={animationSpeed} />);
      expect(screen.queryByText(testText)).not.toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(animationSpeed * testText.length);
      });

      expect(screen.getByText(testText)).toBeInTheDocument();
    });

    it("When animation typingSpeed is set, Then it should animate at the correct typingSpeed", () => {
      render(<DynamicLabel text={testText} animated={true} typingSpeed={200} />);
      act(() => {
        jest.advanceTimersByTime(200 * testText.length);
      });

      expect(screen.getByText(testText)).toBeInTheDocument();
    });
  });

  describe("Given a masked text", () => {
    it("When the component is rendered, Then it should display '*' for each character in the original text", () => {
      render(<DynamicLabel text="1234" masked={true} />);
      expect(screen.getByText("****")).toBeInTheDocument();
      expect(screen.queryByText("1234")).not.toBeInTheDocument();
    });

    it("When new masked content arrives, Then it should update with the correct number of '*' dynamically", () => {
      const { rerender } = render(<DynamicLabel text="1234" masked={true} />);
      expect(screen.getByText("****")).toBeInTheDocument();

      rerender(<DynamicLabel text="567890" masked={true} />);
      expect(screen.getByText("******")).toBeInTheDocument();
      expect(screen.queryByText("567890")).not.toBeInTheDocument();
    });

    it("When an empty string is given, Then it should display nothing", () => {
      render(<DynamicLabel text="" masked={true} />);
      expect(screen.queryByText("*")).not.toBeInTheDocument();
    });
  });

  describe("Given an ongoing animation", () => {
    it("When new text is set, Then the new text should wait until the current animation completes", () => {
      const { rerender } = render(<DynamicLabel text="Hello" animated={true} typingSpeed={100} />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      rerender(<DynamicLabel text="ATM" animated={true} typingSpeed={100} />);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(screen.getByText("ATM")).toBeInTheDocument();
    });

    it("When animations complete, Then the next message in queue should automatically start animating", () => {
      const { rerender } = render(<DynamicLabel text="First" animated={true} typingSpeed={100} />);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      rerender(<DynamicLabel text="Second" animated={true} typingSpeed={100} />);

      act(() => {
        jest.advanceTimersByTime(600);
      });

      expect(screen.getByText("Second")).toBeInTheDocument();
    });
  });

  describe("Given multiple queued updates", () => {
    it("When all animations complete, Then the component should correctly display the latest update", () => {
      const { rerender } = render(<DynamicLabel text="First" animated={true} typingSpeed={100} />);
      act(() => {
        jest.advanceTimersByTime(500);
      });

      rerender(<DynamicLabel text="Second" animated={true} typingSpeed={100} />);
      act(() => {
        jest.advanceTimersByTime(500);
      });

      rerender(<DynamicLabel text="Final" animated={true} typingSpeed={100} />);
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(screen.getByText("Final")).toBeInTheDocument();
    });
  });

  describe("Given an update arrives before the previous animation finishes", () => {
    it("When the first animation ends, Then the next queued text should begin", () => {
      const { rerender } = render(<DynamicLabel text="First" animated={true} typingSpeed={100} />);
      act(() => {
        jest.advanceTimersByTime(300);
      });

      rerender(<DynamicLabel text="Second" animated={true} typingSpeed={100} />);

      act(() => {
        jest.advanceTimersByTime(300);
      });

      act(() => {
        jest.advanceTimersByTime(600);
      });

      expect(screen.getByText("Second")).toBeInTheDocument();
    });
  });

  describe("Given async updates", () => {
    it("When another text update arrives, Then it should start immediately after the previous animation", () => {
      const { rerender } = render(
        <DynamicLabel text="Loading..." animated={true} typingSpeed={50} />,
      );
      act(() => {
        jest.advanceTimersByTime(400);
      });

      rerender(<DynamicLabel text="Success!" animated={true} typingSpeed={50} />);
      act(() => {
        jest.advanceTimersByTime(400);
      });

      expect(screen.getByText("Success!")).toBeInTheDocument();
    });
  });
});
