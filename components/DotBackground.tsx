import React from "react";

// Define the props type to include children of type React.ReactNode
interface DotBackgroundProps {
  children?: React.ReactNode;
}

export const DotBackground: React.FC<DotBackgroundProps> = ({ children }) => {
  return (
    <div className="h-screen w-full bg-black dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      {/* Render children here */}
      {children}

      {/* Optionally, render default content if no children are provided */}
      {!children && (
        <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
          Backgrounds
        </p>
      )}
    </div>
  );
};
