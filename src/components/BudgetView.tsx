import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Wallet, ShoppingCart, CreditCard, Banknote } from "lucide-react";
import { formatCurrency } from "../utils";

interface BudgetViewProps {
  monthlyBudget: number;
  setMonthlyBudget: (value: number) => void;
  setActiveTab: (tab: any) => void;
  previousTab: string;
}

export const BudgetView: React.FC<BudgetViewProps> = ({ 
  monthlyBudget, 
  setMonthlyBudget, 
  setActiveTab,
  previousTab
}) => {
  const [inputValue, setInputValue] = useState(monthlyBudget.toString());

  const handleSave = () => {
    const value = parseFloat(inputValue.replace(/[^0-9.]/g, ''));
    if (!isNaN(value)) {
      setMonthlyBudget(value);
      setActiveTab(previousTab);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="fixed inset-0 bg-white z-50 overflow-y-auto pb-10 max-w-lg mx-auto"
    >
      {/* Header */}
      <header className="p-4 flex items-center gap-3">
        <button 
          onClick={() => setActiveTab(previousTab)}
          className="w-9 h-9 flex items-center justify-center bg-slate-50 rounded-xl text-slate-600 active:scale-90 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Monthly budget</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Your spend trend</p>
        </div>
      </header>

      {/* Illustration Section */}
      <div className="px-6 py-4 flex flex-col items-center text-center relative overflow-hidden">
        <div className="w-full max-w-[240px] aspect-square relative flex items-center justify-center mb-6">
          {/* Semi-circle Gauge Illustration */}
          <div className="absolute inset-0 flex items-center justify-center">
             <svg className="w-full h-full -rotate-180 opacity-10" viewBox="0 0 200 100">
                <path 
                  d="M 20 100 A 80 80 0 0 1 180 100" 
                  fill="none" 
                  stroke="#0A2E1F" 
                  strokeWidth="20" 
                  strokeLinecap="round"
                />
             </svg>
          </div>
          
          {/* Floating Icons */}
          <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shadow-sm -rotate-12">
            <Banknote size={16} />
          </div>
          <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shadow-sm rotate-12">
            <ShoppingCart size={16} />
          </div>
          <div className="absolute top-1/2 left-8 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shadow-sm -rotate-6">
            <CreditCard size={16} />
          </div>
          <div className="absolute top-1/2 right-8 w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shadow-sm rotate-6">
            <Wallet size={16} />
          </div>

          {/* Center Wallet Icon */}
          <div className="relative z-10 w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 shadow-xl border-4 border-white">
            <Wallet size={36} strokeWidth={1.5} />
          </div>
        </div>

        <h2 className="text-xl font-bold text-[#0A2E1F] leading-tight mb-2 tracking-tight">
          Save every month,<br />Plan your budget today
        </h2>
      </div>

      {/* Input Section */}
      <div className="px-6 space-y-5">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">My monthly budget</h3>
          <div className="relative">
            <div className="absolute top-2.5 left-4 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
              Enter Budget
            </div>
            <input 
              type="text"
              value={inputValue.startsWith('₹') ? inputValue : `₹${inputValue}`}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setInputValue(val);
              }}
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 pt-7 pb-3 text-xl font-bold text-slate-800 focus:border-[#0A2E1F] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          We'll calculate your 'Safe to Spend' from the amount you enter above by deducting your spend and upcoming bills. That way you know how much you can spend and still stay in budget.
        </p>

        <button 
          onClick={handleSave}
          className="w-full bg-[#0A2E1F] text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-[#0A2E1F]/20 active:scale-[0.98] transition-all uppercase tracking-widest"
        >
          Set now
        </button>

        <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest">
          * Set budget to zero to disable
        </p>
      </div>
    </motion.div>
  );
};
