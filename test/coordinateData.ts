export const getRandomCoordinates = (min: number, max: number):number => {
  const randomNumber = Math.random() * (max - min) + min;

  return Number(randomNumber.toFixed(3));
}

