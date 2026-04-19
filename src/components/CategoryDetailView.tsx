import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { MotiView } from "moti";
import { ArrowLeft, Layers, Plus } from "lucide-react-native";
import { format, parseISO } from "date-fns";
import { BarChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";
import { Transaction } from "../types";
import { formatCurrency } from "../utils";
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
  const screenWidth = Dimensions.get('window').width;

  const chartData = categoryTrendData.map((item, index) => ({
    value: item.amount,
    label: item.name,
    frontColor: index === categoryTrendData.length - 1 ? "#0A2E1F" : "#10B981",
    topLabelComponent: () => (
      <Text style={tw`text-[8px] font-bold text-slate-500 mb-1`}>
        {Math.round(item.amount).toLocaleString()}
      </Text>
    ),
  }));

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      <ScrollView contentContainerStyle={tw`pb-32`}>
        {/* Modern Dark Green Header */}
        <View style={tw`bg-[#0A2E1F] rounded-b-3xl shadow-xl overflow-hidden`}>
          <LinearGradient
            colors={['#0A2E1F', '#061D14']}
            style={tw`p-5 pt-12 pb-10`}
          >
            <View style={[tw`absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32`, { opacity: 0.05 }]} />
            <View style={[tw`absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/5 rounded-full -ml-24 -mb-24`, { opacity: 0.05 }]} />
            
            <View style={tw`flex-row items-center gap-3 relative z-10`}>
              <TouchableOpacity 
                onPress={() => {
                  setActiveTab(previousTab as any);
                  setSelectedCategory(null);
                }} 
                style={tw`w-9 h-9 items-center justify-center bg-white/10 rounded-xl`}
              >
                <ArrowLeft size={18} color="white" />
              </TouchableOpacity>
              <View>
                <Text style={tw`text-lg font-bold tracking-tight text-white`}>Spend Areas</Text>
                <Text style={tw`text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1`}>Category Analysis</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={tw`px-4 -mt-6 gap-5`}>
          {/* 6 Month Trend Card */}
          <View style={tw`bg-white rounded-3xl p-5 shadow-sm border border-slate-100`}>
            <View style={tw`h-40 w-full items-center justify-center`}>
              <BarChart
                data={chartData}
                width={screenWidth - 80}
                height={120}
                barWidth={20}
                spacing={15}
                noOfSections={3}
                barBorderRadius={4}
                xAxisThickness={0}
                yAxisThickness={0}
                hideRules
                yAxisTextStyle={tw`text-[8px] font-bold text-slate-400`}
                xAxisLabelTextStyle={tw`text-[8px] font-bold text-slate-400`}
                isAnimated
              />
            </View>
          </View>

          {/* Category Header */}
          <View style={tw`flex-row justify-between items-end px-2`}>
            <View>
              <Text style={tw`text-xl font-bold text-slate-800 tracking-tight`}>{selectedCategory}</Text>
            </View>
            <View style={tw`items-end`}>
              <Text style={tw`text-lg font-extrabold text-red-600 tracking-tight`}>{formatCurrency(selectedCategoryTotal)}</Text>
              <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest`}>{format(new Date(), "MMM yyyy")}</Text>
            </View>
          </View>

          {/* Transaction List */}
          <View style={tw`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden`}>
            {categoryTransactions.length > 0 ? (
              categoryTransactions.map((tx, idx) => (
                <TouchableOpacity 
                  key={tx.id} 
                  onPress={() => handleTransactionClick(tx)}
                  style={tw`p-4 flex-row items-center justify-between ${idx !== categoryTransactions.length - 1 ? "border-b border-slate-50" : ""} ${!tx.isSpend ? "opacity-40" : ""}`}
                >
                  <View style={tw`flex-row items-center gap-3`}>
                    <View 
                      style={[
                        tw`w-10 h-10 rounded-xl items-center justify-center shadow-sm`,
                        { backgroundColor: categories.find(c => c.label === tx.category)?.color || "#94A3B8" }
                      ]}
                    >
                      <CategoryIcon category={tx.category} size={16} color="white" />
                    </View>
                    <View>
                      <Text style={tw`font-bold text-slate-800 text-sm leading-tight`}>{tx.description}</Text>
                      <View style={tw`flex-row items-center gap-2 mt-0.5`}>
                        <Text style={tw`text-[9px] font-bold text-slate-400 uppercase tracking-widest`}>{tx.paymentMethod}</Text>
                        <View style={tw`w-1 h-1 bg-slate-200 rounded-full`} />
                        <Text style={tw`text-[9px] text-slate-400 font-semibold uppercase tracking-wider`}>{format(parseISO(tx.date), "dd MMM yyyy")}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={tw`items-end`}>
                    <Text style={tw`font-bold text-slate-800 text-sm`}>{formatCurrency(tx.amount)}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={tw`p-10 items-center`}>
                <Text style={tw`text-slate-400 text-xs font-bold uppercase tracking-widest`}>No transactions</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        onPress={() => openAddTransaction(selectedCategory || undefined)}
        style={[tw`absolute bottom-24 right-6 w-14 h-14 bg-[#0A2E1F] rounded-2xl items-center justify-center shadow-2xl border-4 border-white`, { zIndex: 50 }]}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};
