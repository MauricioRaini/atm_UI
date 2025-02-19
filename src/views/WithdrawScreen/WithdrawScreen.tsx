import React, { useEffect, useState } from "react";
import { AccessLevel, PIN_DIGITS } from "@/types/auth.types";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { ATMButtons, FONT_SIZES } from "@/types";
import { InputField } from "@/components/InputField";
import { NumericKeyboard } from "@/components/NumericKeyboard/NumericKeyboard";
import { DynamicLabel } from "@/components/DynamicLabel";
import { MainMenu } from "@/views/MainMenu";
import { getWithdrawInfo, performWithdraw } from "@/services";
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter";
import "./WithdrawScreen.css";

const COMMON_AMOUNTS = [20, 40, 60, 100, 200];
const MAX_WITHDRAW = 1000000; // unchanged from your code
const MEDIUM_TYPING_SPEED = 200;

export const WithdrawScreen: React.FC = () => {
  const { setButtonBinding, clearButtonBindings, navigateTo, setFullScreen } = useBlueScreenStore();

  // ===============================
  // Existing States (unchanged)
  // ===============================
  const [balance, setBalance] = useState(0);
  const [atmAvailable, setAtmAvailable] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(0);
  const [dailyUsed, setDailyUsed] = useState(0);
  const [limitLeft, setLimitLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOther, setIsOther] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);

  const remainingLimit = dailyLimit - dailyUsed;
  const customAmountValue = parseInt(customAmount, 10) || 0;

  // ===============================
  // New State for #2: success screen
  // ===============================
  const [withdrawalSuccessAmount, setWithdrawalSuccessAmount] = useState<number | null>(null);

  // ===============================
  // Formatting (existing)
  // ===============================
  const formattedBalance = useCurrencyFormatter(balance);
  const formattedPending = useCurrencyFormatter(pendingAmount ?? 0);
  const formattedLimitLeft = useCurrencyFormatter(limitLeft);
  const formattedSuccesAmount = useCurrencyFormatter(withdrawalSuccessAmount || 0);

  // ===============================
  // #1. Format the typed input as currency
  // (We store digits in `customAmount` but display currency in <InputField>)
  // ===============================
  // We'll keep the raw digits in `customAmount`. So let’s build a currency string:
  const formattedCustom = useCurrencyFormatter(customAmountValue);

  // #3. Whether typed amount is invalid
  const isCustomAmountInvalid = () => {
    if (customAmountValue <= 0) return false;
    if (customAmountValue > balance) return true;
    if (customAmountValue > remainingLimit) return true;
    if (customAmountValue > atmAvailable) return true;
    if (customAmountValue > MAX_WITHDRAW) return true;
    return false;
  };

  // ===============================
  // useEffects (unchanged logic)
  // ===============================
  useEffect(() => {
    setLimitLeft(dailyLimit - dailyUsed);
  }, [dailyLimit, dailyUsed]);

  useEffect(() => {
    clearButtonBindings();
    setButtonBinding(ATMButtons.LowerLeft, {
      label: "Cancel",
      action: () => navigateTo(<MainMenu />, AccessLevel.AUTHENTICATED),
    });

    getWithdrawInfo()
      .then((info) => {
        setBalance(info.balance);
        setAtmAvailable(info.atmAvailable);
        setDailyLimit(info.dailyLimit);
        setDailyUsed(info.dailyUsed);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load withdraw info");
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFullScreen(true);
  }, [setFullScreen]);

  // ===============================
  // #2. If `withdrawalSuccessAmount` is set, show a success screen for 3s
  // ===============================
  useEffect(() => {
    if (withdrawalSuccessAmount !== null) {
      const timer = setTimeout(() => {
        // After 3s, proceed to MainMenu
        navigateTo(<MainMenu />, AccessLevel.AUTHENTICATED);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [withdrawalSuccessAmount, navigateTo]);

  // ===============================
  // Handler: Confirm => perform withdrawal
  // modified to show the new success screen
  // ===============================
  const handleConfirm = async () => {
    if (pendingAmount == null) return;

    try {
      const result = await performWithdraw(pendingAmount);
      setBalance(result.newBalance);
      setAtmAvailable(result.newAtmAvailable);
      setDailyUsed(result.newDailyUsed);

      // #2. Instead of navigating immediately,
      // show a success message for 3 seconds
      setWithdrawalSuccessAmount(pendingAmount);
    } catch (err) {
      setError("Failed to withdraw. Please try again later.");
      throw err;
    }

    setShowConfirm(false);
    setPendingAmount(null);
    setCustomAmount("");
    setIsOther(false);
  };

  // ===============================
  // Handlers (unchanged)
  // ===============================
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
      customAmountValue > remainingLimit ||
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

  if (loading) {
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

  // ===============================
  // #2. Show success screen if user just withdrew money
  // (3s timer is in the useEffect above)
  // ===============================
  if (withdrawalSuccessAmount !== null) {
    const formattedWithdrawn = formattedSuccesAmount;
    return (
      <div className="withdraw-screen flex flex-col items-center justify-center p-6 space-y-4">
        <DynamicLabel animated preselected size={FONT_SIZES.lg}>
          {`You withdrew ${formattedWithdrawn}`}
        </DynamicLabel>
      </div>
    );
  }

  // ===============================
  // Normal screen flow
  // #3. Turn “Max withdrawal available” text red if invalid
  // ===============================
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

      {/* #3. If invalid, text is red + animate */}
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
          {/* 
            #1. Show typed value as currency in the InputField. 
            We'll store digits in "customAmount", 
            but display "formattedCustom".
           */}
          <InputField
            value={formattedCustom}
            onChange={(rawString) => {
              // We remove non-digit from rawString, so we can keep a numeric customAmount
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
