"use client";
import { useState } from "react";
import { BsMoonFill, BsSunFill } from "react-icons/bs";

// Define an enum for the theme names
enum Theme {
  Winter = "winter",
  Dracula = "dracula",
}

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(Theme.Winter);

  const toggleTheme = () => {
    const newTheme = theme === Theme.Winter ? Theme.Dracula : Theme.Winter;
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <button onClick={toggleTheme} className="btn btn-sm btn-outline">
      {theme === Theme.Winter ? (
        <BsMoonFill className="h-4 w-4" />
      ) : (
        <BsSunFill className="h-4 w-4" />
      )}
    </button>
  );
};

export default ThemeToggle;
