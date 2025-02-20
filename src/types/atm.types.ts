export enum ATMButtons {
  UpperLeft = 0,
  MiddleTopLeft = 1,
  MiddleBottomLeft = 2,
  LowerLeft = 3,

  UpperRight = 4,
  MiddleTopRight = 5,
  MiddleBottomRight = 6,
  LowerRight = 7,
}

export enum CardTypes {
  Visa = "Visa",
  MasterCard = "MasterCard",
  Maestro = "Maestro",
  Plus = "Plus",
  Star = "Star",
  Pulse = "Pulse",
}

export const CARD_TAILWIND_CLASSES: Record<CardTypes, string> = {
  [CardTypes.Visa]: "visa",
  [CardTypes.MasterCard]: "mastercard",
  [CardTypes.Maestro]: "maestro",
  [CardTypes.Plus]: "plus",
  [CardTypes.Star]: "star",
  [CardTypes.Pulse]: "pulse",
};
