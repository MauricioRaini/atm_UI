import { useEffect, useState } from "react";
import "./DynamicLabel.css";

export type DynamicLabelProps = {
  text: string;
  animated?: boolean;
  masked?: boolean;
  textType?: "h1" | "h2" | "label";
  typingSpeed?: number;
  onAnimationEnd?: () => void;
};

export const DynamicLabel = ({
  text,
  animated = false,
  masked = false,
  textType = "label",
  typingSpeed = 50,
  onAnimationEnd,
}: DynamicLabelProps) => {
  const [displayedText, setDisplayedText] = useState(
    masked ? "*".repeat(text.length) : animated ? "" : text,
  );
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (!animated) {
      setDisplayedText(masked ? "*".repeat(text.length) : text);
      return;
    }

    setDisplayedText("");
    setCharIndex(0);

    const interval = setInterval(() => {
      setCharIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex > text.length) {
          clearInterval(interval);
          if (onAnimationEnd) onAnimationEnd();
        }
        return nextIndex;
      });
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [text, animated, masked, typingSpeed, onAnimationEnd]);

  useEffect(() => {
    if (masked) {
      setDisplayedText("*".repeat(text.length));
    } else if (animated) {
      setDisplayedText(text.slice(0, charIndex));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, charIndex, masked]);

  const ElementTag = textType === "h1" ? "h1" : textType === "h2" ? "h2" : "span";

  return <ElementTag className="dynamicLabel">{displayedText}</ElementTag>;
};
