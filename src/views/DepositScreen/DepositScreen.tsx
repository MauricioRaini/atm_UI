import React, { ReactElement, useEffect, useState } from "react";
import { MainMenu } from "@/views/MainMenu";
import { useBlueScreenStore, useFinancialStore } from "@/store";
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
import "./DepositScreen.css";

export const DepositScreen: React.FC = (): ReactElement => {
  const { navigateTo, clearButtonBindings, setButtonBinding, setFullScreen } = useBlueScreenStore();
  const { balance, dailyLimit, dailyUsed, isLoading, error, fetchWithdrawInfo, doDeposit } =
    useFinancialStore();

  const [accountNumber, setAccountNumber] = useState("");
  const [showAccountEntry, setShowAccountEntry] = useState(true);

  const [isOther, setIsOther] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);
  const [depositSuccessAmount, setDepositSuccessAmount] = useState<number | null>(null);

  const customAmountValue = parseInt(customAmount, 10) || 0;
  const remainingLimit = dailyLimit - dailyUsed;

  const formattedBalance = useCurrencyFormatter(balance);
  const formattedLimitAvailable = useCurrencyFormatter(remainingLimit);
  const formattedPending = useCurrencyFormatter(pendingAmount ?? 0);
  const formattedSuccessAmount = useCurrencyFormatter(depositSuccessAmount ?? 0);
  const formattedCustom = useCurrencyFormatter(customAmountValue);
  const isAccountFormatValid = accountNumber.length === PIN_DIGITS;
  const invalidAccountNumber = !isAccountFormatValid && accountNumber.length > 0;

  useEffect(() => {
    clearButtonBindings();
    fetchWithdrawInfo();
    setFullScreen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (depositSuccessAmount !== null) {
      const timer = setTimeout(() => {
        navigateTo(<MainMenu />, AccessLevel.AUTHENTICATED);
      }, CONFIRMATION_MODAL_TIME);

      return () => clearTimeout(timer);
    }
  }, [depositSuccessAmount, navigateTo]);

  const showButtons = !isLoading && !error && depositSuccessAmount === null && !showConfirm;

  useEffect(() => {
    clearButtonBindings();

    if (showButtons) {
      setButtonBinding(ATMButtons.LowerLeft, {
        label: "Cancel",
        action: () => navigateTo(<MainMenu />, AccessLevel.AUTHENTICATED),
      });
    }

    if (showButtons && showAccountEntry && isAccountFormatValid) {
      setButtonBinding(ATMButtons.LowerRight, {
        label: "Continue",
        action: () => setShowAccountEntry(false),
      });
    }
  }, [
    showButtons,
    showAccountEntry,
    isAccountFormatValid,
    navigateTo,
    clearButtonBindings,
    setButtonBinding,
  ]);

  const handleAccountNumberPress = (num: number) => {
    if (accountNumber.length < PIN_DIGITS) {
      setAccountNumber((prev) => prev + String(num));
    }
  };

  const handleAccountClear = () => setAccountNumber("");
  const handleAccountEnter = () => {
    if (isAccountFormatValid) {
      setShowAccountEntry(false);
    }
  };

  const isCustomAmountInvalid = () => {
    if (customAmountValue <= 0) return false;
    if (customAmountValue > remainingLimit) return true;
    if (customAmountValue > MAX_WITHDRAW) return true;
    return false;
  };

  const handleConfirm = async () => {
    if (pendingAmount == null) return;
    try {
      await doDeposit(pendingAmount);
      setDepositSuccessAmount(pendingAmount);
    } catch (error) {
      throw new Error(error as string);
    }
    setShowConfirm(false);
    setPendingAmount(null);
    setCustomAmount("");
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
    setPendingAmount(null);
  };

  const handleNumberPress = (num: number) => {
    if (customAmount.length < PIN_DIGITS) {
      setCustomAmount((prev) => prev + String(num));
    }
  };

  const handleClearPress = () => setCustomAmount("");

  const handleEnterPress = () => {
    if (customAmountValue <= 0 || customAmountValue > MAX_WITHDRAW) return;
    if (customAmountValue > remainingLimit) {
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
      <div className="deposit-screen flex h-full items-center justify-center self-center">
        <DynamicLabel preselected animated size={FONT_SIZES.xl}>
          Loading...
        </DynamicLabel>
      </div>
    );
  }

  if (error) {
    return (
      <div className="deposit-screen flex flex-col p-6">
        <div className="text-red-400 font-bold">{error}</div>
      </div>
    );
  }

  if (depositSuccessAmount !== null) {
    return (
      <div className="deposit-screen flex flex-col items-center justify-center p-6 space-y-4">
        <DynamicLabel animated preselected size={FONT_SIZES.lg}>
          {`You deposited ${formattedSuccessAmount}`}
        </DynamicLabel>
      </div>
    );
  }

  if (showConfirm && pendingAmount != null) {
    return (
      <div className="deposit-screen confirm-overlay-container">
        <div
          className="confirm-overlay absolute top-0 left-0 w-full h-full flex items-center justify-center bg-opacity-70"
          role="dialog"
        >
          <div className="confirm-box bg-gray-800 p-6 text-white flex flex-col space-y-4">
            <DynamicLabel animated preselected size={FONT_SIZES.sm}>
              {`You are about to deposit ${formattedPending}`}
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
      </div>
    );
  }

  if (showAccountEntry) {
    return (
      <div className="deposit-screen flex flex-col items-center justify-center p-3 space-y-2">
        <div className="flex flex-col items-center justify-center p-3 space-y-2 relative bottom-[1rem]">
          <DynamicLabel animated size={FONT_SIZES.xs}>
            Enter the 6-digit account number:
          </DynamicLabel>

          <InputField
            value={accountNumber}
            onChange={(val) => setAccountNumber(val.replace(/\D/g, "").slice(0, PIN_DIGITS))}
            onEnter={handleAccountEnter}
            maxLength={PIN_DIGITS}
            data-testid="account-number-field"
            error={invalidAccountNumber}
          />
          <div className="flex w-full justify-start items-center">
            <NumericKeyboard
              onNumberPress={handleAccountNumberPress}
              onClearPress={handleAccountClear}
              onEnterPress={handleAccountEnter}
            />
          </div>
        </div>
        {invalidAccountNumber && (
          <div className="flex absolute left-[6rem] bottom-[0.6rem]">
            <DynamicLabel size={FONT_SIZES.xs}>Account format invalid</DynamicLabel>
          </div>
        )}
      </div>
    );
  }

  const invalidClass = isCustomAmountInvalid() ? "text-red-400 animate-pulse" : "";

  return (
    <div className="deposit-screen flex flex-col items-center text-center p-1 space-y-1">
      <div className="font-atm text-chat text-xs transition-all duration-150 ease-in-out text-center">
        Current Balance:{" "}
        <DynamicLabel animated typingSpeed={MEDIUM_TYPING_SPEED} size={FONT_SIZES.sm}>
          {formattedBalance}
        </DynamicLabel>
      </div>

      <div
        className={`font-atm text-chat text-xs transition-all duration-150 ease-in-out text-center ${invalidClass}`}
      >
        Daily Limit:{" "}
        <DynamicLabel typingSpeed={MEDIUM_TYPING_SPEED} size={FONT_SIZES.xs} animated>
          {formattedLimitAvailable}
        </DynamicLabel>
      </div>

      <DynamicLabel size={FONT_SIZES.xs} preselected>
        Enter your deposit amount:
      </DynamicLabel>

      {!isOther && (
        <div className="grid grid-cols-3 gap-1">
          {COMMON_AMOUNTS.map((amt) => (
            <button
              key={amt}
              disabled={amt > remainingLimit}
              className="common-amount-button border border-white text-white justify-center items-center"
              style={amt > remainingLimit ? { opacity: "20%" } : {}}
              onClick={() => handleCommonAmount(amt)}
            >
              ${amt}
            </button>
          ))}
          <button
            className="common-amount-button border border-yellow-300 text-yellow-300"
            onClick={() => setIsOther(true)}
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
            data-testid="deposit-amount-field"
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
    </div>
  );
};
