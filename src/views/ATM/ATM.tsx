import { useMemo } from "react";
import { useBlueScreenStore } from "@/store/BlueScreenStore";
import { ATMButton } from "@/components/ATMButton";
import atmHeader from "@/assets/atm_sign.png";
import brands from "@/assets/creditcard_sprite.png";
import graffitiHeader from "@/assets/graffiti.png";
import sticker from "@/assets/sticker_graf.png";
import systems from "@/assets/systems.png";
import "./ATM.css";

export const ATM = () => {
  const { screenContent, buttonBindings, fullScreen } = useBlueScreenStore();

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
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="relative">
              <ATMButton isLeftButton onClick={buttonBindings[index]?.action || (() => {})} />
              {buttonBindings[index]?.label && (
                <p className={`button-label label-${index}`}>- {buttonBindings[index]?.label}</p>
              )}
            </div>
          ))}
        </div>
        <div className="atm-buttons right">
          {[4, 5, 6, 7].map((index) => (
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

  return (
    <div className="atm-street-container">
      <div data-testid="atm-container" className="atm-container">
        <div className="atm-header">
          <img src={memoizedImages.atmHeader} alt="ATM Header" className="atm-image-header" />
          <img src={memoizedImages.graffitiHeader} alt="Graffiti" className="graffiti-header" />
        </div>
        <div className="top-shadow-machine" />
        <div className="machine-container">
          <img src={memoizedImages.brands} alt="ATM Brands" className="card-brands-sprite" />
          <div data-testid="blue-screen" className="blue-screen">
            <div
              className={`${fullScreen ? "main-content-blue-screen-full" : "main-content-blue-screen"}`}
            >
              {screenContent}
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
