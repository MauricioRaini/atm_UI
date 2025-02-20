import { ReactElement, useEffect, useMemo } from "react";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { ATMButton } from "@/components/ATMButton";
import atmHeader from "@/assets/atm_sign.png";
import brands from "@/assets/creditcard_sprite.png";
import graffitiHeader from "@/assets/graffiti.png";
import sticker from "@/assets/sticker_graf.png";
import systems from "@/assets/systems.png";
import "./ATM.css";
import { AccessLevel, ATMButtons, CARD_TAILWIND_CLASSES, FONT_SIZES } from "@/types";
import { DynamicLabel } from "@/components";
import { WelcomeScreen } from "../WelcomeScreen";
import { CARD_IMAGES } from "@/constants/cards.constants";
import { useFinancialStore } from "@/store";

export const ATM = (): ReactElement => {
  const {
    screenContent,
    buttonBindings,
    fullScreen,
    isBlocked,
    unblockUser,
    setFullScreen,
    navigateTo,
    isAuthenticated,
  } = useBlueScreenStore();

  const { userCardType } = useFinancialStore();

  const handleUnlock = () => {
    unblockUser();
    navigateTo(<WelcomeScreen />, AccessLevel.PUBLIC);
  };

  const memoizedImages = useMemo(
    () => ({
      atmHeader,
      graffitiHeader,
      brands,
      sticker,
    }),
    [],
  );

  const memoizedButtons = useMemo(
    () => (
      <>
        <div className="atm-buttons left">
          {[
            ATMButtons.UpperLeft,
            ATMButtons.MiddleTopLeft,
            ATMButtons.MiddleBottomLeft,
            ATMButtons.LowerLeft,
          ].map((index) => (
            <div key={index} className="relative">
              <ATMButton isLeftButton onClick={buttonBindings[index]?.action || (() => {})} />
              {buttonBindings[index]?.label && (
                <p className={`button-label label-${index}`}>- {buttonBindings[index]?.label}</p>
              )}
            </div>
          ))}
        </div>
        <div className="atm-buttons right">
          {[
            ATMButtons.UpperRight,
            ATMButtons.MiddleTopRight,
            ATMButtons.MiddleBottomRight,
            ATMButtons.LowerRight,
          ].map((index) => (
            <div key={index} className="relative">
              <ATMButton onClick={buttonBindings[index]?.action || (() => {})} />
              {buttonBindings[index]?.label && (
                <p className={`button-label label-${index}`}>{buttonBindings[index]?.label} -</p>
              )}
            </div>
          ))}
        </div>
      </>
    ),
    [buttonBindings],
  );

  const memoizedUserBlocked = (
    <div className="flex flex-col justify-center align-center absolute top-[0rem] p-[1rem] gap-[0.5rem]">
      <DynamicLabel size={FONT_SIZES.sm} preselected>
        You are locked out for 5 minutes due to too many failed attempts.
      </DynamicLabel>
      <DynamicLabel size={FONT_SIZES.sm} animated>
        {"Press button to bypass block (dev env only)"}
      </DynamicLabel>
      <ATMButton onClick={handleUnlock} hidePath />
    </div>
  );

  useEffect(() => {
    setFullScreen(!isBlocked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBlocked]);

  return (
    <div className="atm-street-container">
      <div data-testid="atm-container" className="atm-container">
        <div className="atm-header">
          <img src={memoizedImages.atmHeader} alt="ATM Header" className="atm-image-header" />
          <img src={memoizedImages.graffitiHeader} alt="Graffiti" className="graffiti-header" />
        </div>
        <div className="top-shadow-machine" />
        <div className="machine-container">
          <div className="card-brands-container">
            <img src={memoizedImages.brands} alt="ATM Brands" className="card-brands-sprite" />

            {isAuthenticated && userCardType && CARD_IMAGES[userCardType] && (
              <img
                src={CARD_IMAGES[userCardType]}
                alt={`${userCardType} Logo`}
                className={`highlighted-brand fade-in ${CARD_TAILWIND_CLASSES[userCardType]}`}
              />
            )}
          </div>
          <div data-testid="blue-screen" className="blue-screen">
            <div
              className={`${fullScreen ? "main-content-blue-screen-full" : "main-content-blue-screen"}`}
            >
              {isBlocked ? memoizedUserBlocked : screenContent}
            </div>
          </div>
          <img src={memoizedImages.sticker} alt="Sticker Graffiti" className="sticker-atm" />
          <img src={systems} alt="systems logo" className="systems-logo" />
          <div className="atm-buttons-container">{memoizedButtons}</div>
        </div>
      </div>
    </div>
  );
};
