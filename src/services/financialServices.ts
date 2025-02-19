let userBalance = 3000;
let machineBalance = 2000;
let dailyLimit = 700;
let dailyUsed = 0;

export async function getBalanceInfo(): Promise<{ balance: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ balance: userBalance });
    }, 1000);
  });
}

export function setMockBalance(amount: number) {
  userBalance = amount;
}

export async function getWithdrawInfo(): Promise<{
  balance: number;
  atmAvailable: number;
  dailyLimit: number;
  dailyUsed: number;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        balance: userBalance,
        atmAvailable: machineBalance,
        dailyLimit,
        dailyUsed,
      });
    }, 2000);
  });
}

export async function performWithdraw(amount: number): Promise<{
  newBalance: number;
  newAtmAvailable: number;
  newDailyUsed: number;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      userBalance -= amount;
      machineBalance -= amount;
      dailyUsed += amount;

      resolve({
        newBalance: userBalance,
        newAtmAvailable: machineBalance,
        newDailyUsed: dailyUsed,
      });
    }, 300);
  });
}

export function resetMockData() {
  userBalance = 1000;
  machineBalance = 2000;
  dailyLimit = 500;
  dailyUsed = 0;
}
