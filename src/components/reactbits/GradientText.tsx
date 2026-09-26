import React from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export function GradientText({
  children,
  className,
  colors = ["#0A5C36", "#10B981", "#F2B822", "#0A5C36"],
  animationSpeed = 6,
  showBorder = false,
  ...props
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <span
      className={cn(
        "relative inline-block bg-cover bg-clip-text text-transparent animate-gradient-flow font-extrabold",
        showBorder && "border-b border-primary/40",
        className
      )}
      style={gradientStyle}
      {...props}
    >
      {children}
    </span>
  );
}
