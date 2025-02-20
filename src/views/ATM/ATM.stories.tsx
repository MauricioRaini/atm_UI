import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { ATM } from "./ATM";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { DynamicLabel } from "@/components/DynamicLabel";
import { ATMButtons, FONT_SIZES } from "@/types";

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

    setButtonBinding(ATMButtons.MiddleBottomLeft, {
      label: "Withdraw",
      action: () => setScreenContent(<DynamicLabel>Withdraw</DynamicLabel>),
    });
    setButtonBinding(ATMButtons.LowerLeft, {
      label: "Deposit",
      action: () => setScreenContent(<DynamicLabel>Deposit</DynamicLabel>),
    });
    setButtonBinding(ATMButtons.MiddleTopRight, {
      label: "Balance",
      action: () => setScreenContent(<DynamicLabel>Balance</DynamicLabel>),
    });
    setButtonBinding(ATMButtons.MiddleBottomRight, {
      label: "Re-Enter PIN",
      action: () => setScreenContent(<DynamicLabel>Re-Enter PIN</DynamicLabel>),
    });
    setButtonBinding(ATMButtons.LowerRight, {
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
