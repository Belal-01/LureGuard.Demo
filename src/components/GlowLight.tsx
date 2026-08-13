import React from "react";

interface GlowLightProps {
  color?: string;
  position?: string;
  size?: string;
  blur?: string;
  opacity?: string;
  offset?: string;
  className?: string;
  zIndex?: number;
}

export const GlowLight: React.FC<GlowLightProps> = ({
  color = "#32A7EF",
  position = "bottom-0 left-0",
  size = "w-[400px] h-[400px]",
  blur = "blur-[160px]",
  opacity = "opacity-70",
  offset = "-translate-x-1/3 translate-y-1/3",
  className = "",
  zIndex,
}) => {
  return (
    <div
      className={`absolute ${position} ${size} ${blur} ${opacity} ${offset} ${className} pointer-events-none rounded-full`}
      style={{
        background: color,
        ...(zIndex !== undefined ? { zIndex } : {}),
      }}
    ></div>
  );
};

export default GlowLight;
