import React, { useEffect, useState } from "react";
import { ATMButtons } from "@/types";
import { AccessLevel, PIN_DIGITS } from "@/types/auth.types";
import { InputField } from "@/components/InputField";
import { WelcomeScreen } from "@/views/WelcomeScreen/WelcomeScreen";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { NumericKeyboard } from "@/components/NumericKeyboard/NumericKeyboard";
import { validatePIN } from "@/services";

export const PINEntryScreen: React.FC = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<Date | null>(null);

  const { setButtonBinding, navigateTo, setAuth, clearButtonBindings, setFullScreen } =
    useBlueScreenStore();

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

  const isLocked = lockUntil && lockUntil > new Date();

  const handleNumberPress = (num: number) => {
    if (isLocked) return;
    if (pin.length >= PIN_DIGITS) return;
    setPin((prev) => prev + String(num));
    setError(null);
  };

  const handleClearPress = () => {
    if (isLocked) return;
    setPin("");
    setError(null);
  };

  const handleEnterPress = async () => {
    if (isLocked) return;
    if (pin.length < PIN_DIGITS) return;

    try {
      const result = await validatePIN(pin);
      if (result.success) {
        setPin("");
        setError(null);
        setAttempts(0);

        setAuth(true);
        setFullScreen(false);
        navigateTo("<MainMenu />", AccessLevel.PUBLIC);
      } else {
        setError("Incorrect PIN");
        setPin("");
        setAttempts((prev) => {
          const newAttempts = prev + 1;
          if (newAttempts >= 3) {
            const future = new Date();
            future.setMinutes(future.getMinutes() + 10);
            setLockUntil(future);
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
    if (isLocked) return;
    if (value.length <= PIN_DIGITS) {
      setPin(value);
      setError(null);
    }
  };

  return (
    <div className="pin-entry-screen">
      {isLocked ? (
        <div className="locked-message" style={{ color: "red" }}>
          You are locked out for 10 minutes due to too many failed attempts.
        </div>
      ) : (
        <div className="pin-main-container">
          {error && <div className="error-message">{error}</div>}

          <InputField
            value={pin}
            onChange={onInputChange}
            onEnter={handleEnterPress}
            maxLength={PIN_DIGITS}
            error={!!error}
            data-testid="pin-input-field"
            masked
          />

          <NumericKeyboard
            onNumberPress={handleNumberPress}
            onEnterPress={handleEnterPress}
            onClearPress={handleClearPress}
          />
        </div>
      )}
    </div>
  );
};
