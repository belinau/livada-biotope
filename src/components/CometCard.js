import React from "react";
import { cn } from "../lib/cn";

export const CometCard = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative group block w-full h-full bg-black rounded-2xl overflow-hidden",
          className
        )}
        ref={ref}
        {...props}
      >
        <div className="absolute inset-0 w-full h-full bg-dot-white/[0.2]"></div>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/50 to-black"></div>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

export const Comet = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-px h-px bg-white rounded-full shadow-[0_0_8px_#fff]",
        "group-hover:animate-comet-lightspeed-sm sm:group-hover:animate-comet-lightspeed-md md:group-hover:animate-comet-lightspeed-lg",
        className
      )}
      {...props}
    ></div>
  );
};

export const CometCardContent = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn("relative z-10 w-full h-full p-8", className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export const CometCardImage = React.forwardRef(
  ({ className, src, alt, ...props }, ref) => {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          "absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-110",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
