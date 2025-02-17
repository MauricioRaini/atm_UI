import { useEffect } from "react";
import styles from "./ATMButton.module.css";

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
    <div className={styles.atmButtonContainer}>
      {isLeftButton && <div className={styles.pathToScreen}> </div>}
      <button className={styles.atmButton} onClick={onClick} data-testid="atm-button">
        {label}
      </button>
      {!isLeftButton && <div className={styles.pathToScreen}> </div>}
    </div>
  );
};
