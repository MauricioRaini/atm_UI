import { CardTypes } from "./atm.types";

export enum AccessLevel {
  PUBLIC,
  AUTHENTICATED,
}

export const PIN_DIGITS = 6;

export interface User {
  id: string;
  name: string;
  cardNumber: string;
  userCardType: CardTypes;
  balance: number;
  dailyLimit: number;
  dailyUsed: number;
}
