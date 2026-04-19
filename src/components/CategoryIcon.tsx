import React from "react";
import { Layers } from "lucide-react-native";
import { CATEGORY_ICONS } from "../constants";

interface CategoryIconProps {
  category: string;
  size?: number;
  color?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, size = 18, color = "#64748B" }) => {
  const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || Layers;
  return <Icon size={size} color={color} />;
};
