import { useEffect } from "react";

export type ATMButtonProps = {
  label: string;
  onClick: () => void;
  keyBinding?: string;
};

export const ATMButton = ({ label, onClick, keyBinding }: ATMButtonProps) => {
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
    <button className="atm-button" onClick={onClick} data-testid="atm-button">
      {label}
    </button>
  );
};
