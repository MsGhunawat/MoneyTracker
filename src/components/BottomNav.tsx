import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MotiView } from "moti";
import { 
  LayoutDashboard, 
  PieChart, 
  Plus, 
  Wallet, 
  Settings 
} from "lucide-react-native";
import tw from "twrnc";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  onAddClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onAddClick }) => {
  const NavButton = ({ id, icon: Icon, label, isAction = false }: { id: string, icon: any, label: string, isAction?: boolean }) => (
    <TouchableOpacity 
      onPress={isAction ? onAddClick : () => onTabChange(id)}
      style={tw`flex flex-col items-center relative`}
    >
      <View style={tw`p-2 rounded-2xl ${!isAction && activeTab === id ? "bg-indigo-50" : ""}`}>
        <Icon 
          size={22} 
          color={isAction ? "#475569" : activeTab === id ? "#4F46E5" : "#64748B"} 
          strokeWidth={activeTab === id ? 2.5 : 2} 
        />
      </View>
      <Text style={tw`text-[9px] font-bold uppercase tracking-wider ${activeTab === id ? "text-indigo-600" : "text-slate-500 opacity-70"}`}>
        {label}
      </Text>
      
      {activeTab === id && !isAction && (
        <MotiView 
          from={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={tw`absolute -top-1 w-1 h-1 bg-indigo-600 rounded-full`}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[
      tw`absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 pt-3 pb-8 flex flex-row justify-between items-center z-40`,
      { shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 20 }
    ]}>
      <NavButton id="dashboard" icon={LayoutDashboard} label="Home" />
      <NavButton id="summary" icon={PieChart} label="Stats" />
      
      <View style={tw`px-2`}>
        <TouchableOpacity 
          onPress={onAddClick}
          style={[
            tw`bg-indigo-600 p-3 rounded-2xl flex items-center justify-center`,
            { shadowColor: "#6366F1", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10 }
          ]}
        >
          <Plus size={24} color="white" strokeWidth={3} />
        </TouchableOpacity>
      </View>
      
      <NavButton id="bills" icon={Wallet} label="Bills" />
      <NavButton id="settings" icon={Settings} label="More" />
    </View>
  );
};
