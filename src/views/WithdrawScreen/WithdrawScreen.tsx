import React, { useEffect, useState } from "react";
import { useBlueScreenStore, useFinancialStore } from "@/store";
import { MainMenu } from "@/views/MainMenu";
import { DynamicLabel, InputField, NumericKeyboard } from "@/components";
import { useCurrencyFormatter } from "@/hooks";
import {
  AccessLevel,
  ATMButtons,
  FONT_SIZES,
  COMMON_AMOUNTS,
  CONFIRMATION_MODAL_TIME,
  MAX_WITHDRAW,
  MEDIUM_TYPING_SPEED,
  PIN_DIGITS,
} from "@/types";

import "./WithdrawScreen.css";

export const WithdrawScreen: React.FC = () => {
  const { setButtonBinding, clearButtonBindings, navigateTo, setFullScreen } = useBlueScreenStore();

  const {
    balance,
    atmAvailable,
    dailyLimit,
    dailyUsed,
    isLoading,
    error,
    fetchWithdrawInfo,
    doWithdraw,
  } = useFinancialStore();

  const [isOther, setIsOther] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);
  const [limitLeft, setLimitLeft] = useState(dailyLimit);

  const remainingLimit = dailyLimit - dailyUsed;
  const customAmountValue = parseInt(customAmount, 10) || 0;
  const [withdrawalSuccessAmount, setWithdrawalSuccessAmount] = useState<number | null>(null);

  const formattedBalance = useCurrencyFormatter(balance);
  const formattedPending = useCurrencyFormatter(pendingAmount ?? 0);
  const formattedLimitLeft = useCurrencyFormatter(limitLeft);
  const formattedSuccessAmount = useCurrencyFormatter(withdrawalSuccessAmount ?? 0);
  const formattedCustom = useCurrencyFormatter(customAmountValue);

  useEffect(() => {
    clearButtonBindings();
    setButtonBinding(ATMButtons.LowerLeft, {
      label: "Cancel",
      action: () => navigateTo(<MainMenu />, AccessLevel.AUTHENTICATED),
    });
    fetchWithdrawInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFullScreen(true);
  }, [setFullScreen]);

  useEffect(() => {
    setLimitLeft(remainingLimit);
  }, [remainingLimit]);

  useEffect(() => {
    if (withdrawalSuccessAmount !== null) {
      const timer = setTimeout(() => {
        navigateTo(<MainMenu />, AccessLevel.AUTHENTICATED);
      }, CONFIRMATION_MODAL_TIME);

      return () => clearTimeout(timer);
    }
  }, [withdrawalSuccessAmount, navigateTo]);

  const isCustomAmountInvalid = () => {
    if (customAmountValue <= 0) return false;
    if (customAmountValue > balance) return true;
    if (customAmountValue > limitLeft) return true;
    if (customAmountValue > atmAvailable) return true;
    if (customAmountValue > MAX_WITHDRAW) return true;
    return false;
  };

  const handleConfirm = async () => {
    if (pendingAmount == null) return;
    try {
      await doWithdraw(pendingAmount);
      setWithdrawalSuccessAmount(pendingAmount);
    } catch (error) {
      throw new Error(error as string);
    }
    setShowConfirm(false);
    setPendingAmount(null);
    setCustomAmount("");
    setIsOther(false);
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
    setPendingAmount(null);
  };

  const handleOtherSelection = () => {
    setIsOther(true);
  };

  const handleNumberPress = (num: number) => {
    if (customAmount.length >= PIN_DIGITS) return;
    setCustomAmount((prev) => prev + String(num));
  };

  const handleClearPress = () => {
    setCustomAmount("");
  };

  const handleEnterPress = () => {
    if (customAmountValue <= 0 || customAmountValue > MAX_WITHDRAW) return;
    if (
      customAmountValue > balance ||
      customAmountValue > limitLeft ||
      customAmountValue > atmAvailable
    ) {
      return;
    }
    setPendingAmount(customAmountValue);
    setShowConfirm(true);
  };

  const handleCommonAmount = (amount: number) => {
    setPendingAmount(amount);
    setShowConfirm(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center self-center">
        <DynamicLabel preselected animated size={FONT_SIZES.xl}>
          Loading...
        </DynamicLabel>
      </div>
    );
  }

  if (error) {
    return (
      <div className="withdraw-screen flex flex-col p-6">
        <div className="text-red-400 font-bold">{error}</div>
        <button
          className="mt-4 border border-white px-4 py-2 text-white"
          onClick={() => navigateTo(<MainMenu />, AccessLevel.AUTHENTICATED)}
        >
          Cancel
        </button>
      </div>
    );
  }

  if (withdrawalSuccessAmount !== null) {
    const formattedWithdrawn = formattedSuccessAmount;
    return (
      <div className="withdraw-screen flex flex-col items-center justify-center p-6 space-y-4">
        <DynamicLabel animated preselected size={FONT_SIZES.lg}>
          {`You withdrew ${formattedWithdrawn}`}
        </DynamicLabel>
      </div>
    );
  }

  const invalidClass = isCustomAmountInvalid() ? "text-red-400 animate-pulse" : "";

  return (
    <div className="withdraw-screen flex flex-col items-center text-center p-1 space-y-1">
      {!isOther && (
        <div className="font-atm text-chat text-xs transition-all duration-150 ease-in-out text-center">
          Balance:{" "}
          <DynamicLabel animated typingSpeed={MEDIUM_TYPING_SPEED} size={FONT_SIZES.sm}>
            {formattedBalance}
          </DynamicLabel>
        </div>
      )}

      <div
        className={`font-atm text-chat text-xs transition-all duration-150 ease-in-out text-center ${invalidClass}`}
      >
        Max withdrawal available:{" "}
        <DynamicLabel typingSpeed={MEDIUM_TYPING_SPEED} size={FONT_SIZES.xs} animated>
          {formattedLimitLeft}
        </DynamicLabel>
      </div>

      <DynamicLabel size={FONT_SIZES.xs} preselected>
        Enter your withdrawal amount:
      </DynamicLabel>

      {!isOther && (
        <div className="grid grid-cols-3 gap-1">
          {COMMON_AMOUNTS.map((amt) => (
            <button
              key={amt}
              disabled={amt > limitLeft}
              className="common-amount-button border border-white text-white justify-center items-center"
              style={amt > limitLeft ? { opacity: "20%" } : {}}
              onClick={() => handleCommonAmount(amt)}
            >
              ${amt}
            </button>
          ))}
          <button
            className="common-amount-button border border-yellow-300 text-yellow-300"
            onClick={handleOtherSelection}
          >
            Other
          </button>
        </div>
      )}

      {isOther && (
        <div className="flex flex-col items-center space-y-2 relative bottom-[1rem]">
          <InputField
            value={formattedCustom}
            onChange={(rawString) => {
              const onlyDigits = rawString.replace(/\D/g, "");
              setCustomAmount(onlyDigits);
            }}
            onEnter={handleEnterPress}
            maxLength={PIN_DIGITS}
            error={isCustomAmountInvalid()}
            data-testid="input-field"
          />
          <div className="flex w-full">
            <NumericKeyboard
              onNumberPress={handleNumberPress}
              onClearPress={handleClearPress}
              onEnterPress={handleEnterPress}
            />
          </div>
        </div>
      )}

      {showConfirm && pendingAmount != null && (
        <div
          className="confirm-overlay absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70"
          role="dialog"
        >
          <div className="confirm-box bg-gray-800 p-6 text-white flex flex-col space-y-4">
            <DynamicLabel animated preselected size={FONT_SIZES.sm}>
              {`You are about to withdraw ${formattedPending}`}
            </DynamicLabel>
            <div className="flex space-x-4 justify-center">
              <button
                className="border border-green-400 px-4 py-2 text-green-400"
                onClick={handleConfirm}
              >
                Confirm
              </button>
              <button
                className="border border-red-400 px-4 py-2 text-red-400"
                onClick={handleCancelConfirm}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
