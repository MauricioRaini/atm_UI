import React, { useEffect, useState } from "react";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { AccessLevel, FONT_SIZES, ATMButtons } from "@/types";
import { DynamicLabel } from "@/components/DynamicLabel";
import { MainMenu } from "@/views/MainMenu";
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter";
import "./BalanceScreen.css";
import { getBalanceInfo } from "@/services";

export const BalanceScreen: React.FC = () => {
  const { setButtonBinding, clearButtonBindings, navigateTo } = useBlueScreenStore();

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formattedBalance = useCurrencyFormatter(balance);

  useEffect(() => {
    clearButtonBindings();
    setButtonBinding(ATMButtons.LowerLeft, {
      label: "Back",
      action: () => navigateTo(<MainMenu />, AccessLevel.AUTHENTICATED),
    });

    getBalanceInfo()
      .then((res) => {
        setBalance(res.balance);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load your balance");
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
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
