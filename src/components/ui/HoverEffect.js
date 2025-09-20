"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn"; // Adjusted path
import FilteredImage from "./FilteredImage";

export const HoverEffect = ({
  items,
  className,
  onClickItem,
  getItemLayoutId, // New prop to get layoutId for each item
  filterType = 'glass' // Add filterType prop with default value
}) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      className={cn("grid grid-cols-2 sm:grid-cols-3 gap-4", className)}>
      {items.map((item, idx) => (
        <a
          href={item?.link}
          key={item?.link}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={(e) => {
            if (onClickItem) {
              e.preventDefault();
              onClickItem(item); // Pass the item object containing originalObservation
            }
          }}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-gradient-to-b from-[var(--glass-i-bg)] to-[var(--ch-border)] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card layoutId={getItemLayoutId && getItemLayoutId(item, idx)}>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
            {item.imageSrc && (
                <FilteredImage
                    src={item.imageSrc}
                    alt={item.title}
                    filterType={filterType}
                    className="h-60 w-full rounded-lg object-cover object-top mt-4"
                />
            )}
          </Card>
        </a>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
  layoutId
}) => {
  return (
    <motion.div
      layoutId={layoutId}
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-gradient-to-b from-[var(--glass-i-bg)] to-[var(--glass-bg-nav)] border-[var(--glass-border)] border-opacity-50 group-hover:border-[var(--glass-border)] relative z-20 backdrop-blur-sm",
        className
      )}>
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </motion.div>
  );
};
export const CardTitle = ({
  className,
  children
}) => {
  return (
    <h4 className={cn("text-[var(--text-muted)] font-bold tracking-wide mt-4 lowercase", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children
}) => {
  return (
    <p className={cn("mt-8 text-[var(--text-muted)] tracking-wide leading-relaxed text-sm", className)}>
      {children}
    </p>
  );
};
