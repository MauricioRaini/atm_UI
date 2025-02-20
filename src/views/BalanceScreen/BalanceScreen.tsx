import React, { ReactElement, useEffect } from "react";
import { AccessLevel, FONT_SIZES, ATMButtons } from "@/types";
import { useBlueScreenStore, useFinancialStore } from "@/store";
import { DynamicLabel } from "@/components/DynamicLabel";
import { MainMenu } from "@/views/MainMenu";
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter";
import "./BalanceScreen.css";

export const BalanceScreen: React.FC = (): ReactElement => {
  const { setButtonBinding, clearButtonBindings, navigateTo } = useBlueScreenStore();

  const { balance, isLoading, error, fetchBalance } = useFinancialStore();

  const formattedBalance = useCurrencyFormatter(balance);

  useEffect(() => {
    clearButtonBindings();
    setButtonBinding(ATMButtons.LowerLeft, {
      label: "Back",
      action: () => navigateTo(<MainMenu />, AccessLevel.AUTHENTICATED),
    });

    fetchBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="balance-screen flex-center">
        <DynamicLabel animated size={FONT_SIZES.md}>
          Loading...
        </DynamicLabel>
      </div>
    );
  }

  if (error) {
    return (
      <div className="balance-screen flex-col-center">
        <div className="balance-error-msg">{error}</div>
        <button
          className="balance-cancel-btn"
          onClick={() => navigateTo(<MainMenu />, AccessLevel.AUTHENTICATED)}
        >
          Cancel
        </button>
      </div>
    );
  }
  return (
    <div className="balance-screen flex-col-center">
      <div className="balance-title">Your Current Balance:</div>
      <DynamicLabel size={FONT_SIZES.lg}>{formattedBalance}</DynamicLabel>
    </div>
  );
};
