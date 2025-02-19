import { create } from "zustand";
import {
  getBalanceInfo,
  getWithdrawInfo,
  performDeposit,
  performWithdraw,
  resetMockData,
} from "@/services";
import { FINANCIAL_MOVEMENTS } from "@/types";

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
  timeToLive: number;

  isLoading: boolean;
  error: string | null;

  fetchBalance: () => Promise<void>;
  fetchWithdrawInfo: () => Promise<void>;
  doWithdraw: (amount: number) => Promise<void>;
  doDeposit: (amount: number) => Promise<void>;
  resetAllData: () => void;
};

export const useFinancialStore = create<FinancialState>((set, get) => ({
  balance: 0,
  atmAvailable: 0,
  dailyLimit: 0,
  dailyUsed: 0,
  lastMovements: [],
  timeToLive: 0,
  isLoading: false,
  error: null,

  fetchBalance: async () => {
    try {
      set({ isLoading: true, error: null });
      const result = await getBalanceInfo();
      set({
        balance: result.balance,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: "Unable to fetch balance",
        isLoading: false,
      });
      throw new Error(err as string);
    }
  },

  fetchWithdrawInfo: async () => {
    try {
      set({ isLoading: true, error: null });
      const info = await getWithdrawInfo();
      set({
        balance: info.balance,
        atmAvailable: info.atmAvailable,
        dailyLimit: info.dailyLimit,
        dailyUsed: info.dailyUsed,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: "Unable to load withdraw info",
        isLoading: false,
      });
      throw new Error(err as string);
    }
  },

  doWithdraw: async (amount: number) => {
    try {
      set({ isLoading: true, error: null });
      const result = await performWithdraw(amount);
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
    } catch (err) {
      set({
        error: "Failed to withdraw. Please try again later.",
        isLoading: false,
      });
      throw new Error(err as string);
    }
  },

  doDeposit: async (amount: number) => {
    try {
      set({ isLoading: true, error: null });
      const result = await performDeposit(amount);
      set({
        balance: result.newBalance,
        dailyUsed: result.newAtmAvailable,
        isLoading: false,
      });
      get().lastMovements.push({
        date: new Date(),
        amount,
        type: FINANCIAL_MOVEMENTS.deposit,
      });
    } catch (err) {
      set({
        error: "Failed to deposit. Please try again later.",
        isLoading: false,
      });
      throw new Error(err as string);
    }
  },

  resetAllData: () => {
    resetMockData();
    set({
      balance: 0,
      atmAvailable: 0,
      dailyLimit: 0,
      dailyUsed: 0,
      lastMovements: [],
      timeToLive: 0,
      isLoading: false,
      error: null,
    });
  },
}));
