import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NumericKeyboard } from "./NumericKeyboard";
import { DynamicLabel } from "@/components/DynamicLabel";
import { FONT_SIZES } from "@/types";

const meta: Meta<typeof NumericKeyboard> = {
  title: "ATM/Numeric Keyboard",
  component: NumericKeyboard,
  parameters: {
    backgrounds: { default: "purpleBackground" },
  },
};
export default meta;

type Story = StoryObj<typeof NumericKeyboard>;

const NumericKeyboardWrapper = () => {
  const [enteredValue, setEnteredValue] = useState("");

  const handleNumberPress = (num: number) => {
    if (enteredValue.length < 4) {
      setEnteredValue((prev) => prev + num.toString());
    }
  };

  const handleEnterPress = () => {
    alert(`Entered PIN: ${enteredValue}`);
    setEnteredValue("");
  };

  const handleClearPress = () => {
    setEnteredValue("");
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <DynamicLabel animated size={FONT_SIZES.lg}>
        {enteredValue ? `Entered: ${enteredValue}` : "Enter your PIN"}
      </DynamicLabel>

      <NumericKeyboard
        onNumberPress={handleNumberPress}
        onEnterPress={handleEnterPress}
        onClearPress={handleClearPress}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <NumericKeyboardWrapper />,
};
