import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Timer, TimerProps } from "./Timer";

const meta: Meta<typeof Timer> = {
  title: "ATM/Timer",
  component: Timer,
  args: {
    timeToLive: 60,
  },
  argTypes: {
    timeToLive: { control: { type: "number", min: 10, max: 600, step: 10 } },
    onTimeout: { action: "Session Expired" },
  },
  parameters: {
    backgrounds: { default: "blueScreen" },
  },
};
export default meta;

type Story = StoryObj<typeof Timer>;

const TimerWrapper = (props: TimerProps) => {
  const [remainingTime, setRemainingTime] = useState(props.timeToLive);

  return (
    <div className="flex flex-col items-center space-y-4 bg-screen p-6 w-96 rounded-lg shadow-lg">
      <Timer {...props} timeToLive={remainingTime} onTimeout={() => alert("Session Expired")} />
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md"
        onClick={() => setRemainingTime(30)}
      >
        Simulate Warning Phase (30s)
      </button>
      <button
        className="bg-yellow-400 text-black px-4 py-2 rounded-md shadow-md"
        onClick={() => setRemainingTime(5)}
      >
        Simulate Final Countdown (5s)
      </button>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <TimerWrapper {...args} />,
};

export const ShortSession: Story = {
  render: (args) => <TimerWrapper {...args} />,
  args: {
    timeToLive: 30,
  },
};

export const ImmediateWarning: Story = {
  render: (args) => <TimerWrapper {...args} />,
  args: {
    timeToLive: 30,
  },
};

export const ForceTimeout: Story = {
  render: (args) => <TimerWrapper {...args} />,
  args: {
    timeToLive: 60,
  },
};
