"use client";
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../../lib/cn";

export const NavbarLogo = ({ className }) => {
  return (
    <Link to="/" className={cn("text-xl font-bold cursor-pointer text-primary", className)}>
      <img src="/images/livada-logo-white.svg" alt="Livada.bio Logo" className="h-8" />
    </Link>
  );
};
