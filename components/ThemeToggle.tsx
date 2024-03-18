"use client";
import React, { useEffect, useState } from "react";
import { BsMoonFill, BsSunFill } from "react-icons/bs";

// Define an enum for the theme names
enum Theme {
  // Light = "light",
  // Dark = "dark",
  // Cupcake = "cupcake",
  // Bumblebee = "bumblebee",
  // Emerald = "emerald",
  // Corporate = "corporate",
  // Synthwave = "synthwave",
  // Retro = "retro",
  // Cyberpunk = "cyberpunk",
  // Valentine = "valentine",
  // Halloween = "halloween",
  // Garden = "garden",
  // Forest = "forest",
  // Aqua = "aqua",
  // Lofi = "lofi",
  // Pastel = "pastel",
  // Fantasy = "fantasy",
  // Wireframe = "wireframe",
  // Black = "black",
  // Luxury = "luxury",
  Dracula = "dracula",
  // CMYK = "cmyk",
  // Autumn = "autumn",
  // Business = "business",
  // Acid = "acid",
  // Lemonade = "lemonade",
  // Night = "night",
  // Coffee = "coffee",
  Winter = "winter",
}

const ThemeToggle: React.FC = () => {
  // Initialize theme state without accessing localStorage
  const [theme, setTheme] = useState<Theme>(Theme.Winter);

  // Effect to run once on component mount
  useEffect(() => {
    // Access localStorage only when component mounts on the client side
    const storedTheme = localStorage.getItem("theme") as Theme;
    if (storedTheme) {
      document.documentElement.setAttribute("data-theme", storedTheme);
      setTheme(storedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === Theme.Winter ? Theme.Dracula : Theme.Winter;
    // Update localStorage and document attribute when toggling theme
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  const Icon = theme === Theme.Winter ? BsMoonFill : BsSunFill;
  const label = `Switch to ${
    theme === Theme.Winter ? "Dracula" : "Winter"
  } theme`;

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-sm btn-outline"
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};

export default ThemeToggle;
