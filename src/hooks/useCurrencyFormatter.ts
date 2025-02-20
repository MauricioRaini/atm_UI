import { useMemo } from "react";

export const useCurrencyFormatter = (value: string | number) => {
  return useMemo(() => {
    const number = typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;
    if (isNaN(number)) return "$0.00";
    return number.toLocaleString("en-US", { style: "currency", currency: "USD" });
  }, [value]);
};
