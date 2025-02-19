import { useEffect } from "react";
import { ATMButton } from "@/components/ATMButton";
import "./NumericKeyboard.css";

export type NumericKeyboardProps = {
  onNumberPress: (num: number) => void;
  onEnterPress: () => void;
  onClearPress: () => void;
};

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

export const NumericKeyboard = ({
  onNumberPress,
  onEnterPress,
  onClearPress,
}: NumericKeyboardProps) => {
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
    <div className="numeric-keyboard">
      <div className="number-grid">
        {numbers.map((num) => (
          <ATMButton key={num} label={String(num)} onClick={() => onNumberPress(num)} hidePath />
        ))}
      </div>

      <div className="bottom-buttons">
        <ATMButton label="Enter" onClick={onEnterPress} hidePath />
        <ATMButton label="Clear" onClick={onClearPress} hidePath />
      </div>
    </div>
  );
};
