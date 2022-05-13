export const getRandomNumber = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Math.floor(Math.random() * 900) + 1);
    });
  });
};

export const isWithinRange = (
  number: number,
  range: [number, number]
): boolean => {
  return number >= range[0] && number <= range[1] - 1;
};
