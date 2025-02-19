import { create } from "zustand";

export type ButtonBinding = {
  label?: string;
  action?: () => void;
};

type BlueScreenState = {
  screenContent: React.ReactNode;
  buttonBindings: { [key: number]: ButtonBinding };
  isAuthenticated: boolean;
  setScreenContent: (content: React.ReactNode) => void;
  setButtonBinding: (index: number, binding: ButtonBinding) => void;
  clearButtonBindings: () => void;
  setAuth: (isAuth: boolean) => void;
  navigateTo: (content: React.ReactNode, requiresAuth?: boolean) => void;
};

export const useBlueScreenStore = create<BlueScreenState>((set, get) => ({
  screenContent: <h1>Welcome</h1>,
  buttonBindings: {},
  isAuthenticated: false,
  setScreenContent: (content) => set({ screenContent: content }),
  setAuth: (isAuth) => set({ isAuthenticated: isAuth }),
  navigateTo: (content, requiresAuth = false) => {
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
}));
