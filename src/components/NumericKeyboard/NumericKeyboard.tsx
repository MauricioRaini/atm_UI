import { useEffect, useMemo, memo } from "react";
import { ATMButton } from "@/components/ATMButton";
import "./NumericKeyboard.css";

export type NumericKeyboardProps = {
  onNumberPress: (num: number) => void;
  onEnterPress: () => void;
  onClearPress: () => void;
};

export const NumericKeyboard = memo(
  ({ onNumberPress, onEnterPress, onClearPress }: NumericKeyboardProps) => {
    const numberKeys = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], []);

    useEffect(() => {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key >= "0" && event.key <= "9") {
          onNumberPress(Number(event.key));
        } else if (event.key === "Enter") {
          onEnterPress();
        } else if (event.key === "Backspace") {
          onClearPress();
        }
      };

      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }, [onNumberPress, onEnterPress, onClearPress]);

    return (
      <div className="keyboard-container">
        <div className="numeric-keyboard">
          <div className="number-grid">
            {numberKeys.map((num) => (
              <ATMButton
                key={num}
                label={String(num)}
                onClick={() => onNumberPress(num)}
                hidePath
              />
            ))}
            <ATMButton label="Clear" onClick={onClearPress} hidePath />
            <ATMButton label="Enter" onClick={onEnterPress} hidePath />
          </div>
        </div>
      </div>
    );
  },
);
