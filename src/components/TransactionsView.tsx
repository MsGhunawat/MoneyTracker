import React from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Layers 
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "../lib/utils";
import { Transaction } from "../types";
import { CATEGORY_COLORS } from "../constants";
import { formatCurrency } from "../utils";
import { CategoryIcon } from "./CategoryIcon";

interface TransactionsViewProps {
  transactions: Transaction[];
  totalMonthlySpend: number;
  setActiveTab: (tab: any) => void;
  handleTransactionClick: (tx: Transaction) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  totalMonthlySpend,
  setActiveTab,
  handleTransactionClick,
}) => {
  return (
    <motion.div
      key="transactions"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5 max-w-lg mx-auto"
    >
      {/* Transactions Header */}
      <header className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600 active:scale-90 transition-transform"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Transactions</h2>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-transform">
            <Search size={18} />
          </button>
          <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-transform">
            <Filter size={18} />
          </button>
          <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-transform">
            <Download size={18} />
          </button>
        </div>
      </header>

      {/* Transactions List */}
      <div className="space-y-3 pb-24">
        {transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t) => (
          <div 
            key={t.id} 
            onClick={() => handleTransactionClick(t)}
            className={cn(
              "bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-indigo-100 transition-all cursor-pointer active:scale-[0.98]",
              !t.isSpend && "opacity-40 grayscale"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105",
                t.type === "income" ? "bg-emerald-500" : "bg-indigo-500"
              )} style={{ backgroundColor: t.type === "expense" ? CATEGORY_COLORS[t.category as keyof typeof CATEGORY_COLORS] : undefined }}>
                <CategoryIcon category={t.category} size={16} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm leading-tight">{t.description}</p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{t.category} • {format(parseISO(t.date), "dd MMM")}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={cn(
                "font-bold text-sm",
                t.type === "income" ? "text-emerald-600" : "text-slate-800"
              )}>
                {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
