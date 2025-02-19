import { useEffect } from "react";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { DynamicLabel } from "@/components/DynamicLabel";
import { ATMButtons, FONT_SIZES } from "@/types";
import { AccessLevel } from "@/types/auth.types";
import { PINEntryScreen } from "../PINEntryScreen";

export const WelcomeScreen = (): null => {
  const { navigateTo, clearButtonBindings, setButtonBinding, setScreenContent, setFullScreen } =
    useBlueScreenStore();

  useEffect(() => {
    setFullScreen(false);
    clearButtonBindings();
    setScreenContent(
      <DynamicLabel animated size={FONT_SIZES.lg}>
        Welcome to the ATM
      </DynamicLabel>,
    );

    setButtonBinding(ATMButtons.LowerRight, {
      label: "Enter PIN",
      action: () => navigateTo(<PINEntryScreen />, AccessLevel.PUBLIC),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigateTo, clearButtonBindings, setButtonBinding, setScreenContent]);

  return null;
};
