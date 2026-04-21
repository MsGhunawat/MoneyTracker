import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions, Platform } from "react-native";
import { MotiView, AnimatePresence } from "moti";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Layers, 
  Calendar,
  Plus,
  ArrowUpRight
} from "lucide-react-native";
import { format, subMonths, subYears, addMonths, addYears, parseISO, endOfMonth } from "date-fns";
import { BarChart, PieChart, LineChart } from "react-native-gifted-charts";
import Svg, { Circle } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";
import { Transaction } from "../types";
import { CATEGORY_COLORS } from "../constants";
import { formatCurrency } from "../utils";
import { CategoryIcon } from "./CategoryIcon";

interface SummaryProps {
  summaryType: "monthly" | "yearly";
  setSummaryType: (type: "monthly" | "yearly") => void;
  summaryDate: Date;
  setSummaryDate: (date: Date | ((prev: Date) => Date)) => void;
  summaryWindowDate: Date;
  setSummaryWindowDate: (date: Date | ((prev: Date) => Date)) => void;
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
  categories: any[];
}

export const Summary: React.FC<SummaryProps> = ({
  summaryType,
  setSummaryType,
  summaryDate,
  setSummaryDate,
  summaryWindowDate,
  setSummaryWindowDate,
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
  categories,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 110;

  // Stable maxValue across selections within the same window
  const maxInTrend = Math.max(...trendData.map(d => d.amount), 0);
  const maxValue = Math.max(maxInTrend, 500);

  const barData = trendData
    .filter(entry => !entry.isFuture)
    .map(entry => {
      const isSelected = summaryType === 'monthly' 
        ? format(entry.date, 'yyyy-MM') === format(summaryDate, 'yyyy-MM')
        : entry.date.getFullYear() === summaryDate.getFullYear();
      return {
        value: entry.amount,
        label: entry.name,
        frontColor: isSelected ? "#4F46E5" : "#E2E8F0",
        labelTextStyle: tw`text-[8px] font-bold ${isSelected ? "text-indigo-600" : "text-slate-400"}`,
        onPress: () => setSummaryDate(entry.date),
        topLabelComponent: () => (
          <Text style={tw`text-[6px] font-bold ${isSelected ? "text-indigo-600" : "text-slate-400"} mb-1`}>
            {entry.amount > 0 ? `₹${(entry.amount/1000).toFixed(summaryType === 'yearly' ? 0 : 1)}k` : ''}
          </Text>
        )
      };
    });

  const pieData = summarySpendAreas.map(area => {
    const cat = categories.find(c => c.label === area.category);
    return {
      value: area.amount,
      color: cat?.color || "#E2E8F0",
      text: area.category
    };
  });

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      {/* Modern Professional Header */}
      <View style={tw`bg-slate-900 rounded-b-[40px] shadow-2xl overflow-hidden`}>
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          style={tw`p-6 pb-12`}
        >
          <View style={[tw`absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32`, { opacity: 0.1 }]} />
          
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <View style={tw`flex-row items-center gap-3`}>
              <TouchableOpacity 
                onPress={() => {
                  if (summaryView === "spendAreas") {
                    setSummaryView("overview");
                  } else {
                    setActiveTab("dashboard");
                  }
                }}
                style={tw`p-2 bg-white/10 rounded-xl border border-white/10`}
              >
                <ArrowLeft size={20} color="white" />
              </TouchableOpacity>
              <View>
                <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1`}>
                  {summaryType === "monthly" ? "Monthly Summary" : "Yearly Summary"}
                </Text>
                <Text style={tw`text-xl font-extrabold tracking-tight text-white`}>
                  {summaryType === "monthly" ? format(summaryDate, "MMMM yyyy") : format(summaryDate, "yyyy")}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => openAddTransaction()}
              style={tw`w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg`}
            >
              <Plus size={20} color="white" strokeWidth={3} />
            </TouchableOpacity>
          </View>

          {summaryView === "overview" && (
            <View style={tw`bg-white/10 p-1.5 rounded-2xl flex-row border border-white/10`}>
              <TouchableOpacity 
                onPress={() => setSummaryType("monthly")}
                style={tw`flex-1 py-2.5 items-center rounded-xl ${summaryType === "monthly" ? "bg-white" : ""}`}
              >
                <Text style={tw`text-xs font-bold ${summaryType === "monthly" ? "text-slate-900" : "text-white/60"}`}>Monthly</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setSummaryType("yearly")}
                style={tw`flex-1 py-2.5 items-center rounded-xl ${summaryType === "yearly" ? "bg-white" : ""}`}
              >
                <Text style={tw`text-xs font-bold ${summaryType === "yearly" ? "text-slate-900" : "text-white/60"}`}>Yearly</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </View>

      <ScrollView style={tw`flex-1 px-4 py-6`}>
        {summaryView === "overview" && (
          <View style={tw`mb-6`}>
            <View style={tw`flex-row items-center justify-between px-2 mb-6`}>
              <TouchableOpacity 
                onPress={() => {
                  const update = summaryType === "monthly" ? subMonths : subYears;
                  setSummaryDate(prev => update(prev, 1));
                  setSummaryWindowDate(prev => update(prev, 1)); // Shift window by 1 unit
                }}
                style={tw`p-2 bg-white rounded-xl shadow-sm border border-slate-100`}
              >
                <ChevronLeft size={18} color="#475569" />
              </TouchableOpacity>
              <View style={tw`items-center`}>
                <Text style={tw`text-xs font-bold text-slate-400 uppercase tracking-widest`}>
                  {summaryType === "monthly" ? "Monthly Summary" : "Yearly Summary"}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => {
                  const now = new Date();
                  const update = summaryType === "monthly" ? addMonths : addYears;
                  const nextDate = update(summaryDate, 1);
                  const nextWindowDate = update(summaryWindowDate, 1);
                  
                  if (summaryType === "monthly") {
                    if (nextDate <= endOfMonth(now)) {
                      setSummaryDate(nextDate);
                      setSummaryWindowDate(nextWindowDate);
                    }
                  } else {
                    if (nextDate.getFullYear() <= now.getFullYear()) {
                      setSummaryDate(nextDate);
                      setSummaryWindowDate(nextWindowDate);
                    }
                  }
                }}
                style={tw`p-2 bg-white rounded-xl shadow-sm border border-slate-100`}
              >
                <ChevronRight size={18} color="#475569" />
              </TouchableOpacity>
            </View>

             <View style={tw`bg-white rounded-3xl p-5 shadow-sm border border-slate-100`}>
              <View style={tw`flex-row items-center justify-between mb-6`}>
                <View style={tw`flex-row items-center gap-2`}>
                  <View style={tw`p-1.5 bg-indigo-50 rounded-lg`}>
                    <TrendingUp size={12} color="#4F46E5" />
                  </View>
                  <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest`}>Spend Trend</Text>
                </View>
                <View style={tw`flex-row items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full`}>
                   <ArrowUpRight size={10} color="#10B981" />
                   <Text style={tw`text-[8px] font-bold text-emerald-600`}>+12.5%</Text>
                </View>
              </View>
              <View style={tw`h-52 w-full items-center`}>
                <BarChart
                  data={barData}
                  width={chartWidth}
                  height={150}
                  barWidth={20}
                  spacing={16}
                  initialSpacing={10}
                  roundedTop
                  hideRules
                  xAxisThickness={0}
                  yAxisThickness={0}
                  hideYAxisText
                  yAxisLabelWidth={0}
                  isAnimated={false}
                  maxValue={maxValue * 1.2}
                  noOfSections={3}
                  xAxisLabelTextStyle={tw`text-[8px] font-bold text-slate-400`}
                  onPress={(item: any) => setSummaryDate(item.date)}
                />
              </View>
            </View>
          </View>
        )}

        <View style={tw`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6`}>
            <View style={tw`h-64 w-full items-center justify-center relative`} pointerEvents="none">
            <View style={tw`absolute inset-0 items-center justify-center z-10`} pointerEvents="none">
              <Text style={tw`text-slate-400 text-[10px] font-bold uppercase tracking-widest`}>Total Spend</Text>
              <Text style={tw`text-2xl font-extrabold text-slate-800 tracking-tight`}>{formatCurrency(totalSummarySpend)}</Text>
            </View>
            <PieChart
              data={pieData}
              donut
              radius={90}
              innerRadius={70}
              innerCircleColor={'white'}
              centerLabelComponent={() => null}
              onPress={Platform.OS === 'web' ? undefined : () => {}}
            />
          </View>
        </View>

        <View style={tw`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6`}>
          {summarySpendAreas.map((area, idx) => {
            const cat = categories.find(c => c.label === area.category);
            const radius = 18;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference * (1 - area.percentage / 100);

            return (
              <TouchableOpacity 
                key={area.category} 
                onPress={() => {
                  setPreviousTab("summary");
                  setSelectedCategory(area.category);
                  setActiveTab("categoryDetail");
                }}
                style={tw`p-4 flex-row items-center gap-3 ${idx !== summarySpendAreas.length - 1 ? "border-b border-slate-50" : ""}`}
              >
                <View style={tw`relative w-10 h-10 items-center justify-center`}>
                  <Svg 
                    pointerEvents="none"
                    focusable={false}
                    style={[tw`absolute inset-0`, { transform: [{ rotate: '-90deg' }] }]} 
                    width="40" height="40"
                  >
                    <Circle 
                      cx="20" cy="20" r={radius} 
                      fill="none" stroke="#F1F5F9" strokeWidth="3" 
                      pointerEvents="none"
                    />
                    <Circle 
                      cx="20" cy="20" r={radius} 
                      fill="none" 
                      stroke={cat?.color || '#E2E8F0'} 
                      strokeWidth="3" 
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      pointerEvents="none"
                    />
                  </Svg>
                  <View style={tw`relative z-10`}>
                    <CategoryIcon category={area.category} size={14} color="#475569" />
                  </View>
                </View>
                <View style={tw`flex-1`}>
                  <View style={tw`flex-row justify-between items-start`}>
                    <Text style={tw`font-bold text-slate-800 text-sm`}>{area.category}</Text>
                    <View style={tw`items-end`}>
                      <Text style={tw`font-bold text-slate-800 text-sm`}>{formatCurrency(area.amount)}</Text>
                      <Text style={tw`text-[8px] text-slate-400 font-bold uppercase tracking-widest`}>{area.percentage.toFixed(1)}%</Text>
                    </View>
                  </View>
                  <Text style={tw`text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5`}>
                    {formatCurrency(area.amount * 0.8)} more than last month
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {summaryView === "overview" && (
          <View style={tw`mb-20`}>
            <View style={tw`flex-row justify-between items-center px-1 mb-3`}>
              <Text style={tw`text-xs font-bold text-slate-400 uppercase tracking-widest`}>Transactions</Text>
              <Text style={tw`text-[10px] font-bold text-indigo-600 uppercase tracking-widest`}>See All</Text>
            </View>
            <View style={tw`gap-2`}>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.slice(0, 5).map(tx => (
                  <TouchableOpacity 
                    key={tx.id} 
                    onPress={() => handleTransactionClick(tx)}
                    style={tw`bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex-row items-center justify-between ${!tx.isSpend ? "opacity-40" : ""}`}
                  >
                    <View style={tw`flex-row items-center gap-3`}>
                      <View 
                        style={[tw`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm`, { backgroundColor: (categories.find(c => c.label === tx.category)?.color || "#94A3B8") }]}
                      >
                        <CategoryIcon category={tx.category} size={16} color="white" />
                      </View>
                      <View>
                        <Text style={tw`font-bold text-slate-800 text-sm`}>{tx.description}</Text>
                        <Text style={tw`text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5`}>
                          {format(parseISO(tx.date), "dd MMM, yyyy")}
                        </Text>
                      </View>
                    </View>
                    <View style={tw`items-end`}>
                      <Text style={tw`font-bold text-sm ${tx.type === "income" ? "text-emerald-600" : "text-slate-800"}`}>
                        {tx.type === "income" ? "+" : "-"} {formatCurrency(tx.amount)}
                      </Text>
                      <Text style={tw`text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5`}>{tx.paymentMethod}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={tw`bg-white p-8 rounded-3xl border border-dashed border-slate-200 items-center`}>
                  <Text style={tw`text-slate-400 text-xs font-bold uppercase tracking-widest`}>No transactions</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
