import React from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Layers, 
  Calendar,
  Plus
} from "lucide-react";
import { format, subMonths, subYears, addMonths, addYears, parseISO } from "date-fns";
import { 
  ResponsiveContainer, 
  BarChart, 
  XAxis, 
  Tooltip, 
  Bar, 
  Cell, 
  PieChart as RePieChart, 
  Pie 
} from "recharts";
import { cn } from "../lib/utils";
import { Transaction } from "../types";
import { CATEGORY_COLORS } from "../constants";
import { formatCurrency } from "../utils";
import { CategoryIcon } from "./CategoryIcon";

interface SummaryProps {
  summaryType: "monthly" | "yearly";
  setSummaryType: (type: "monthly" | "yearly") => void;
  summaryDate: Date;
  setSummaryDate: (date: Date | ((prev: Date) => Date)) => void;
  summaryView: "overview" | "spendAreas";
  setSummaryView: (view: "overview" | "spendAreas") => void;
  trendData: any[];
  totalSummarySpend: number;
  summarySpendAreas: any[];
  filteredTransactions: Transaction[];
  setActiveTab: (tab: any) => void;
  setPreviousTab: (tab: string) => void;
  setSelectedCategory: (category: string | null) => void;
  handleTransactionClick: (tx: Transaction) => void;
  openAddTransaction: () => void;
}

export const Summary: React.FC<SummaryProps> = ({
  summaryType,
  setSummaryType,
  summaryDate,
  setSummaryDate,
  summaryView,
  setSummaryView,
  trendData,
  totalSummarySpend,
  summarySpendAreas,
  filteredTransactions,
  setActiveTab,
  setPreviousTab,
  setSelectedCategory,
  handleTransactionClick,
  openAddTransaction,
}) => {
  return (
    <motion.div
      key="summary"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-0 pb-24 max-w-lg mx-auto"
    >
      {/* Modern Professional Header */}
      <header className="bg-slate-900 text-white p-6 pb-12 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (summaryView === "spendAreas") {
                  setSummaryView("overview");
                } else {
                  setActiveTab("dashboard");
                }
              }}
              className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-white active:scale-90 transition-transform"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-1">Financial Insights</p>
              <h1 className="text-xl font-extrabold tracking-tight text-white">
                {summaryType === "monthly" ? format(summaryDate, "MMMM yyyy") : format(summaryDate, "yyyy")}
              </h1>
            </div>
          </div>
          <button 
            onClick={() => openAddTransaction()}
            className="w-10 h-10 rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center transition-transform active:scale-90"
            aria-label="Quick Add"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>

        {summaryView === "overview" && (
          <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl flex relative z-10 border border-white/10">
            <button 
              onClick={() => setSummaryType("monthly")}
              className={cn(
                "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300",
                summaryType === "monthly" ? "bg-white text-slate-900 shadow-lg" : "text-white/60 hover:text-white"
              )}
            >
              Monthly
            </button>
            <button 
              onClick={() => setSummaryType("yearly")}
              className={cn(
                "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300",
                summaryType === "yearly" ? "bg-white text-slate-900 shadow-lg" : "text-white/60 hover:text-white"
              )}
            >
              Yearly
            </button>
          </div>
        )}
      </header>

      <div className="px-4 py-6 space-y-6">
        {summaryView === "overview" && (
          <>
            <div className="flex items-center justify-between px-2">
              <button 
                onClick={() => setSummaryDate(prev => summaryType === "monthly" ? subMonths(prev, 1) : subYears(prev, 1))}
                className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600 active:scale-90 transition-transform"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {summaryType === "monthly" ? "Monthly Summary" : "Yearly Summary"}
                </p>
              </div>
              <button 
                onClick={() => setSummaryDate(prev => summaryType === "monthly" ? addMonths(prev, 1) : addYears(prev, 1))}
                className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-600 active:scale-90 transition-transform"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <TrendingUp size={14} className="text-indigo-600" />
                Spend Trend
              </h3>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
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
                      onClick={(data) => {
                        if (data && data.date) {
                          setSummaryDate(data.date);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      {trendData.map((entry, index) => {
                        const isSelected = summaryType === 'monthly' 
                          ? format(entry.date, 'yyyy-MM') === format(summaryDate, 'yyyy-MM')
                          : entry.date.getFullYear() === summaryDate.getFullYear();
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={isSelected ? "#6366F1" : "#E2E8F0"} 
                            className="transition-all duration-300"
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="h-56 w-full flex items-center justify-center relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Spend</p>
              <p className="text-2xl font-extrabold text-slate-800 tracking-tight">{formatCurrency(totalSummarySpend)}</p>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={summarySpendAreas}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="amount"
                  stroke="none"
                >
                  {summarySpendAreas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category as keyof typeof CATEGORY_COLORS] || '#E2E8F0'} />
                  ))}
                </Pie>
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <section className="space-y-3">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {summarySpendAreas.map((area, idx) => (
              <div 
                key={area.category} 
                className={cn(
                  "p-4 flex items-center gap-3 transition-all hover:bg-slate-50 cursor-pointer active:scale-[0.98]",
                  idx !== summarySpendAreas.length - 1 && "border-b border-slate-50"
                )}
                onClick={() => {
                  setPreviousTab("summary");
                  setSelectedCategory(area.category);
                  setActiveTab("categoryDetail");
                }}
              >
                <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle 
                      cx="20" cy="20" r="18" 
                      fill="none" stroke="#F1F5F9" strokeWidth="3" 
                    />
                    <motion.circle 
                      cx="20" cy="20" r="18" 
                      fill="none" 
                      stroke={CATEGORY_COLORS[area.category as keyof typeof CATEGORY_COLORS] || '#E2E8F0'} 
                      strokeWidth="3" 
                      strokeDasharray={2 * Math.PI * 18}
                      initial={{ strokeDashoffset: 2 * Math.PI * 18 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 18 * (1 - area.percentage / 100) }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="relative z-10 text-slate-600">
                    <CategoryIcon category={area.category} size={14} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{area.category}</h4>
                    <div className="text-right">
                      <p className="font-bold text-slate-800 text-sm">{formatCurrency(area.amount)}</p>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{area.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    {formatCurrency(area.amount * 0.8)} more than last month
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {summaryView === "overview" && (
          <section className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transactions</h3>
              <button className="text-xs font-bold text-indigo-600 uppercase tracking-widest">See All</button>
            </div>
            <div className="space-y-2">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.slice(0, 5).map(tx => (
                  <div 
                    key={tx.id} 
                    onClick={() => handleTransactionClick(tx)}
                    className={cn(
                      "bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-indigo-100 transition-all cursor-pointer active:scale-[0.98]",
                      !tx.isSpend && "opacity-40 grayscale"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: CATEGORY_COLORS[tx.category as keyof typeof CATEGORY_COLORS] || "#94A3B8" }}
                      >
                        <CategoryIcon category={tx.category} size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-tight">{tx.description}</p>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                          {format(parseISO(tx.date), "dd MMM, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-bold text-sm",
                        tx.type === "income" ? "text-emerald-600" : "text-slate-800"
                      )}>
                        {tx.type === "income" ? "+" : "-"} {formatCurrency(tx.amount)}
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{tx.paymentMethod}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-200 text-center">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No transactions</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
};
