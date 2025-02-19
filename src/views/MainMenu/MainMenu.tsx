import { DynamicLabel } from "@/components/DynamicLabel";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { AccessLevel, ATMButtons, FONT_SIZES } from "@/types";
import { useEffect } from "react";
import { PINEntryScreen } from "../PINEntryScreen";
import { WelcomeScreen } from "../WelcomeScreen";

export const MainMenu = () => {
  const { navigateTo, clearButtonBindings, setButtonBinding, setScreenContent, setFullScreen } =
    useBlueScreenStore();

  useEffect(() => {
    setFullScreen(false);
    clearButtonBindings();
    setScreenContent(
      <DynamicLabel animated size={FONT_SIZES.sm}>
        Hi Peter Parker! Please make a choice...
      </DynamicLabel>,
    );

    setButtonBinding(ATMButtons.MiddleBottomLeft, {
      label: "Withdraw",
      action: () => navigateTo("Withdraw", AccessLevel.AUTHENTICATED),
    });

    setButtonBinding(ATMButtons.LowerLeft, {
      label: "Deposit",
      action: () => navigateTo("Deposit", AccessLevel.AUTHENTICATED),
    });

    setButtonBinding(ATMButtons.MiddleTopRight, {
      label: "Exit",
      action: () => navigateTo(<WelcomeScreen />, AccessLevel.PUBLIC),
    });

    setButtonBinding(ATMButtons.MiddleBottomRight, {
      label: "Balance",
      action: () => navigateTo("Balance", AccessLevel.AUTHENTICATED),
    });
    setButtonBinding(ATMButtons.LowerRight, {
      label: "Re-Enter PIN",
      action: () => navigateTo(<PINEntryScreen />, AccessLevel.PUBLIC),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigateTo, clearButtonBindings, setButtonBinding, setScreenContent]);

  return null;
};
