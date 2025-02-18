import { useEffect } from "react";
import "./ATMButton.css";

export type ATMButtonProps = {
  label?: string;
  isLeftButton?: boolean;
  onClick: () => void;
  keyBinding?: string;
};

export const ATMButton = ({ label, isLeftButton = false, onClick, keyBinding }: ATMButtonProps) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (keyBinding && event.key.toLowerCase() === keyBinding.toLowerCase()) {
        onClick();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [keyBinding, onClick]);

  return (
    <div className="atmButtonContainer">
      {isLeftButton && <div className="pathToScreen"> </div>}
      <button className="atmButton" onClick={onClick} data-testid="atm-button">
        {label}
      </button>
      {!isLeftButton && <div className="pathToScreen"> </div>}
    </div>
  );
};
