const tailwindColors = [
  "bg-red-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-indigo-200",
  "bg-teal-200",
  "bg-orange-200",
  "bg-cyan-200",
];

export const getColorClasses = (strings: string[]): string[] => {
  return strings.map((_, index) => {
    const colorIndex = index % tailwindColors.length;
    return tailwindColors[colorIndex];
  });
};
