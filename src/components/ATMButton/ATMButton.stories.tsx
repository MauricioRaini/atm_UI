import { ATMButton, ATMButtonProps } from "./ATMButton";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<ATMButtonProps> = {
  title: "ATM/ATMButton",
  component: ATMButton,
  args: {
    label: "",
    isLeftButton: true,
    onClick: () => alert("Button clicked!"),
  },
};
export default meta;

type Story = StoryObj<ATMButtonProps>;

export const Default: Story = {
  args: {
    keyBinding: '"Enter"\n\n\n',
  },
};

export const RightSideButton: Story = {
  args: {
    isLeftButton: false,
  },
};

export const WithKeyBinding: Story = {
  args: {
    keyBinding: "Enter",
  },
};
