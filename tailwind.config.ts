import type { Config } from "tailwindcss";
import { DefaultColors } from "tailwindcss/types/generated/colors";
import svgToTinyDataUri from "./third-party/mini-svg-data-uri";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),
    require("tailwindcss-animate"),
    // require("@tailwindcss/aspect-ratio"),
    addVariablesForColors,
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: string) => ({
            backgroundImage: `url("${svgToTinyDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-grid-small": (value: string) => ({
            backgroundImage: `url("${svgToTinyDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-dot": (value: string) => ({
            backgroundImage: `url("${svgToTinyDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },
  ],
  daisyui: {
    themes: [
      "winter",
      "dracula",
      "black",
      "bumblebee",
      "emerald",
      "lofi",
      "forest",
      "halloween",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "dark",
      "light",
    ],
  },
};
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
function flattenColorPalette(colors: DefaultColors): Record<string, string> {
  const result: Record<string, string> = {};

  const processEntry = (
    key: string,
    value: string | { [key: string]: string },
    prefix: string = ""
  ) => {
    const newKey = prefix ? `${prefix}-${key}` : key;

    if (typeof value === "object") {
      Object.entries(value).forEach(([subKey, subValue]) => {
        processEntry(subKey, subValue, newKey);
      });
    } else {
      result[newKey] = value;
    }
  };

  Object.entries(colors).forEach(([key, value]) => {
    if (typeof value === "string") {
      result[key] = value;
    } else {
      processEntry(key, value);
    }
  });

  return result;
}

export default config;
