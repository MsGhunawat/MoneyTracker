import React from "react";
import { Layers } from "lucide-react";
import { CATEGORY_ICONS } from "../constants";

interface CategoryIconProps {
  category: string;
  size?: number;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, size = 18, className }) => {
  const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || Layers;
  return <Icon size={size} className={className} />;
};
