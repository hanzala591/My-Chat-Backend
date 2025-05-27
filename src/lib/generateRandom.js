export const generateRandom = () => {
  const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
  return randomSixDigit;
};
