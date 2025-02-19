import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { InputField, InputFieldProps } from "./InputField";
import { DynamicLabel } from "../DynamicLabel/DynamicLabel";

const meta: Meta<typeof InputField> = {
  title: "ATM/InputField",
  component: InputField,
  args: {
    value: "",
    maxLength: 10,
    error: false,
  },
  argTypes: {
    value: { control: "text" },
    maxLength: { control: { type: "number", min: 1, max: 20, step: 1 } },
    error: { control: "boolean" },
    onChange: { action: "changed" },
    onEnter: { action: "enterPressed" },
  },
  parameters: {
    backgrounds: { default: "blueScreen" },
  },
};
export default meta;

type Story = StoryObj<typeof InputField>;

const InputWrapper = (props: { label: string } & InputFieldProps) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="flex flex-col items-center space-y-2 bg-screen p-4 w-80">
      <DynamicLabel preselected>{props.label}</DynamicLabel>
      <InputField {...props} value={inputValue} onChange={setInputValue} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <InputWrapper {...args} label="Enter amount" />,
};

export const WithMaxLength: Story = {
  render: (args) => <InputWrapper {...args} label="Enter card number" />,
  args: {
    maxLength: 16,
  },
};

export const WithError: Story = {
  render: (args) => <InputWrapper {...args} label="Incorrect PIN. Try again" />,
  args: {
    error: true,
  },
};

export const WithEnterKeyAction: Story = {
  render: (args) => <InputWrapper {...args} label="Press Enter to continue" />,
  args: {
    onEnter: () => alert("Enter pressed!"),
  },
};
