import React from "react";
import { Layers, Utensils, ShoppingBag, Car, Receipt, Smartphone, Heart, TrendingUp, Home, HandCoins, Scissors, Users, Book, Banknote, Plane, CreditCard, Gift, Dog, Music, Camera, Gamepad2, Sparkles, Undo } from "lucide-react";

interface CategoryIconProps {
  category: string;
  size?: number;
  className?: string;
  icon?: React.ComponentType<any>;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, size = 18, className, icon }) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    "Dining": Utensils,
    "Grocery": ShoppingBag,
    "Shopping": ShoppingBag,
    "Transport": Car,
    "Bills/Utilities": Receipt,
    "Entertainment": Smartphone,
    "Medical": Heart,
    "Investments": TrendingUp,
    "Rent/Mortgage": Home,
    "Loan": HandCoins,
    "Beauty/Fitness": Scissors,
    "Maid/Driver": Users,
    "Education": Book,
    "Miscellaneous": Layers,
    "Income": Banknote,
    "Travel": Plane,
    "Subscriptions": CreditCard,
    "Gifts": Gift,
    "Pets": Dog,
    "Books": Book,
    "Music": Music,
    "Camera": Camera,
    "Gaming": Gamepad2,
    "Salary": Banknote,
    "Bonus": Sparkles,
    "Refund": Undo,
  };
  
  const Icon = icon || iconMap[category] || Layers;
  return <Icon size={size} className={className} />;
};
