import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { ATM } from "./ATM";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { DynamicLabel } from "@/components/DynamicLabel";
import { FONT_SIZES } from "@/types";

const meta: Meta<typeof ATM> = {
  title: "ATM/Full Interface",
  component: ATM,
  parameters: {
    backgrounds: { default: "purpleBackground" },
  },
};
export default meta;

type Story = StoryObj<typeof ATM>;

const ATMWrapper = () => {
  const { setScreenContent, setButtonBinding, clearButtonBindings } = useBlueScreenStore();

  useEffect(() => {
    clearButtonBindings();

    setScreenContent(
      <DynamicLabel animated size={FONT_SIZES.sm}>
        Hi Peter Parker! Please make a choice...
      </DynamicLabel>,
    );

    setButtonBinding(2, {
      label: "Withdraw",
      action: () => setScreenContent(<DynamicLabel>Withdraw</DynamicLabel>),
    });
    setButtonBinding(3, {
      label: "Deposit",
      action: () => setScreenContent(<DynamicLabel>Deposit</DynamicLabel>),
    });
    setButtonBinding(5, {
      label: "Balance",
      action: () => setScreenContent(<DynamicLabel>Balance</DynamicLabel>),
    });
    setButtonBinding(6, {
      label: "Re-Enter PIN",
      action: () => setScreenContent(<DynamicLabel>Re-Enter PIN</DynamicLabel>),
    });
    setButtonBinding(7, {
      label: "Exit",
      action: () => setScreenContent(<DynamicLabel>Session Ended</DynamicLabel>),
    });
  }, [setScreenContent, setButtonBinding, clearButtonBindings]);

  return (
    <div className="relative">
      <img
        src="/graffiti.png"
        alt="Graffiti"
        className="absolute bottom-4 left-4 w-20 opacity-90"
      />

      <ATM />
    </div>
  );
};

export const FullATMInterface: Story = {
  render: () => <ATMWrapper />,
};
