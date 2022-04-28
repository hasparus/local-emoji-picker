import { EmojiData } from "../types";

export const FREQUENTLY_USED = "frequently used";
const storePath = "local-emoji-frequently-used";

type EmojiDataWithUsedNr = {
  used: number;
} & EmojiData;

export const getFrequentlyUsed = () => {
  const storedValue = localStorage.getItem(storePath);

  try {
    return storedValue
      ? (JSON.parse(storedValue) as Array<EmojiDataWithUsedNr>)
      : [];
  } catch {
    return [];
  }
};

export const addToFrequentlyUsed = (
  emojiData: EmojiData
): Array<EmojiDataWithUsedNr> => {
  const currentFrequentlyUsed = getFrequentlyUsed();

  let index = -1;
  const hasValue = currentFrequentlyUsed.find(
    (storedEmojiData: EmojiDataWithUsedNr, i) => {
      if (storedEmojiData.v === emojiData.v) {
        index = i;
        return true;
      }

      return false;
    }
  );

  if (hasValue) {
    const value = currentFrequentlyUsed[index];
    value.used = value.used + 1;

    currentFrequentlyUsed[index] = value;
    localStorage.setItem(storePath, JSON.stringify(currentFrequentlyUsed));
    return currentFrequentlyUsed;
  }

  const newFrequentlyUsed = [
    ...currentFrequentlyUsed,
    {
      ...emojiData,
      used: 1,
    },
  ];

  localStorage.setItem(storePath, JSON.stringify(newFrequentlyUsed));
  return newFrequentlyUsed;
};
