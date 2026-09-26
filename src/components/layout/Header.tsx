"use client";

import React from "react";
import { Nav } from "./nav";

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenMoMo?: () => void;
}

export function Header(props?: HeaderProps) {
  // Le Header républicain unifié est propulsé par la barre souveraine officielle Nav
  return <Nav />;
}
