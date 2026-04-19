import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions } from "react-native";
import { MotiView, AnimatePresence, motify } from "moti";
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
  Plus,
  MessageSquare,
  Calendar
} from "lucide-react-native";
import { format, parseISO } from "date-fns";
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import { LineChart, PieChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";
import { Transaction, Account } from "../types";
import { CATEGORY_COLORS } from "../constants";
import { formatCurrency } from "../utils";
import { CategoryIcon } from "./CategoryIcon";
import { ActivityIndicator } from "react-native";
import { SyncRange } from "../services/smsService";

const MotiPath = motify(Path)();

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
  handleSMSSync?: (range: SyncRange) => Promise<void>;
  isSyncingSMS?: boolean;
  monthlyBudget: number;
  cashInHand: number;
  categories: any[];
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
  handleSMSSync,
  isSyncingSMS,
  monthlyBudget,
  cashInHand,
  categories,
}) => {
  const budget = monthlyBudget || 35000;
  const [showAccountModal, setShowAccountModal] = React.useState(false);
  const [showCashModal, setShowCashModal] = React.useState(false);
  const [showSyncModal, setShowSyncModal] = React.useState(false);
  const [accountModalType, setAccountModalType] = React.useState<"bank" | "credit_card">("bank");
  
  const sparklineData = [
    { value: 1200 },
    { value: 4500 },
    { value: 8900 },
    { value: 15600 },
    { value: 22400 },
    { value: 28900 },
    { value: totalMonthlySpend },
  ];

  const pieData = topSpendAreas.map(area => {
    const cat = categories.find(c => c.label === area.category);
    return {
      value: area.amount,
      color: cat?.color || "#E2E8F0",
      text: area.category
    };
  });

  const arcLength = 393.75; 
  const progress = Math.min(totalMonthlySpend / budget, 1);

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      {/* Modern Professional Header */}
      <View style={tw`bg-slate-900 rounded-b-[40px] shadow-2xl overflow-hidden`}>
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          style={tw`p-6 pb-12`}
        >
          {/* Background Decorative Elements */}
          <View style={[tw`absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32`, { opacity: 0.1 }]} />
          
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <View>
              <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1`}>MoneyTracker Premium</Text>
              <Text style={tw`text-xl font-extrabold tracking-tight text-white`}>{format(new Date(), "MMMM yyyy")}</Text>
            </View>
            <View style={tw`flex-row items-center gap-3`}>
                <TouchableOpacity 
                  onPress={() => setShowSyncModal(true)}
                  disabled={isSyncingSMS}
                  style={tw`w-10 h-10 rounded-2xl ${isSyncingSMS ? 'bg-slate-700' : 'bg-indigo-500/20'} border border-indigo-500/30 flex items-center justify-center`}
                >
                  {isSyncingSMS ? (
                    <ActivityIndicator size="small" color="#818CF8" />
                  ) : (
                    <MessageSquare size={18} color="#A5B4FC" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => openAddTransaction()}
                  style={tw`w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg`}
                >
                  <Plus size={20} color="white" strokeWidth={3} />
                </TouchableOpacity>
              <View style={tw`w-10 h-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center`}>
                <Wallet size={18} color="#A5B4FC" />
              </View>
            </View>
          </View>

          {/* Circular Gauge Section */}
          <View style={tw`flex-col items-center justify-center mb-6`}>
            <TouchableOpacity 
              onPress={() => {
                setPreviousTab("dashboard");
                setActiveTab("budget");
              }}
              style={tw`w-40 h-40 relative flex items-center justify-center`}
            >
              <View style={[tw`absolute inset-0 rounded-full`, { backgroundColor: totalMonthlySpend > budget ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.05)', filter: 'blur(20px)' }]} />
              
              <Svg width="160" height="160" viewBox="0 0 224 224">
                <Defs>
                  <SvgGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={totalMonthlySpend > budget ? "#EF4444" : "#10B981"} />
                    <Stop offset="100%" stopColor={totalMonthlySpend > budget ? "#F87171" : "#34D399"} />
                  </SvgGradient>
                </Defs>
                
                <Path 
                  d="M 45 175 A 94 94 0 1 1 179 175" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="16" 
                  strokeLinecap="round"
                />
                
                <Path 
                  d="M 45 175 A 94 94 0 1 1 179 175" 
                  fill="none" 
                  stroke="url(#gaugeGradient)" 
                  strokeWidth="16" 
                  strokeLinecap="round"
                  strokeDasharray={arcLength}
                  strokeDashoffset={arcLength * (1 - progress)}
                />
              </Svg>
              
              <View style={tw`absolute inset-0 flex flex-col items-center justify-center pt-1`}>
                <Text style={tw`text-[8px] font-bold text-white/40 uppercase tracking-widest mb-0.5`}>
                  {totalMonthlySpend > budget ? "Over" : "Left"}
                </Text>
                <Text style={tw`text-xl font-extrabold tracking-tight ${totalMonthlySpend > budget ? "text-white" : "text-emerald-400"}`}>
                  {totalMonthlySpend > budget 
                    ? formatCurrency(totalMonthlySpend - budget)
                    : formatCurrency(budget - totalMonthlySpend)}
                </Text>
                <View style={tw`mt-1 px-2 py-0.5 bg-white/10 rounded-full`}>
                  <Text style={tw`text-[7px] font-bold text-white/70`}>24 days left</Text>
                </View>
              </View>
            </TouchableOpacity>
            
            <View style={tw`flex-row justify-between w-full max-w-[160px] mt-1`}>
              <View>
                <Text style={tw`text-[7px] font-bold text-white/30 uppercase tracking-widest`}>Budget</Text>
                <Text style={tw`text-[9px] font-bold text-white/70`}>{formatCurrency(budget)}</Text>
              </View>
              <View style={tw`items-end`}>
                <Text style={tw`text-[7px] font-bold text-white/30 uppercase tracking-widest`}>Spent</Text>
                <Text style={tw`text-[9px] font-bold ${totalMonthlySpend > budget ? "text-red-400" : "text-emerald-400"}`}>
                  {formatCurrency(totalMonthlySpend)}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={tw`flex-row gap-2`}>
            <View style={tw`flex-1 bg-white/5 border border-white/10 p-3 rounded-2xl`}>
              <View style={tw`flex-row items-center justify-between mb-1.5`}>
                <Text style={tw`text-[7px] font-bold text-white/40 uppercase tracking-widest`}>Bank Balance</Text>
                <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                  {showBalance ? <Eye size={10} color="rgba(255,255,255,0.4)" /> : <EyeOff size={10} color="rgba(255,255,255,0.4)" />}
                </TouchableOpacity>
              </View>
              <Text style={tw`text-xs font-bold tracking-tight text-white`}>
                {showBalance ? "₹45,230" : "₹XX,XXX"}
              </Text>
            </View>

            <View style={tw`flex-1 bg-white/5 border border-white/10 p-3 rounded-2xl`}>
              <View style={tw`flex-row items-center gap-1.5 mb-1.5`}>
                <TrendingUp size={10} color="#818CF8" />
                <Text style={tw`text-[7px] font-bold text-white/40 uppercase tracking-widest`}>Daily Insights</Text>
              </View>
              <Text style={tw`text-xs font-bold tracking-tight text-white`}>{formatCurrency(totalMonthlySpend / 30)}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <ScrollView style={tw`flex-1 px-4 pt-8 pb-4`}>
        {/* Latest Transactions */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3`}>Latest Transactions</Text>
          <View style={tw`bg-white rounded-3xl p-4 shadow-sm border border-slate-100`}>
            {transactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 3)
              .map((t, idx, arr) => (
              <TouchableOpacity 
                key={t.id} 
                onPress={() => handleTransactionClick(t)}
                style={tw`flex-row items-center justify-between py-3 ${idx !== arr.length - 1 ? "border-b border-slate-50" : ""} ${!t.isSpend ? "opacity-40" : ""}`}
              >
                <View style={tw`flex-row items-center gap-3`}>
                  <View style={[tw`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm`, { backgroundColor: t.type === "expense" ? (categories.find(c => c.label === t.category)?.color || "#6366F1") : "#10B981" }]}>
                    <CategoryIcon category={t.category} size={16} color="white" />
                  </View>
                  <View>
                    <Text style={tw`font-bold text-slate-800 text-sm`}>{t.description}</Text>
                    <Text style={tw`text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5`}>{t.category} • {format(parseISO(t.date), "dd MMM")}</Text>
                  </View>
                </View>
                <Text style={tw`font-bold text-sm ${t.type === "income" ? "text-emerald-600" : "text-slate-800"}`}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              onPress={() => setActiveTab("transactions")}
              style={tw`w-full py-3 bg-slate-50 rounded-xl mt-4 border border-slate-100 items-center`}
            >
              <Text style={tw`text-indigo-600 text-xs font-bold uppercase tracking-widest`}>View All Transactions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Top Spend Areas */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3`}>Top Spend Areas</Text>
          <View style={tw`bg-white rounded-3xl p-5 shadow-sm border border-slate-100`}>
            <View style={tw`h-48 w-full mb-6 items-center justify-center`}>
              <PieChart
                data={pieData}
                donut
                radius={75}
                innerRadius={55}
                innerCircleColor={'white'}
                centerLabelComponent={() => (
                  <View style={tw`items-center`}>
                    <Text style={tw`text-[8px] font-bold text-slate-400 uppercase tracking-widest`}>Total</Text>
                    <Text style={tw`text-sm font-bold text-slate-800`}>{formatCurrency(totalMonthlySpend)}</Text>
                  </View>
                )}
              />
            </View>

            <View style={tw`mb-6 gap-4`}>
              {topSpendAreas.slice(0, 3).map((area) => {
                const cat = categories.find(c => c.label === area.category);
                return (
                  <TouchableOpacity 
                    key={area.category} 
                    onPress={() => {
                      setPreviousTab("dashboard");
                      setSelectedCategory(area.category);
                      setActiveTab("categoryDetail");
                    }}
                    style={tw`flex-row items-center gap-3`}
                  >
                    <View style={[tw`w-8 h-8 rounded-full border flex items-center justify-center`, { borderColor: (cat?.color || '#6366F1') + '20' }]}>
                       <CategoryIcon category={area.category} size={14} color={cat?.color || '#6366F1'} />
                    </View>
                    <View style={tw`flex-1`}>
                      <View style={tw`flex-row justify-between items-center mb-1`}>
                        <Text style={tw`font-bold text-slate-700 text-sm`}>{area.category}</Text>
                        <Text style={tw`font-bold text-slate-800 text-sm`}>{formatCurrency(area.amount)}</Text>
                      </View>
                      <View style={tw`w-full bg-slate-100 h-1 rounded-full overflow-hidden`}>
                        <View style={[tw`h-full rounded-full`, { width: `${area.percentage}%`, backgroundColor: cat?.color || '#6366F1' }]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity 
              onPress={() => {
                setActiveTab("summary");
                setSummaryView("spendAreas");
              }}
              style={tw`w-full py-3 bg-slate-50 rounded-xl border border-slate-100 items-center`}
            >
              <Text style={tw`text-indigo-600 text-xs font-bold uppercase tracking-widest`}>View All Spend Areas</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cash Wallet Section */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3`}>Cash Wallet</Text>
          <TouchableOpacity 
            onPress={() => setShowCashModal(true)}
            style={tw`bg-white rounded-3xl p-5 shadow-sm border border-slate-100`}
          >
            <View style={tw`flex-row justify-between items-start mb-4`}>
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-sm`}>
                  <Wallet size={20} color="white" />
                </View>
                <View>
                  <Text style={tw`text-sm font-bold text-slate-800`}>Cash Wallet</Text>
                  <Text style={tw`text-[10px] text-slate-400 font-bold uppercase tracking-widest`}>Physical Cash</Text>
                </View>
              </View>
              <View style={tw`items-end`}>
                <Text style={tw`text-sm font-bold text-slate-800`}>{formatCurrency(cashInHand)}</Text>
                <Text style={tw`text-[10px] font-bold text-indigo-600 uppercase tracking-widest`}>Details</Text>
              </View>
            </View>
            
            <View style={tw`w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex-row mb-3`}>
              <View style={[tw`h-full bg-emerald-500`, { width: '15%' }]} />
              <View style={tw`flex-1 bg-red-400`} />
            </View>
            
            <View style={tw`flex-row justify-between items-center`}>
              <View>
                <Text style={tw`text-[10px] font-bold text-slate-800`}>₹24,356</Text>
                <Text style={tw`text-[8px] text-slate-400 font-bold uppercase tracking-widest`}>Spend</Text>
              </View>
              <View style={tw`items-end`}>
                <Text style={tw`text-[10px] font-bold text-slate-800`}>₹28,756</Text>
                <Text style={tw`text-[8px] text-slate-400 font-bold uppercase tracking-widest`}>Withdrawn</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* My Accounts Section */}
        <View style={tw`mb-20`}>
          <View style={tw`flex-row justify-between items-center mb-3`}>
            <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest`}>My Accounts</Text>
            <Text style={tw`text-[10px] font-bold text-indigo-600 uppercase tracking-widest`}>View All</Text>
          </View>
          <View style={tw`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden`}>
            <TouchableOpacity 
              onPress={() => {
                setAccountModalType("bank");
                setShowAccountModal(true);
              }}
              style={tw`flex-row items-center justify-between p-4 border-b border-slate-50`}
            >
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center`}>
                  <Landmark size={20} color="#2563EB" />
                </View>
                <View>
                  <Text style={tw`font-bold text-slate-800 text-sm`}>Bank Account</Text>
                  <Text style={tw`text-[10px] text-slate-400 font-bold uppercase tracking-wider`}>{accounts.filter(a => a.type === "bank").length} accounts</Text>
                </View>
              </View>
              <ChevronRight size={16} color="#CBD5E1" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => {
                setAccountModalType("credit_card");
                setShowAccountModal(true);
              }}
              style={tw`flex-row items-center justify-between p-4`}
            >
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center`}>
                  <CreditCard size={20} color="#4F46E5" />
                </View>
                <View>
                  <Text style={tw`font-bold text-slate-800 text-sm`}>Credit card</Text>
                  <Text style={tw`text-[10px] text-slate-400 font-bold uppercase tracking-wider`}>{accounts.filter(a => a.type === "credit_card").length} cards</Text>
                </View>
              </View>
              <ChevronRight size={16} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Account Details Modal */}
      <Modal
        visible={showAccountModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAccountModal(false)}
      >
        <View style={tw`flex-1 bg-black/60 justify-end`}>
          <TouchableOpacity style={tw`flex-1`} onPress={() => setShowAccountModal(false)} />
          <View style={tw`bg-slate-900 rounded-t-[40px] h-[90%] overflow-hidden`}>
            <LinearGradient
              colors={['#0F172A', '#1E293B']}
              style={tw`p-6 pb-8`}
            >
              <View style={tw`flex-row justify-between items-center mb-8`}>
                <TouchableOpacity onPress={() => setShowAccountModal(false)} style={tw`w-10 h-10 rounded-full bg-white/10 items-center justify-center`}>
                  <ArrowLeft size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={tw`w-10 h-10 rounded-full bg-white/10 items-center justify-center`}>
                  <Edit2 size={18} color="white" />
                </TouchableOpacity>
              </View>
              
              <Text style={tw`text-slate-300 text-xs font-bold uppercase tracking-widest mb-1`}>Current Total Balance</Text>
              <Text style={tw`text-[10px] text-slate-400 font-bold mb-4`}>
                {accounts.filter(a => a.type === accountModalType).length} Accounts
              </Text>
              <Text style={tw`text-4xl font-black text-white tracking-tighter`}>
                {formatCurrency(accounts.filter(a => a.type === accountModalType).reduce((sum, a) => sum + a.amount, 0))}
              </Text>
            </LinearGradient>

            <View style={tw`flex-row px-6 border-b border-indigo-500/10 bg-slate-900`}>
              <TouchableOpacity 
                onPress={() => setAccountModalType("bank")}
                style={tw`flex-1 py-4 items-center ${accountModalType === "bank" ? "border-b-2 border-indigo-400" : ""}`}
              >
                <Text style={tw`text-xs font-bold uppercase tracking-widest ${accountModalType === "bank" ? "text-white" : "text-white/40"}`}>Bank A/C</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setAccountModalType("credit_card")}
                style={tw`flex-1 py-4 items-center ${accountModalType === "credit_card" ? "border-b-2 border-indigo-400" : ""}`}
              >
                <Text style={tw`text-xs font-bold uppercase tracking-widest ${accountModalType === "credit_card" ? "text-white" : "text-white/40"}`}>Credit Cards</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={tw`flex-1 bg-white p-6`}>
              {accounts.filter(a => a.type === accountModalType).map((account) => (
                <View key={account.id} style={tw`flex-row items-center justify-between mb-6`}>
                  <View style={tw`flex-row items-center gap-4`}>
                    <View style={tw`w-12 h-12 rounded-full border border-slate-100 items-center justify-center bg-slate-50 overflow-hidden`}>
                      {accountModalType === "bank" ? (
                        <View style={tw`w-8 h-8 rounded-full bg-blue-600 items-center justify-center`}>
                          <Text style={tw`text-white font-bold text-[10px]`}>{account.name.includes("SBI") ? "SBI" : "AU"}</Text>
                        </View>
                      ) : (
                        <View style={tw`w-8 h-8 items-center justify-center`}>
                           <Text style={tw`text-pink-600 font-black text-lg italic`}>{account.name.includes("Axis") ? "A" : "i"}</Text>
                        </View>
                      )}
                    </View>
                    <View>
                      <Text style={tw`font-bold text-slate-800 text-sm`}>{account.name}</Text>
                      <Text style={tw`text-[10px] text-slate-400 font-bold uppercase tracking-wider`}>{account.number}</Text>
                    </View>
                  </View>
                  <View style={tw`items-end`}>
                    <Text style={tw`font-bold text-slate-800 text-sm`}>
                      {accountModalType === "credit_card" && account.amount > 0 ? "-" : ""}
                      {formatCurrency(account.amount)}
                    </Text>
                    <Text style={tw`text-[9px] text-slate-400 font-bold`}>
                      {account.isEstimated ? "Estimated Bal" : `Updated ${format(parseISO(account.updatedAt), "dd MMM")}`}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Cash Details Modal */}
      <Modal
        visible={showCashModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCashModal(false)}
      >
        <View style={tw`flex-1 bg-black/60 justify-end`}>
          <TouchableOpacity style={tw`flex-1`} onPress={() => setShowCashModal(false)} />
          <View style={tw`bg-slate-900 rounded-t-[40px] h-[90%] overflow-hidden`}>
            <LinearGradient
              colors={['#0F172A', '#1E293B']}
              style={tw`p-6 pb-8`}
            >
              <View style={tw`flex-row justify-between items-center mb-8`}>
                <TouchableOpacity onPress={() => setShowCashModal(false)} style={tw`w-10 h-10 rounded-full bg-white/10 items-center justify-center`}>
                  <ArrowLeft size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={tw`w-10 h-10 rounded-full bg-white/10 items-center justify-center`}>
                  <Edit2 size={18} color="white" />
                </TouchableOpacity>
              </View>
              
              <Text style={tw`text-slate-300 text-xs font-bold uppercase tracking-widest mb-1`}>Cash Wallet Balance</Text>
              <Text style={tw`text-[10px] text-slate-400 font-bold mb-4`}>
                Current Month
              </Text>
              <Text style={tw`text-4xl font-black text-white tracking-tighter`}>
                {formatCurrency(cashInHand)}
              </Text>
            </LinearGradient>

            <View style={tw`bg-white/5 px-6 py-4 border-b border-white/5 flex-row gap-4 bg-slate-900`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1`}>Total Withdrawn</Text>
                <Text style={tw`text-lg font-bold text-white`}>₹28,756</Text>
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1`}>Total Spent</Text>
                <Text style={tw`text-lg font-bold text-white`}>₹24,356</Text>
              </View>
            </View>

            <ScrollView style={tw`flex-1 bg-white p-6`}>
              <Text style={tw`text-xs font-bold text-slate-400 uppercase tracking-widest mb-6`}>Cash Transactions</Text>
              {transactions
                .filter(t => t.paymentMethod === 'cash')
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((t, idx, arr) => (
                <TouchableOpacity 
                  key={t.id} 
                  onPress={() => {
                    handleTransactionClick(t);
                    setShowCashModal(false);
                  }}
                  style={tw`flex-row items-center justify-between py-4 ${idx !== arr.length - 1 ? "border-b border-slate-50" : ""}`}
                >
                  <View style={tw`flex-row items-center gap-3`}>
                    <View style={[tw`w-10 h-10 rounded-xl flex items-center justify-center shadow-md`, { backgroundColor: t.type === "expense" ? (categories.find(c => c.label === t.category)?.color || "#6366F1") : "#10B981" }]}>
                      <CategoryIcon category={t.category} size={18} color="white" />
                    </View>
                    <View>
                      <Text style={tw`font-bold text-slate-800 text-sm`}>{t.description}</Text>
                      <Text style={tw`text-[10px] text-slate-400 font-bold uppercase tracking-wider`}>{t.category} • {format(parseISO(t.date), "dd MMM")}</Text>
                    </View>
                  </View>
                  <Text style={tw`font-bold text-base ${t.type === "income" ? "text-green-500" : "text-slate-800"}`}>
                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                  </Text>
                </TouchableOpacity>
              ))}
              {transactions.filter(t => t.paymentMethod === 'cash').length === 0 && (
                <View style={tw`items-center py-12`}>
                  <Text style={tw`text-slate-400 text-sm italic`}>No cash transactions yet</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* SMS Sync Range Modal */}
      <Modal
        visible={showSyncModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSyncModal(false)}
      >
        <View style={tw`flex-1 bg-black/60 justify-center items-center px-6`}>
          <View style={tw`bg-white w-full rounded-[30px] p-6 shadow-2xl`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <View>
                <Text style={tw`text-lg font-bold text-slate-800`}>Sync SMS</Text>
                <Text style={tw`text-[10px] text-slate-400 font-bold uppercase tracking-widest`}>Fetch missing transactions</Text>
              </View>
              <TouchableOpacity onPress={() => setShowSyncModal(false)} style={tw`p-2 bg-slate-50 rounded-full`}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={tw`gap-3 mb-6`}>
              {[
                { label: 'Today', value: 'today', desc: 'Scan messages received today' },
                { label: 'Last Week', value: 'week', desc: 'Scan messages from past 7 days' },
                { label: 'Last Month', value: 'month', desc: 'Scan messages from past 30 days' },
                { label: 'All Time', value: 'all', desc: 'Scan all available inbox messages' }
              ].map((opt) => (
                <TouchableOpacity 
                  key={opt.value}
                  onPress={() => {
                    setShowSyncModal(false);
                    handleSMSSync?.(opt.value as SyncRange);
                  }}
                  style={tw`flex-row items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100`}
                >
                  <View style={tw`w-10 h-10 bg-white rounded-xl items-center justify-center shadow-sm`}>
                    <Calendar size={18} color="#6366F1" />
                  </View>
                  <View>
                    <Text style={tw`font-bold text-slate-800 text-sm`}>{opt.label}</Text>
                    <Text style={tw`text-[10px] text-slate-400 font-semibold`}>{opt.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={tw`text-[9px] text-slate-400 italic text-center leading-relaxed`}>
              Duplicates will be automatically skipped based on amount and date.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};
