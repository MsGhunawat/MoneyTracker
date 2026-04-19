import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions } from "react-native";
import { MotiView } from "moti";
import { ArrowLeft, Wallet, ShoppingCart, CreditCard, Banknote } from "lucide-react-native";
import Svg, { Path } from "react-native-svg";
import tw from "twrnc";
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
    <View style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`pb-10`}>
        {/* Header */}
        <View style={tw`p-4 pt-12 flex-row items-center gap-3`}>
          <TouchableOpacity 
            onPress={() => setActiveTab(previousTab)}
            style={tw`w-9 h-9 items-center justify-center bg-slate-50 rounded-xl`}
          >
            <ArrowLeft size={18} color="#475569" />
          </TouchableOpacity>
          <View>
            <Text style={tw`text-lg font-bold text-slate-800 tracking-tight`}>Monthly budget</Text>
            <Text style={tw`text-[10px] text-slate-400 font-bold uppercase tracking-widest`}>Your spend trend</Text>
          </View>
        </View>

        {/* Illustration Section */}
        <View style={tw`px-6 py-4 items-center text-center`}>
          <View style={tw`w-full max-w-[240px] aspect-square items-center justify-center mb-6`}>
            {/* Semi-circle Gauge Illustration */}
            <View style={[tw`absolute inset-0 items-center justify-center`, { transform: [{ rotate: '180deg' }] }]}>
               <Svg width="200" height="100" viewBox="0 0 200 100">
                  <Path 
                    d="M 20 100 A 80 80 0 0 1 180 100" 
                    fill="none" 
                    stroke="#0A2E1F" 
                    strokeWidth="20" 
                    strokeLinecap="round"
                    opacity={0.1}
                  />
               </Svg>
            </View>
            
            {/* Floating Icons */}
            <View style={[tw`absolute top-1/4 left-1/4 w-8 h-8 bg-emerald-50 rounded-lg items-center justify-center shadow-sm`, { transform: [{ rotate: '-12deg' }] }]}>
              <Banknote size={16} color="#059669" />
            </View>
            <View style={[tw`absolute top-1/4 right-1/4 w-8 h-8 bg-emerald-50 rounded-lg items-center justify-center shadow-sm`, { transform: [{ rotate: '12deg' }] }]}>
              <ShoppingCart size={16} color="#059669" />
            </View>
            <View style={[tw`absolute top-1/2 left-8 w-8 h-8 bg-emerald-50 rounded-lg items-center justify-center shadow-sm`, { transform: [{ rotate: '-6deg' }] }]}>
              <CreditCard size={16} color="#059669" />
            </View>
            <View style={[tw`absolute top-1/2 right-8 w-8 h-8 bg-emerald-50 rounded-lg items-center justify-center shadow-sm`, { transform: [{ rotate: '6deg' }] }]}>
              <Wallet size={16} color="#059669" />
            </View>

            {/* Center Wallet Icon */}
            <View style={tw`relative z-10 w-20 h-20 bg-emerald-50 rounded-3xl items-center justify-center shadow-xl border-4 border-white`}>
              <Wallet size={36} color="#059669" strokeWidth={1.5} />
            </View>
          </View>

          <Text style={tw`text-xl font-bold text-[#0A2E1F] text-center leading-tight mb-2 tracking-tight`}>
            Save every month,{"\n"}Plan your budget today
          </Text>
        </View>

        {/* Input Section */}
        <View style={tw`px-6 gap-5`}>
          <View>
            <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3`}>My monthly budget</Text>
            <View style={tw`relative`}>
              <View style={tw`absolute top-2.5 left-4 z-10`}>
                <Text style={tw`text-[8px] font-bold text-slate-400 uppercase tracking-widest`}>Enter Budget</Text>
              </View>
              <TextInput 
                value={inputValue.startsWith('₹') ? inputValue : `₹${inputValue}`}
                onChangeText={(val) => {
                  const numericVal = val.replace(/[^0-9]/g, '');
                  setInputValue(numericVal);
                }}
                keyboardType="numeric"
                style={tw`w-full bg-white border border-slate-200 rounded-2xl px-4 pt-7 pb-3 text-xl font-bold text-slate-800`}
              />
            </View>
          </View>

          <Text style={tw`text-xs text-slate-500 leading-relaxed font-medium`}>
            We'll calculate your 'Safe to Spend' from the amount you enter above by deducting your spend and upcoming bills. That way you know how much you can spend and still stay in budget.
          </Text>

          <TouchableOpacity 
            onPress={handleSave}
            style={tw`w-full bg-[#0A2E1F] py-4 rounded-xl items-center shadow-xl shadow-emerald-900/20`}
          >
            <Text style={tw`text-white font-bold text-sm uppercase tracking-widest`}>Set now</Text>
          </TouchableOpacity>

          <Text style={tw`text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest`}>
            * Set budget to zero to disable
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
