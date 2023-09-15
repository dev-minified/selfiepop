export const addColorHistory = (
  color: string,
  colorList: string[] = [],
): string[] => {
  if (colorList.includes(color)) return colorList;
  if (colorList.length < 4) {
    return [...colorList, color];
  }
  const newColors = [...colorList];
  newColors.pop();
  newColors.unshift(color);
  return newColors;
};
