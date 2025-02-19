import { useEffect } from "react";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { DynamicLabel } from "@/components/DynamicLabel";
import { FONT_SIZES } from "@/types";
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

    setButtonBinding(3, {
      label: "Enter PIN",
      action: () => navigateTo("PINEntryScreen", AccessLevel.AUTHENTICATED),
    });

    setButtonBinding(7, {
      label: "No Card Services",
      action: () => navigateTo("NoCardMenu", AccessLevel.PUBLIC),
    });
  }, [navigateTo, clearButtonBindings, setButtonBinding, setScreenContent]);

  return null;
};
