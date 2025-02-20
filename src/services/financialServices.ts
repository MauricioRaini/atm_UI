import { CardTypes, User } from "@/types";

type MockUser = {
  id: string;
  pin: string;
  cardNumber: string;
  name: string;
  balance: number;
  dailyLimit: number;
  dailyUsed: number;
  userCardType: CardTypes;
};

let machineBalance = 2000;

const mockDB: MockUser[] = [
  {
    id: "userA",
    pin: "000000",
    cardNumber: "000000",
    name: "Ethan Blake",
    balance: 5000,
    dailyLimit: 2000,
    dailyUsed: 0,
    userCardType: CardTypes.Visa,
  },
  {
    id: "userB",
    pin: "111111",
    cardNumber: "111111",
    name: "Canelo Alvarez",
    balance: 1000,
    dailyLimit: 300,
    dailyUsed: 100,
    userCardType: CardTypes.MasterCard,
  },
  {
    id: "userC",
    pin: "222222",
    cardNumber: "222222",
    name: "Peter Parker",
    balance: 3000,
    dailyLimit: 700,
    dailyUsed: 200,
    userCardType: CardTypes.Maestro,
  },
];

export async function validatePIN(pin: string): Promise<{ success: boolean; userId?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const found = mockDB.find((u) => u.pin === pin);
      if (found) {
        resolve({ success: true, userId: found.id });
      } else {
        resolve({ success: false });
      }
    }, 1000);
  });
}

export async function getUser(userId: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockDB.find((u) => u.id === userId);
      if (!user) {
        return reject(new Error("User not found"));
      }
      resolve({
        id: user.id,
        name: user.name,
        cardNumber: user.cardNumber,
        userCardType: user.userCardType,
        balance: user.balance,
        dailyLimit: user.dailyLimit,
        dailyUsed: user.dailyUsed,
      });
    }, 400);
  });
}

export async function getWithdrawInfo(userId: string): Promise<{
  balance: number;
  atmAvailable: number;
  dailyLimit: number;
  dailyUsed: number;
}> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockDB.find((u) => u.id === userId);
      if (!user) return reject(new Error("User not found"));

      resolve({
        balance: user.balance,
        atmAvailable: machineBalance,
        dailyLimit: user.dailyLimit,
        dailyUsed: user.dailyUsed,
      });
    }, 800);
  });
}

export async function getBalanceInfo(userId: string): Promise<{ balance: number }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockDB.find((u) => u.id === userId);
      if (!user) return reject(new Error("User not found"));
      resolve({ balance: user.balance });
    }, 500);
  });
}

export async function performWithdraw(
  userId: string,
  amount: number,
): Promise<{
  newBalance: number;
  newAtmAvailable: number;
  newDailyUsed: number;
}> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockDB.find((u) => u.id === userId);
      if (!user) return reject(new Error("User not found"));

      user.balance -= amount;
      user.dailyUsed += amount;
      machineBalance -= amount;

      resolve({
        newBalance: user.balance,
        newAtmAvailable: machineBalance,
        newDailyUsed: user.dailyUsed,
      });
    }, 300);
  });
}

export async function performDeposit(
  sourceUserId: string,
  targetAccount: string,
  amount: number,
): Promise<{
  newBalance: number; // source user's new balance
  newAtmAvailable: number; // machine's new capacity
  newDailyUsed: number; // source user's dailyUsed
}> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const sourceUser = mockDB.find((u) => u.id === sourceUserId);
      if (!sourceUser) return reject(new Error("Source user not found"));
      if (sourceUser.cardNumber === targetAccount) {
        return reject(new Error("Cannot deposit to yourself!"));
      }

      const targetUser = mockDB.find((u) => u.cardNumber === targetAccount);
      if (!targetUser) {
        return reject(new Error("Target account not found"));
      }

      sourceUser.balance -= amount;
      sourceUser.dailyUsed += amount;
      targetUser.balance += amount;
      machineBalance += amount;

      resolve({
        newBalance: sourceUser.balance,
        newAtmAvailable: machineBalance,
        newDailyUsed: sourceUser.dailyUsed,
      });
    }, 300);
  });
}

export function resetMockData() {
  machineBalance = 2000;

  mockDB[0].balance = 5000;
  mockDB[0].dailyUsed = 0;

  mockDB[1].balance = 1000;
  mockDB[1].dailyUsed = 100;

  mockDB[2].balance = 3000;
  mockDB[2].dailyUsed = 200;
}
