import visa from "@/assets/visa.png";
import mastercard from "@/assets/mastercard.png";
import maestro from "@/assets/maestro.png";
import plus from "@/assets/plus.png";
import star from "@/assets/star.png";
import pulse from "@/assets/pulse.png";
import { CardTypes } from "@/types";

export const CARD_IMAGES: Record<CardTypes, string> = {
  [CardTypes.Visa]: visa,
  [CardTypes.MasterCard]: mastercard,
  [CardTypes.Maestro]: maestro,
  [CardTypes.Plus]: plus,
  [CardTypes.Star]: star,
  [CardTypes.Pulse]: pulse,
};
