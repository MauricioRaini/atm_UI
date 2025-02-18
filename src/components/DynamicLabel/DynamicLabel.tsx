import { useEffect, useState, ReactNode } from "react";
import "./DynamicLabel.css";

export type DynamicLabelProps = {
  children: ReactNode;
  animated?: boolean;
  masked?: boolean;
  preselected?: boolean;
  typingSpeed?: number;
  onAnimationEnd?: () => void;
};

export const DynamicLabel = ({
  children,
  animated = false,
  masked = false,
  preselected = false,
  typingSpeed = 50,
  onAnimationEnd,
}: DynamicLabelProps) => {
  const text = typeof children === "string" ? children : "";
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

  return (
    <span className={`dynamicLabel ${preselected ? "animate-pulse" : ""}`}>{displayedText}</span>
  );
};
