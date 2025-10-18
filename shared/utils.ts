
export const pickRandom = <T,>(arr: T[]): T | undefined => {
  if (!arr || arr.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};
