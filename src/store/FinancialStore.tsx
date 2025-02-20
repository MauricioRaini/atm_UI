import { create } from "zustand";
import {
  getBalanceInfo,
  getWithdrawInfo,
  performWithdraw,
  performDeposit,
  resetMockData,
  getUser,
} from "@/services";
import { useBlueScreenStore } from "./BlueScreenStore"; // so we can read currentUserId
import { CardTypes, FINANCIAL_MOVEMENTS, User } from "@/types";

/* TODO: We need to rethink a better single responsibility classification for the 2 stores. For time's sake we are leaving it like this, but ideally we need to refactor the stores so each handle only data related to that of the interest of the publisher/provider */
export type FinancialState = {
  balance: number;
  atmAvailable: number;
  dailyLimit: number;
  dailyUsed: number;
  lastMovements: Array<{
    date: Date;
    amount: number;
    type: FINANCIAL_MOVEMENTS;
  }>;
  userName: string;
  userCardNumber: string;
  userCardType: CardTypes | null;
  isLoading: boolean;
  error: string | null;

  fetchUser: () => Promise<User | undefined>;
  fetchBalance: () => Promise<void>;
  fetchWithdrawInfo: () => Promise<void>;
  doWithdraw: (amount: number) => Promise<void>;
  doDeposit: (targetAccount: string, amount: number) => Promise<void>;

  resetAllData: () => void;
};

export const useFinancialStore = create<FinancialState>((set, get) => ({
  balance: 0,
  atmAvailable: 0,
  dailyLimit: 0,
  dailyUsed: 0,
  lastMovements: [],
  userName: "",
  userCardNumber: "",
  userCardType: null,
  isLoading: false,
  error: null,

  async fetchUser() {
    const { currentUserId } = useBlueScreenStore.getState();
    if (!currentUserId) return;
    set({ isLoading: true, error: null });
    try {
      const user = await getUser(currentUserId);
      set({
        userName: user.name,
        userCardNumber: user.cardNumber,
        userCardType: user.userCardType,
        balance: user.balance,
        dailyLimit: user.dailyLimit,
        dailyUsed: user.dailyUsed,
        isLoading: false,
      });
      return user;
    } catch (error) {
      set({ error: "Unable to load user data", isLoading: false });
      throw new Error(error as string);
    }
  },

  async fetchBalance() {
    const { currentUserId } = useBlueScreenStore.getState();
    if (!currentUserId) return;
    set({ isLoading: true, error: null });
    try {
      const result = await getBalanceInfo(currentUserId);
      set({ balance: result.balance, isLoading: false });
    } catch (error) {
      set({ error: "Unable to fetch balance", isLoading: false });
      throw new Error(error as string);
    }
  },

  async fetchWithdrawInfo() {
    const { currentUserId } = useBlueScreenStore.getState();
    if (!currentUserId) return;
    set({ isLoading: true, error: null });
    try {
      const info = await getWithdrawInfo(currentUserId);
      set({
        balance: info.balance,
        atmAvailable: info.atmAvailable,
        dailyLimit: info.dailyLimit,
        dailyUsed: info.dailyUsed,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Unable to load withdraw info", isLoading: false });
      throw new Error(error as string);
    }
  },

  async doWithdraw(amount: number) {
    const { currentUserId } = useBlueScreenStore.getState();
    if (!currentUserId) return;
    set({ isLoading: true, error: null });
    try {
      const result = await performWithdraw(currentUserId, amount);
      set({
        balance: result.newBalance,
        atmAvailable: result.newAtmAvailable,
        dailyUsed: result.newDailyUsed,
        isLoading: false,
      });
      get().lastMovements.push({
        date: new Date(),
        amount,
        type: FINANCIAL_MOVEMENTS.withdraw,
      });
    } catch (error) {
      set({ error: "Failed to withdraw. Please try again later.", isLoading: false });
      throw new Error(error as string);
    }
  },

  async doDeposit(targetAccount, amount) {
    const { currentUserId } = useBlueScreenStore.getState();
    if (!currentUserId) return;
    set({ isLoading: true, error: null });
    try {
      const result = await performDeposit(currentUserId, targetAccount, amount);
      set({
        balance: result.newBalance,
        atmAvailable: result.newAtmAvailable,
        dailyUsed: result.newDailyUsed,
        isLoading: false,
      });
      get().lastMovements.push({
        date: new Date(),
        amount,
        type: FINANCIAL_MOVEMENTS.deposit,
      });
    } catch (error) {
      set({ error: "Failed to deposit. Please try again later.", isLoading: false });
      throw new Error(error as string);
    }
  },

  resetAllData() {
    resetMockData();
    set({
      balance: 0,
      atmAvailable: 0,
      dailyLimit: 0,
      dailyUsed: 0,
      userName: "",
      userCardNumber: "",
      lastMovements: [],
      isLoading: false,
      error: null,
    });
  },
}));
