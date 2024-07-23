import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/utils/getColorClasses.ts",
  ],
  safelist: [
    "before:bg-red-200",
    "before:bg-blue-200",
    "before:bg-green-200",
    "before:bg-yellow-200",
    "before:bg-purple-200",
    "before:bg-pink-200",
    "before:bg-indigo-200",
    "before:bg-teal-200",
    "before:bg-orange-200",
    "before:bg-cyan-200",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
