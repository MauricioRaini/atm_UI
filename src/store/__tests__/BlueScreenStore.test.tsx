import { renderHook, act } from "@testing-library/react";
import { useBlueScreenStore } from "../BlueScreenStore";

describe("🛠️ BlueScreen Store", () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useBlueScreenStore.setState({
        screenContent: <h1>Welcome</h1>,
        buttonBindings: {},
        isAuthenticated: false,
      });
    });
  });

  describe("🔹 Given the store initializes", () => {
    it("✅ Then it should have default values", () => {
      const { result } = renderHook(() => useBlueScreenStore());

      expect(result.current.screenContent).toEqual(<h1>Welcome</h1>);
      expect(result.current.buttonBindings).toEqual({});
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("🖥️ Given `setScreenContent` is called", () => {
    it("✅ Then it should update the screen content correctly", () => {
      const { result } = renderHook(() => useBlueScreenStore());

      act(() => {
        result.current.setScreenContent(<h1>New Screen</h1>);
      });

      expect(result.current.screenContent).toEqual(<h1>New Screen</h1>);
    });
  });

  describe("🔑 Given `setAuth` is called", () => {
    it("✅ Then authentication should update correctly", () => {
      const { result } = renderHook(() => useBlueScreenStore());

      act(() => {
        result.current.setAuth(true);
      });

      expect(result.current.isAuthenticated).toBe(true);

      act(() => {
        result.current.setAuth(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("🚪 Given `navigateTo` is called", () => {
    it("✅ When route requires auth, Then it should block navigation if not authenticated", () => {
      const { result } = renderHook(() => useBlueScreenStore());

      act(() => {
        result.current.navigateTo(<h1>Protected</h1>, true);
      });

      expect(result.current.screenContent).not.toEqual(<h1>Protected</h1>);
      expect(result.current.screenContent).toEqual(<h1>Welcome</h1>);
    });

    it("✅ When route requires auth, Then it should allow navigation if isAuthenticated", () => {
      const { result } = renderHook(() => useBlueScreenStore());

      act(() => {
        result.current.setAuth(true);
        result.current.navigateTo(<h1>Protected</h1>, true);
      });

      expect(result.current.screenContent).toEqual(<h1>Protected</h1>);
    });

    it("✅ When route does not require auth, Then it should always navigate", () => {
      const { result } = renderHook(() => useBlueScreenStore());

      act(() => {
        result.current.navigateTo(<h1>Public Screen</h1>, false);
      });

      expect(result.current.screenContent).toEqual(<h1>Public Screen</h1>);
    });
  });

  describe("🔘 Given `setButtonBinding` is called", () => {
    it("✅ Then it should assign a label and function to a button", () => {
      const { result } = renderHook(() => useBlueScreenStore());
      const mockFunction = jest.fn();

      act(() => {
        result.current.setButtonBinding(2, { label: "Withdraw", action: mockFunction });
      });

      expect(result.current.buttonBindings[2]).toEqual({
        label: "Withdraw",
        action: mockFunction,
      });

      act(() => {
        result.current.buttonBindings[2]?.action?.();
      });

      expect(mockFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe("🧹 Given `clearButtonBindings` is called", () => {
    it("✅ Then it should remove all button bindings", () => {
      const { result } = renderHook(() => useBlueScreenStore());

      act(() => {
        result.current.setButtonBinding(2, { label: "Withdraw", action: jest.fn() });
        result.current.setButtonBinding(3, { label: "Deposit", action: jest.fn() });
      });

      expect(Object.keys(result.current.buttonBindings).length).toBe(2);

      act(() => {
        result.current.clearButtonBindings();
      });

      expect(result.current.buttonBindings).toEqual({});
    });
  });
});
