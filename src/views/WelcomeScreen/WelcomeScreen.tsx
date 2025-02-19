import { useEffect } from "react";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { DynamicLabel } from "@/components/DynamicLabel";
import { ATMButtons, FONT_SIZES } from "@/types";
import { AccessLevel } from "@/types/auth.types";

export const WelcomeScreen = () => {
  const { navigateTo, clearButtonBindings, setButtonBinding, setScreenContent } =
    useBlueScreenStore();

  useEffect(() => {
    clearButtonBindings();

    setScreenContent(
      <DynamicLabel animated size={FONT_SIZES.lg}>
        Welcome to the ATM
      </DynamicLabel>,
    );

    setButtonBinding(ATMButtons.LowerRight, {
      label: "Enter PIN",
      action: () => navigateTo("PINEntryScreen", AccessLevel.AUTHENTICATED),
    });

    setButtonBinding(ATMButtons.LowerLeft, {
      label: "No Card Services",
      action: () => navigateTo("NoCardMenu", AccessLevel.PUBLIC),
    });
  }, [navigateTo, clearButtonBindings, setButtonBinding, setScreenContent]);

  return null;
};
