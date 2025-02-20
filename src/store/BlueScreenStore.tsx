import { FIVE_MINUTES_TIMER } from "@/constants/Timer.constants";
import { ATMButtons } from "@/types";
import { AccessLevel } from "@/types/auth.types";
import { WelcomeScreen } from "@/views/WelcomeScreen/WelcomeScreen";
import { create } from "zustand";

export type ButtonBinding = {
  label?: string;
  action?: () => void;
};

type BlueScreenState = {
  screenContent: React.ReactNode;
  buttonBindings: { [key: number]: ButtonBinding };
  isAuthenticated: boolean;
  fullScreen: boolean;
  setScreenContent: (content: React.ReactNode) => void;
  setButtonBinding: (index: ATMButtons, binding: ButtonBinding) => void;
  clearButtonBindings: () => void;
  setAuth: (isAuth: boolean) => void;
  navigateTo: (content: React.ReactNode, requiresAuth?: AccessLevel) => void;
  setFullScreen: (isFullScreen: boolean) => void;
  isBlocked: boolean;
  blockUser: () => void;
  unblockUser: () => void;
};

export const useBlueScreenStore = create<BlueScreenState>((set, get) => ({
  screenContent: <WelcomeScreen />,
  buttonBindings: {},
  isAuthenticated: false,
  fullScreen: false,
  setScreenContent: (content) => set({ screenContent: content }),
  setAuth: (isAuth) => set({ isAuthenticated: isAuth }),
  navigateTo: (content, requiresAuth = AccessLevel.PUBLIC) => {
    if (requiresAuth && !get().isAuthenticated) {
      return;
    }
    set({ screenContent: content });
  },
  setButtonBinding: (index, binding) =>
    set((state) => ({
      buttonBindings: { ...state.buttonBindings, [index]: binding },
    })),
  clearButtonBindings: () => set({ buttonBindings: {} }),
  setFullScreen: (isFullScreen) => set({ fullScreen: isFullScreen }),
  isBlocked: !!sessionStorage.getItem("pin_block_until"),
  blockUser: () => {
    const blockUntil = Date.now() + FIVE_MINUTES_TIMER;
    sessionStorage.setItem("pin_block_until", blockUntil.toString());
    set({ isBlocked: true });
  },
  unblockUser: () => {
    sessionStorage.removeItem("pin_block_until");
    set({ isBlocked: false });
  },
}));
