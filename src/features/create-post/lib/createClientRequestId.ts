const ID_RADIX = 36;
const RANDOM_LENGTH = 10;

export const createClientRequestId = (): string =>
  `${Date.now().toString(ID_RADIX)}-${Math.random()
    .toString(ID_RADIX)
    .slice(2, 2 + RANDOM_LENGTH)}`;
