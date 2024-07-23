const tailwindColors = [
  "red-200",
  "blue-200",
  "green-200",
  "yellow-200",
  "purple-200",
  "pink-200",
  "indigo-200",
  "teal-200",
  "orange-200",
  "cyan-200",
];

export const getColorClasses = (strings: string[]): string[] => {
  return strings.map((_, index) => {
    const colorIndex = index % tailwindColors.length;
    return tailwindColors[colorIndex];
  });
};
