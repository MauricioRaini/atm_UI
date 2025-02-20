import React, { ReactElement, useEffect, useState } from "react";
import { ATMButtons, FONT_SIZES } from "@/types";
import { AccessLevel, PIN_DIGITS } from "@/types/auth.types";
import { InputField } from "@/components/InputField";
import { WelcomeScreen } from "@/views/WelcomeScreen/WelcomeScreen";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { NumericKeyboard } from "@/components/NumericKeyboard/NumericKeyboard";
import { validatePIN } from "@/services";
import { MainMenu } from "../MainMenu";
import { DynamicLabel } from "@/components";
import "./PINEntry.css";
import { MAXIMUM_ATTEMPTS, MINIMUM_ATTEMPTS } from "@/constants/Timer.constants";
import { useFinancialStore } from "@/store";

export const PINEntryScreen: React.FC = (): ReactElement => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const {
    setButtonBinding,
    navigateTo,
    setAuth,
    clearButtonBindings,
    setFullScreen,
    blockUser,
    setUserId,
  } = useBlueScreenStore();

  const { fetchUser } = useFinancialStore();

  useEffect(() => {
    setFullScreen(true);
    clearButtonBindings();
    setButtonBinding(ATMButtons.LowerLeft, {
      label: "Cancel",
      action: () => navigateTo(<WelcomeScreen />, AccessLevel.PUBLIC),
    });
    console.log(attempts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNumberPress = (num: number) => {
    if (pin.length >= PIN_DIGITS) return;
    setPin((prev) => prev + String(num));
    setError(null);
  };

  const handleClearPress = () => {
    setPin("");
    setError(null);
  };

  /* TODO: Refactor this handler into a single responsibility function, it is doing way too much things. */
  const handleEnterPress = async () => {
    if (pin.length < PIN_DIGITS) return;

    try {
      const result = await validatePIN(pin);
      if (result.success && result.userId) {
        setPin("");
        setUserId(result.userId);
        setError(null);
        setAttempts(0);
        setAuth(true);
        await fetchUser();
        setFullScreen(false);
        navigateTo(<MainMenu />, AccessLevel.AUTHENTICATED);
      } else {
        setError("Incorrect PIN");
        setPin("");
        setAttempts((prev) => {
          const newAttempts = prev + MINIMUM_ATTEMPTS;
          if (newAttempts >= MAXIMUM_ATTEMPTS) {
            blockUser();
            clearButtonBindings();
          }
          return newAttempts;
        });
      }
    } catch (error) {
      setError("Server Error - Please try again later");
      throw new Error(error as string);
    }
  };

  const onInputChange = (value: string) => {
    if (value.length <= PIN_DIGITS) {
      setPin(value);
      setError(null);
    }
  };

  return (
    <div className="pin-entry-screen">
      <div className="pin-main-container">
        <DynamicLabel preselected size={FONT_SIZES.xs}>
          {error ? error : "Please enter your 6 digits PIN"}
        </DynamicLabel>
        <InputField
          value={pin}
          onChange={onInputChange}
          onEnter={handleEnterPress}
          maxLength={PIN_DIGITS}
          error={!!error}
          data-testid="pin-input-field"
          masked
          disabled
        />
        <div className="keyboard-container-pin-entry">
          <NumericKeyboard
            onNumberPress={handleNumberPress}
            onEnterPress={handleEnterPress}
            onClearPress={handleClearPress}
          />
        </div>
      </div>
    </div>
  );
};
