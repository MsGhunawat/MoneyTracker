import React from "react";
import { motion } from "motion/react";
import { Plus, Search, Utensils, ShoppingBag, Car, Receipt, Smartphone, Heart, TrendingUp, Home, HandCoins, Scissors, Users, Book, Layers, Banknote, Plane, CreditCard, Gift, Dog, Music, Camera, Gamepad2, Sparkles, Undo, Dumbbell } from "lucide-react";
import { cn } from "../lib/utils";
import { Transaction } from "../types";

interface CategoryPickerProps {
  showCategoryPicker: boolean;
  setShowCategoryPicker: (show: boolean) => void;
  categories: any[];
  editingTransaction: Transaction | null;
  setEditingTransaction: (tx: Transaction | null) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  showCategoryPicker,
  setShowCategoryPicker,
  categories,
  editingTransaction,
  setEditingTransaction,
}) => {
  if (!showCategoryPicker) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-slate-800">Select Category</h3>
          <button 
            onClick={() => setShowCategoryPicker(false)}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"
          >
            <Plus size={20} className="rotate-45" />
          </button>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search category" 
            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-8">
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">All Categories</h4>
            <div className="grid grid-cols-4 gap-y-8 gap-x-4">
              {categories.map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => {
                    if (editingTransaction) {
                      setEditingTransaction({ ...editingTransaction, category: cat.label });
                    }
                    setShowCategoryPicker(false);
                  }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div 
                    className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-md transition-all group-active:scale-90 group-hover:shadow-lg group-hover:-translate-y-1",
                      editingTransaction?.category === cat.label && "ring-4 ring-indigo-500 ring-offset-2 scale-110"
                    )}
                    style={{ backgroundColor: cat.color }}
                  >
                    {(() => {
                      const iconMap: Record<string, any> = {
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
                      const IconComponent = iconMap[cat.label] || Layers;
                      return <IconComponent size={24} />;
                    })()}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold text-center leading-tight transition-colors",
                    editingTransaction?.category === cat.label ? "text-indigo-600" : "text-slate-500"
                  )}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
