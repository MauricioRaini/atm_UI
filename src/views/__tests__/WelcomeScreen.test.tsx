import { renderHook, act, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { WelcomeScreen } from "../WelcomeScreen/WelcomeScreen";
import { PINEntryScreen } from "../PINEntryScreen/PINEntryScreen";

describe("🏦 Welcome Screen", () => {
  beforeEach(() => {
    act(() => {
      useBlueScreenStore.setState({
        screenContent: <WelcomeScreen />,
        buttonBindings: {},
        isAuthenticated: false,
      });
    });
  });

  it.skip("✅ Should navigate to PIN Entry when 'Enter PIN' is clicked", () => {
    render(<WelcomeScreen />);
    const { result } = renderHook(() => useBlueScreenStore());

    act(() => {
      result.current.buttonBindings[6]?.action?.();
    });

    expect(result.current.screenContent).toEqual(<PINEntryScreen />);
  });

  it.skip("✅ Should navigate to No Card Services when 'No Card Services' is clicked", () => {
    render(<WelcomeScreen />);
    const { result } = renderHook(() => useBlueScreenStore());

    act(() => {
      result.current.buttonBindings[7]?.action?.();
    });
  });
});
