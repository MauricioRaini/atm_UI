import { create } from "zustand";

export type ButtonBinding = {
  label?: string;
  action?: () => void;
};

type BlueScreenState = {
  screenContent: React.ReactNode;
  buttonBindings: { [key: number]: ButtonBinding };
  setScreenContent: (content: React.ReactNode) => void;
  setButtonBinding: (index: number, binding: ButtonBinding) => void;
  clearButtonBindings: () => void;
};

export const useBlueScreenStore = create<BlueScreenState>((set) => ({
  screenContent: <h1>Welcome</h1>,
  buttonBindings: {},

  setScreenContent: (content) => set({ screenContent: content }),

  setButtonBinding: (index, binding) =>
    set((state) => ({
      buttonBindings: { ...state.buttonBindings, [index]: binding },
    })),

  clearButtonBindings: () => set({ buttonBindings: {} }),
}));
