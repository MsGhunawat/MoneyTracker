import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, Layers, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";
import { 
  ResponsiveContainer, 
  BarChart, 
  XAxis, 
  Tooltip, 
  Bar, 
  Cell, 
  LabelList 
} from "recharts";
import { cn } from "../lib/utils";
import { Transaction } from "../types";
import { formatCurrency, formatPaymentMethod } from "../utils";
import { CategoryIcon } from "./CategoryIcon";

interface CategoryDetailViewProps {
  selectedCategory: string;
  categoryTrendData: any[];
  selectedCategoryTotal: number;
  categoryTransactions: Transaction[];
  setActiveTab: (tab: any) => void;
  previousTab: string;
  setSelectedCategory: (category: string | null) => void;
  handleTransactionClick: (tx: Transaction) => void;
  openAddTransaction: (category?: string) => void;
  categories: any[];
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  selectedCategory,
  categoryTrendData,
  selectedCategoryTotal,
  categoryTransactions,
  setActiveTab,
  previousTab,
  setSelectedCategory,
  handleTransactionClick,
  openAddTransaction,
  categories,
}) => {
  return (
    <motion.div
      key="categoryDetail"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto pb-32 max-w-lg mx-auto"
    >
      {/* Modern Dark Header */}
      <div className="bg-slate-900 text-white p-5 pt-6 pb-10 rounded-b-3xl shadow-xl relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/5 rounded-full -ml-24 -mb-24 blur-[60px]"></div>
        
        <div className="flex items-center gap-3 relative z-10">
          <button 
            onClick={() => {
              setActiveTab(previousTab as any);
              setSelectedCategory(null);
            }} 
            className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition-all active:scale-90"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-lg font-bold tracking-tight leading-none">Spend Areas</h2>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1">Category Analysis</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-5 relative z-10">
        {/* 6 Month Trend Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryTrendData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 8, fontWeight: 'bold', fill: '#94A3B8' }}
                  dy={10}
                />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white p-2 rounded-lg text-[10px] font-bold shadow-xl">
                          {formatCurrency(payload[0].value as number)}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  radius={[4, 4, 0, 0]} 
                  barSize={20}
                >
                  {categoryTrendData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === categoryTrendData.length - 1 ? "#0A2E1F" : "#10B981"} 
                      className="transition-all duration-300"
                    />
                  ))}
                  <LabelList 
                     dataKey="amount" 
                     position="top" 
                     content={(props: any) => {
                       const { x, y, width, value } = props;
                       return (
                         <text 
                           x={x + width / 2} 
                           y={y - 8} 
                           fill="#64748B" 
                           fontSize={8} 
                           fontWeight="bold" 
                           textAnchor="middle"
                         >
                           {Math.round(value).toLocaleString()}
                         </text>
                       );
                     }}
                   />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Header */}
        <div className="flex justify-between items-end px-2">
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">{selectedCategory}</h3>
          </div>
          <div className="text-right">
            <p className="text-lg font-extrabold text-red-600 tracking-tight">{formatCurrency(selectedCategoryTotal)}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{format(new Date(), "MMM yyyy")}</p>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {categoryTransactions.length > 0 ? (
            categoryTransactions.map((tx, idx) => (
              <div 
                key={tx.id} 
                onClick={() => handleTransactionClick(tx)}
                className={cn(
                  "p-4 flex items-center justify-between group hover:bg-slate-50 transition-all cursor-pointer active:scale-[0.98]",
                  idx !== categoryTransactions.length - 1 && "border-b border-slate-50",
                  !tx.isSpend && "bg-slate-50 opacity-60"
                )}
              >
                <div className="flex items-center gap-3">
                  {(() => {
                    const cat = categories.find(c => c.label === tx.category);
                    return (
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: cat?.color || "#94A3B8" }}
                      >
                        <CategoryIcon category={tx.category} size={16} />
                      </div>
                    );
                  })()}
                  <div>
                    <p className="font-bold text-slate-800 text-sm leading-tight">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{formatPaymentMethod(tx.paymentMethod)}</p>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{format(parseISO(tx.date), "dd MMM yyyy")}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 text-sm">{formatCurrency(tx.amount)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No transactions</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => openAddTransaction(selectedCategory || undefined)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-transform z-50 border-4 border-white"
      >
        <Plus size={24} />
      </button>
    </motion.div>
  );
};
