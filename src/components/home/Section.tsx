import React from "react";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  container?: "default" | "wide" | "narrow" | "full";
  background?: "white" | "gray" | "gradient" | "transparent";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

const containerSizes = {
  default: "max-w-7xl",
  wide: "max-w-[1440px]",
  narrow: "max-w-5xl",
  full: "max-w-none",
};

const backgrounds = {
  white: "bg-white",
  gray: "bg-slate-50",
  gradient: "bg-gradient-to-b from-white via-slate-50/30 to-white",
  transparent: "bg-transparent",
};

const paddings = {
  none: "",
  sm: "px-4 md:px-6",
  md: "px-4 md:px-8",
  lg: "px-6 md:px-12",
  xl: "px-8 md:px-16",
};

export default function Section({
  children,
  className = "",
  id,
  container = "default",
  background = "transparent",
  padding = "sm",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative w-full ${backgrounds[background]} ${className}`}
    >
      <div
        className={`mx-auto ${containerSizes[container]} ${paddings[padding]}`}
      >
        {children}
      </div>
    </section>
  );
}