import { useState, useEffect } from "react";
import "./InputField.css";

export type InputFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  maxLength?: number;
  error?: boolean;
};

export const InputField = ({
  value,
  onChange,
  onEnter,
  maxLength = 10,
  error = false,
}: InputFieldProps) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(/\D/g, "");
    if (newValue !== inputValue) {
      setInputValue(newValue.slice(0, maxLength));
      onChange(newValue.slice(0, maxLength));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && onEnter) {
      onEnter();
    }
  };

  return (
    <input
      type="text"
      className={`inputField ${error ? "error" : ""}`}
      value={inputValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      maxLength={maxLength}
      data-testid="input-field"
    />
  );
};
