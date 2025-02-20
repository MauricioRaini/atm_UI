import { create } from "zustand";
import { WelcomeScreen } from "@/views/WelcomeScreen/WelcomeScreen";
import { AccessLevel } from "@/types/auth.types";
import { ATMButtons, CardTypes } from "@/types";
import { FIVE_MINUTES_TIMER } from "@/constants/Timer.constants";

export type ButtonBinding = {
  label?: string;
  action?: () => void;
};

type BlueScreenState = {
  currentUserId: string | null;
  screenContent: React.ReactNode;
  buttonBindings: { [key: number]: ButtonBinding };
  isAuthenticated: boolean;
  userCardType: CardTypes | null;
  fullScreen: boolean;
  isBlocked: boolean;
  setUserId: (id: string | null) => void;
  setScreenContent: (content: React.ReactNode) => void;
  setButtonBinding: (index: ATMButtons, binding: ButtonBinding) => void;
  clearButtonBindings: () => void;
  setAuth: (isAuth: boolean, cardType?: CardTypes) => void;
  navigateTo: (content: React.ReactNode, requiresAuth?: AccessLevel) => void;
  setFullScreen: (isFullScreen: boolean) => void;
  blockUser: () => void;
  unblockUser: () => void;
};

export const useBlueScreenStore = create<BlueScreenState>((set, get) => ({
  currentUserId: null,
  screenContent: <WelcomeScreen />,
  buttonBindings: {},
  isAuthenticated: false,
  userCardType: null,
  fullScreen: false,

  setScreenContent: (content) => set({ screenContent: content }),

  setAuth: (isAuth, cardType) =>
    set({ isAuthenticated: isAuth, userCardType: isAuth ? (cardType ?? null) : null }),

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
  setUserId: (id) => set({ currentUserId: id }),
}));
