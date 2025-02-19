import type { Meta, StoryObj } from "@storybook/react";
import { useState, useEffect } from "react";
import { DynamicLabel, DynamicLabelProps } from "./DynamicLabel";
/* TODO: Verify why absolute imports are not detecting the hooks despite the /* config */
import { useCurrencyFormatter } from "../../../hooks/useCurrencyFormatter";

const meta: Meta<typeof DynamicLabel> = {
  title: "ATM/DynamicLabel",
  component: DynamicLabel,
  args: {
    animated: false,
    masked: false,
    typingSpeed: 50,
  },
  argTypes: {
    animated: { control: "boolean" },
    masked: { control: "boolean" },
    typingSpeed: { control: { type: "number", min: 10, max: 300, step: 10 } },
    onAnimationEnd: { action: "animationEnd" },
  },
  parameters: {
    backgrounds: {
      default: "blueScreen",
      values: [{ name: "blueScreen", value: "#72A2C0" }],
    },
  },
};
export default meta;

type Story = StoryObj<typeof DynamicLabel>;

export const Default: Story = {
  render: (args) => <DynamicLabel {...args}>Welcome to ATM</DynamicLabel>,
};

export const Animated: Story = {
  render: (args) => <DynamicLabel {...args}>Processing Transaction...</DynamicLabel>,
  args: {
    animated: true,
    typingSpeed: 100,
  },
};

export const Masked: Story = {
  render: (args) => <DynamicLabel {...args}>1234</DynamicLabel>,
  args: {
    masked: true,
  },
};

export const Heading1: Story = {
  render: (args) => (
    <h1>
      <DynamicLabel {...args}>ATM System</DynamicLabel>
    </h1>
  ),
};

export const Heading2: Story = {
  render: (args) => (
    <h2>
      <DynamicLabel {...args}>Enter Your PIN</DynamicLabel>
    </h2>
  ),
};

const AsyncLabelWrapper = (props: DynamicLabelProps) => {
  const [currentText, setCurrentText] = useState("Waiting...");

  useEffect(() => {
    const firstTimeout = setTimeout(() => {
      setCurrentText("Processing...");
    }, 2000);

    const secondTimeout = setTimeout(() => {
      setCurrentText("Complete!");
    }, 4000);

    return () => {
      clearTimeout(firstTimeout);
      clearTimeout(secondTimeout);
    };
  }, []);

  return <DynamicLabel {...props}>{currentText}</DynamicLabel>;
};

export const AsyncUpdate: Story = {
  render: (args) => <AsyncLabelWrapper {...args} />,
  args: {
    animated: true,
    typingSpeed: 80,
  },
};

export const Preselected: Story = {
  args: {
    children: "Option Selected",
    preselected: true,
  },
};

export const MoneyLabel = ({ amount }: { amount: number | string }) => {
  const formattedAmount = useCurrencyFormatter(amount);

  return <DynamicLabel>{formattedAmount}</DynamicLabel>;
};

export const MoneyFormat: Story = {
  render: () => <MoneyLabel amount={12345.67} />,
};
