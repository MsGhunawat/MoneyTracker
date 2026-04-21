import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MotiView } from "moti";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Layers 
} from "lucide-react-native";
import { format, parseISO } from "date-fns";
import tw from "twrnc";
import { Transaction, Currency } from "../types";
import { formatCurrency } from "../utils";
import { CategoryIcon } from "./CategoryIcon";

interface TransactionsViewProps {
  transactions: Transaction[];
  totalMonthlySpend: number;
  setActiveTab: (tab: any) => void;
  handleTransactionClick: (tx: Transaction) => void;
  categories: any[];
  currency: Currency;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  totalMonthlySpend,
  setActiveTab,
  handleTransactionClick,
  categories,
  currency,
}) => {
  return (
    <View style={tw`flex-1 bg-slate-50`}>
      <ScrollView contentContainerStyle={tw`px-4 py-6 pb-32`}>
        {/* Transactions Header */}
        <View style={tw`flex-row items-center justify-between mb-6`}>
          <View style={tw`flex-row items-center gap-3`}>
            <TouchableOpacity 
              onPress={() => setActiveTab("dashboard")}
              style={tw`p-2 bg-white rounded-xl shadow-sm border border-slate-100`}
            >
              <ArrowLeft size={18} color="#475569" />
            </TouchableOpacity>
            <Text style={tw`text-lg font-bold text-slate-800 tracking-tight`}>Transactions</Text>
          </View>
          <View style={tw`flex-row gap-2`}>
            <TouchableOpacity style={tw`p-2 bg-white rounded-xl shadow-sm border border-slate-100`}>
              <Search size={18} color="#94A3B8" />
            </TouchableOpacity>
            <TouchableOpacity style={tw`p-2 bg-white rounded-xl shadow-sm border border-slate-100`}>
              <Filter size={18} color="#94A3B8" />
            </TouchableOpacity>
            <TouchableOpacity style={tw`p-2 bg-white rounded-xl shadow-sm border border-slate-100`}>
              <Download size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions List */}
        <View style={tw`gap-3`}>
          {transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t) => (
            <TouchableOpacity 
              key={t.id} 
              onPress={() => handleTransactionClick(t)}
              style={tw`bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex-row items-center justify-between ${!t.isSpend ? "opacity-40" : ""}`}
            >
              <View style={tw`flex-row items-center gap-3`}>
                <View 
                  style={[
                    tw`w-10 h-10 rounded-xl items-center justify-center shadow-sm`,
                    { backgroundColor: t.type === "income" ? "#10B981" : (categories.find(c => c.label === t.category)?.color || "#6366F1") }
                  ]}
                >
                  <CategoryIcon category={t.category} size={16} color="white" />
                </View>
                <View>
                  <Text style={tw`font-bold text-slate-800 text-sm`}>{t.description}</Text>
                  <Text style={tw`text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5`}>{t.category} • {format(parseISO(t.date), "dd MMM")}</Text>
                </View>
              </View>
              <View style={tw`items-end`}>
                <Text style={tw`font-bold text-sm ${t.type === "income" ? "text-emerald-600" : "text-slate-800"}`}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount, currency)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
