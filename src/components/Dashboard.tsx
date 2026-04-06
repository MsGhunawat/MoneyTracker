import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Eye, 
  EyeOff, 
  Layers, 
  ChevronRight,
  TrendingUp,
  Landmark,
  CreditCard,
  X,
  ArrowLeft,
  Edit2,
  Wallet,
  Plus
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { cn } from "../lib/utils";
import { Transaction, Account } from "../types";
import { CATEGORY_COLORS } from "../constants";
import { formatCurrency } from "../utils";
import { CategoryIcon } from "./CategoryIcon";

interface DashboardProps {
  totalMonthlySpend: number;
  topSpendAreas: any[];
  transactions: Transaction[];
  accounts: Account[];
  showBalance: boolean;
  setShowBalance: (show: boolean) => void;
  setActiveTab: (tab: any) => void;
  setPreviousTab: (tab: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSummaryView: (view: any) => void;
  handleTransactionClick: (t: Transaction) => void;
  openAddTransaction: () => void;
  monthlyBudget: number;
  cashInHand: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  totalMonthlySpend,
  topSpendAreas,
  transactions,
  accounts,
  showBalance,
  setShowBalance,
  setActiveTab,
  setPreviousTab,
  setSelectedCategory,
  setSummaryView,
  handleTransactionClick,
  openAddTransaction,
  monthlyBudget,
  cashInHand,
}) => {
  const budget = monthlyBudget || 35000;
  const [showAccountModal, setShowAccountModal] = React.useState(false);
  const [showCashModal, setShowCashModal] = React.useState(false);
  const [accountModalType, setAccountModalType] = React.useState<"bank" | "credit_card">("bank");
  
  // Mock trend data for sparkline
  const sparklineData = [
    { day: 1, amount: 1200 },
    { day: 5, amount: 4500 },
    { day: 10, amount: 8900 },
    { day: 15, amount: 15600 },
    { day: 20, amount: 22400 },
    { day: 25, amount: 28900 },
    { day: 30, amount: totalMonthlySpend },
  ];

  const arcLength = 393.75; 

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-0 pb-24"
    >
      {/* Modern Professional Header */}
      <header className="bg-slate-900 text-white p-6 pb-12 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full -ml-24 -mb-24 blur-[80px]"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-1">SpendWise Premium</p>
            <h1 className="text-xl font-extrabold tracking-tight text-white">{format(new Date(), "MMMM yyyy")}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => openAddTransaction()}
              className="w-10 h-10 rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center transition-transform active:scale-90"
              aria-label="Quick Add"
            >
              <Plus size={20} strokeWidth={3} />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center">
              <Wallet size={18} className="text-indigo-300" />
            </div>
          </div>
        </div>

        {/* Circular Gauge Section */}
        <div className="flex flex-col items-center justify-center mb-6 relative z-10">
          <div 
            onClick={() => {
              setPreviousTab("dashboard");
              setActiveTab("budget");
            }}
            className="w-40 h-40 relative flex items-center justify-center cursor-pointer group"
          >
            <div className={cn(
              "absolute inset-0 rounded-full blur-2xl transition-colors duration-1000",
              totalMonthlySpend > budget ? "bg-red-500/10" : "bg-emerald-500/5"
            )}></div>
            
            <svg className="w-full h-full" viewBox="0 0 224 224">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={totalMonthlySpend > budget ? "#EF4444" : "#10B981"} />
                  <stop offset="100%" stopColor={totalMonthlySpend > budget ? "#F87171" : "#34D399"} />
                </linearGradient>
              </defs>
              
              <path 
                d="M 45 175 A 94 94 0 1 1 179 175" 
                fill="none" 
                stroke="rgba(255,255,255,0.05)" 
                strokeWidth="16" 
                strokeLinecap="round"
              />
              
              <motion.path 
                d="M 45 175 A 94 94 0 1 1 179 175" 
                fill="none" 
                stroke="url(#gaugeGradient)" 
                strokeWidth="16" 
                strokeLinecap="round"
                strokeDasharray={arcLength}
                initial={{ strokeDashoffset: arcLength }}
                animate={{ strokeDashoffset: arcLength * (1 - Math.min(totalMonthlySpend / budget, 1)) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-1">
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-0.5">
                {totalMonthlySpend > budget ? "Over" : "Left"}
              </p>
              <p className={cn(
                "text-xl font-extrabold tracking-tight",
                totalMonthlySpend > budget ? "text-white" : "text-emerald-400"
              )}>
                {totalMonthlySpend > budget 
                  ? formatCurrency(totalMonthlySpend - budget)
                  : formatCurrency(budget - totalMonthlySpend)}
              </p>
              <div className="mt-1 px-2 py-0.5 bg-white/10 rounded-full">
                <p className="text-[7px] font-bold text-white/70">24 days left</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between w-full max-w-[160px] mt-1">
            <div className="text-left">
              <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest">Budget</p>
              <p className="text-[9px] font-bold text-white/70">{formatCurrency(budget)}</p>
            </div>
            <div className="text-right">
              <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest">Spent</p>
              <p className={cn(
                "text-[9px] font-bold",
                totalMonthlySpend > budget ? "text-red-400" : "text-emerald-400"
              )}>
                {formatCurrency(totalMonthlySpend)}
              </p>
            </div>
          </div>
        </div>

        {/* Glassmorphism Stats Cards */}
        <div className="grid grid-cols-2 gap-3 relative z-10">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Bank Balance</p>
              <button onClick={() => setShowBalance(!showBalance)} className="text-white/40 hover:text-white/60 transition-colors">
                {showBalance ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
            </div>
            <p className="text-base font-bold tracking-tight text-white">
              {showBalance ? "₹45,230" : "₹XX,XXX"}
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-2">Total Spend</p>
            <p className="text-base font-bold tracking-tight text-white">{formatCurrency(totalMonthlySpend)}</p>
          </div>
        </div>

        {/* Daily Insights */}
        <div className="mt-3 relative z-10">
          <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center justify-center gap-3 w-full backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60">
              <TrendingUp size={14} />
            </div>
            <div className="flex items-center gap-3">
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Daily Average Spend</p>
              <p className="text-sm font-bold text-white tracking-tight">{formatCurrency(totalMonthlySpend / 30)}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-8 space-y-8 max-w-lg mx-auto">
        {/* Latest Transactions */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Latest Transactions</h3>
          </div>
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-4">
            <div className="space-y-3">
              {transactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 3)
                .map((t, idx, arr) => (
                <div 
                  key={t.id} 
                  onClick={() => handleTransactionClick(t)}
                  className={cn(
                    "flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all",
                    idx !== arr.length - 1 && "border-b border-slate-50 pb-3",
                    !t.isSpend && "opacity-40 grayscale"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: t.type === "expense" ? CATEGORY_COLORS[t.category as keyof typeof CATEGORY_COLORS] : "#10B981" }}>
                      <CategoryIcon category={t.category} size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm leading-tight">{t.description}</p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{t.category} • {format(parseISO(t.date), "dd MMM")}</p>
                    </div>
                  </div>
                  <p className={cn(
                    "font-bold text-sm",
                    t.type === "income" ? "text-emerald-600" : "text-slate-800"
                  )}>
                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                  </p>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setActiveTab("transactions")}
              className="w-full py-3 bg-slate-50 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest active:scale-95 transition-all border border-slate-100"
            >
              View All Transactions
            </button>
          </div>
        </section>

        {/* Top Spend Areas */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Spend Areas</h3>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative overflow-hidden">
            {/* Pie Chart Visualization */}
            <div className="h-48 w-full mb-6 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topSpendAreas}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="amount"
                    stroke="none"
                  >
                    {topSpendAreas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category as keyof typeof CATEGORY_COLORS] || '#E2E8F0'} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
                <p className="text-sm font-bold text-slate-800">{formatCurrency(totalMonthlySpend)}</p>
              </div>
            </div>

            {/* Spend Areas List - Top 3 */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {topSpendAreas.slice(0, 3).map((area) => (
                <div 
                  key={area.category} 
                  className="flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => {
                    setPreviousTab("dashboard");
                    setSelectedCategory(area.category);
                    setActiveTab("categoryDetail");
                  }}
                >
                  <div className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0" style={{ borderColor: CATEGORY_COLORS[area.category as keyof typeof CATEGORY_COLORS] + '20', color: CATEGORY_COLORS[area.category as keyof typeof CATEGORY_COLORS] }}>
                     <CategoryIcon category={area.category} size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-slate-700 text-sm">{area.category}</h4>
                      <p className="font-bold text-slate-800 text-sm">{formatCurrency(area.amount)}</p>
                    </div>
                    <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${area.percentage}%` }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[area.category as keyof typeof CATEGORY_COLORS] }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                setActiveTab("summary");
                setSummaryView("spendAreas");
              }}
              className="w-full py-3 bg-slate-50 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest active:scale-95 transition-all border border-slate-100"
            >
              View All Spend Areas
            </button>
          </div>
        </section>

        {/* Cash Wallet Section */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cash Wallet</h3>
          </div>
          <div 
            onClick={() => setShowCashModal(true)}
            className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shadow-sm">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Cash Wallet</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Physical Cash</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">{formatCurrency(cashInHand)}</p>
                <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Details</button>
              </div>
            </div>
            
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex mb-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '15%' }}
                className="h-full bg-emerald-500" 
              />
              <div className="flex-1 bg-red-400"></div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-800">₹24,356</p>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Spend</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-800">₹28,756</p>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Withdrawn</p>
              </div>
            </div>
          </div>
        </section>

        {/* My Accounts Section */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">My Accounts</h3>
            <button className="text-xs font-bold text-indigo-600 uppercase tracking-widest">View All</button>
          </div>
          <div className="bg-white rounded-3xl p-1 shadow-sm border border-slate-100 overflow-hidden">
            <div 
              onClick={() => {
                setAccountModalType("bank");
                setShowAccountModal(true);
              }}
              className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Landmark size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Bank Account</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{accounts.filter(a => a.type === "bank").length} accounts</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
            
            <div className="h-px bg-slate-50 mx-4"></div>
            
            <div 
              onClick={() => {
                setAccountModalType("credit_card");
                setShowAccountModal(true);
              }}
              className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Credit card</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{accounts.filter(a => a.type === "credit_card").length} cards</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          </div>
        </section>
      </main>

      {/* Cash Details Modal */}
      <AnimatePresence>
        {showCashModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCashModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-[#0A2E1F] rounded-t-[3rem] overflow-hidden flex flex-col h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 pb-8 text-white">
                <div className="flex justify-between items-center mb-8">
                  <button 
                    onClick={() => setShowCashModal(false)}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <Edit2 size={18} />
                  </button>
                </div>
                
                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Cash Wallet Balance</p>
                <p className="text-[10px] text-indigo-200/60 font-bold mb-4">
                  Current Month
                </p>
                <p className="text-4xl font-black tracking-tighter">
                  {formatCurrency(cashInHand)}
                </p>
              </div>

              {/* Cash Stats */}
              <div className="bg-white/5 px-6 py-4 border-b border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">Total Withdrawn</p>
                  <p className="text-lg font-bold text-white">₹28,756</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">Total Spent</p>
                  <p className="text-lg font-bold text-white">₹24,356</p>
                </div>
              </div>

              {/* Cash Transactions List */}
              <div className="flex-1 bg-white overflow-y-auto p-6 space-y-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cash Transactions</h4>
                <div className="space-y-4">
                  {transactions
                    .filter(t => t.paymentMethod === 'cash')
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((t, idx, arr) => (
                    <div 
                      key={t.id} 
                      onClick={() => {
                        handleTransactionClick(t);
                        setShowCashModal(false);
                      }}
                      className={cn(
                        "flex items-center justify-between group cursor-pointer active:scale-95 transition-all",
                        idx !== arr.length - 1 && "border-b border-slate-50 pb-4"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md",
                          t.type === "income" ? "bg-green-500" : "bg-indigo-500"
                        )} style={{ backgroundColor: t.type === "expense" ? CATEGORY_COLORS[t.category as keyof typeof CATEGORY_COLORS] : undefined }}>
                          <CategoryIcon category={t.category} size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{t.description}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.category} • {format(parseISO(t.date), "dd MMM")}</p>
                        </div>
                      </div>
                      <p className={cn(
                        "font-bold text-base",
                        t.type === "income" ? "text-green-500" : "text-slate-800"
                      )}>
                        {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                      </p>
                    </div>
                  ))}
                  {transactions.filter(t => t.paymentMethod === 'cash').length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-slate-400 text-sm italic">No cash transactions yet</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Details Modal */}
      <AnimatePresence>
        {showAccountModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAccountModal(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-[#0A2E1F] rounded-t-[3rem] overflow-hidden flex flex-col h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 pb-8 text-white">
                <div className="flex justify-between items-center mb-8">
                  <button 
                    onClick={() => setShowAccountModal(false)}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <Edit2 size={18} />
                  </button>
                </div>
                
                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Current Total Balance</p>
                <p className="text-[10px] text-indigo-200/60 font-bold mb-4">
                  {accounts.filter(a => a.type === accountModalType).length} Accounts
                </p>
                <p className="text-4xl font-black tracking-tighter">
                  {formatCurrency(accounts.filter(a => a.type === accountModalType).reduce((sum, a) => sum + a.amount, 0))}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex px-6 border-b border-white/5">
                <button 
                  onClick={() => setAccountModalType("bank")}
                  className={cn(
                    "flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all relative",
                    accountModalType === "bank" ? "text-white" : "text-white/40"
                  )}
                >
                  Bank A/C
                  {accountModalType === "bank" && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                  )}
                </button>
                <button 
                  onClick={() => setAccountModalType("credit_card")}
                  className={cn(
                    "flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all relative",
                    accountModalType === "credit_card" ? "text-white" : "text-white/40"
                  )}
                >
                  Credit Cards
                  {accountModalType === "credit_card" && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                  )}
                </button>
              </div>

              {/* Account List */}
              <div className="flex-1 bg-white overflow-y-auto p-6 space-y-6">
                {accounts.filter(a => a.type === accountModalType).map((account) => (
                  <div key={account.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center bg-slate-50 overflow-hidden">
                        {accountModalType === "bank" ? (
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
                            {account.name.includes("SBI") ? "SBI" : "AU"}
                          </div>
                        ) : (
                          <div className="w-8 h-8 flex items-center justify-center">
                             {account.name.includes("Axis") ? (
                               <div className="text-pink-600 font-black text-lg italic">A</div>
                             ) : (
                               <div className="text-orange-600 font-black text-lg italic">i</div>
                             )}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{account.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{account.number}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800 text-sm">
                        {accountModalType === "credit_card" && account.amount > 0 ? "-" : ""}
                        {formatCurrency(account.amount)}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold">
                        {account.isEstimated ? "Estimated Bal" : `Updated ${format(parseISO(account.updatedAt), "dd MMM")}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
