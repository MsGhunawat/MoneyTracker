import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MotiView } from "moti";
import { Receipt, Calendar, Plus } from "lucide-react-native";
import { format, parseISO } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";
import { Bill, Currency } from "../types";
import { formatCurrency } from "../utils";

interface BillsViewProps {
  bills: Bill[];
  currency: Currency;
}

export const BillsView: React.FC<BillsViewProps> = ({ bills, currency }) => {
  return (
    <View style={tw`flex-1 bg-slate-50`}>
      <ScrollView contentContainerStyle={tw`px-4 py-6 pb-32`}>
        <View style={tw`bg-slate-900 rounded-3xl shadow-2xl overflow-hidden mb-6`}>
          <LinearGradient
            colors={['#0F172A', '#1E293B']}
            style={tw`p-6`}
          >
            <View style={[tw`absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full -mr-24 -mt-24`, { opacity: 0.1 }]} />
            <View style={[tw`absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full -ml-16 -mb-16`, { opacity: 0.05 }]} />
            
            <View style={tw`relative z-10`}>
              <View style={tw`flex-row items-center gap-2 mb-1`}>
                <View style={tw`w-5 h-5 bg-white/10 rounded-lg items-center justify-center`}>
                  <Receipt size={12} color="white" />
                </View>
                <Text style={tw`text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-80`}>Total Unpaid Bills</Text>
              </View>
              <Text style={tw`text-3xl font-extrabold tracking-tight text-white mb-6`}>{formatCurrency(bills.reduce((sum, b) => sum + b.amount, 0), currency)}</Text>
              
              <View style={tw`flex-row gap-2`}>
                <View style={tw`bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl flex-1`}>
                  <Text style={tw`text-[8px] font-bold uppercase text-slate-400 tracking-widest mb-0.5`}>Next Due</Text>
                  <Text style={tw`text-xs font-bold text-white`}>In 4 Days</Text>
                </View>
                <View style={tw`bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl flex-1`}>
                  <Text style={tw`text-[8px] font-bold uppercase text-slate-400 tracking-widest mb-0.5`}>Bills Count</Text>
                  <Text style={tw`text-xs font-bold text-white`}>{bills.length} Active</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={tw`mb-6`}>
          <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-3`}>Upcoming Bills</Text>
          <View style={tw`gap-3`}>
            {bills.map(bill => (
              <TouchableOpacity key={bill.id} style={tw`bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex-row items-center justify-between`}>
                <View style={tw`flex-row items-center gap-3`}>
                  <View style={tw`w-10 h-10 bg-indigo-50 rounded-xl items-center justify-center shadow-sm`}>
                    <Receipt size={20} color="#6366F1" />
                  </View>
                  <View>
                    <Text style={tw`font-bold text-slate-800 text-sm leading-tight`}>{bill.description}</Text>
                    <Text style={tw`text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5`}>
                      Due {format(parseISO(bill.dueDate), "dd MMM, yyyy")}
                    </Text>
                  </View>
                </View>
                <View style={tw`items-end`}>
                  <Text style={tw`font-bold text-slate-800 text-sm`}>{formatCurrency(bill.amount, currency)}</Text>
                  <TouchableOpacity style={tw`mt-1.5 bg-indigo-50 px-3 py-1 rounded-lg`}>
                    <Text style={tw`text-[8px] font-bold text-indigo-600 uppercase tracking-widest`}>Pay</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={tw`w-full py-4 bg-white border border-dashed border-slate-200 rounded-2xl flex-row items-center justify-center gap-2`}>
          <Plus size={16} color="#94A3B8" />
          <Text style={tw`text-slate-400 font-bold text-[10px] uppercase tracking-widest`}>Add New Bill</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
