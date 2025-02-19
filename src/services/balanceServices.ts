let userBalance = 3000;

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
