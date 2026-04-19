import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MotiView } from "moti";
import { 
  Plus, 
  Wallet, 
  Bell, 
  Smartphone, 
  History, 
  HelpCircle, 
  FileText, 
  ChevronRight 
} from "lucide-react-native";
import tw from "twrnc";

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, label, value, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={tw`w-full p-4 flex-row items-center justify-between border-b border-slate-50`}
  >
    <View style={tw`flex-row items-center gap-3`}>
      <View style={tw`w-9 h-9 bg-slate-50 rounded-xl items-center justify-center`}>
        {icon}
      </View>
      <Text style={tw`font-bold text-slate-700 text-sm`}>{label}</Text>
    </View>
    <View style={tw`flex-row items-center gap-2`}>
      {value && (
        <View style={tw`bg-indigo-50 px-3 py-1 rounded-lg`}>
          <Text style={tw`text-[10px] font-bold text-indigo-600`}>{value}</Text>
        </View>
      )}
      <ChevronRight size={14} color="#CBD5E1" />
    </View>
  </TouchableOpacity>
);

export const SettingsView: React.FC = () => {
  return (
    <View style={tw`flex-1 bg-slate-50`}>
      <ScrollView contentContainerStyle={tw`px-4 py-6 pb-32`}>
        <View style={tw`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 items-center gap-3 mb-5`}>
          <View style={tw`w-20 h-20 bg-indigo-50 rounded-full items-center justify-center shadow-inner relative`}>
            <Text style={tw`text-2xl font-bold text-indigo-600`}>MG</Text>
            <View style={tw`absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 rounded-full border-4 border-white items-center justify-center`}>
              <Plus size={12} color="white" />
            </View>
          </View>
          <View style={tw`items-center`}>
            <Text style={tw`text-lg font-bold text-slate-800 tracking-tight`}>Mohit Ghunawat</Text>
            <Text style={tw`text-xs text-slate-400 font-medium`}>mm.ghunawat@gmail.com</Text>
          </View>
          <TouchableOpacity style={tw`px-5 py-1.5 bg-indigo-50 rounded-xl`}>
            <Text style={tw`text-[10px] font-bold text-indigo-600 uppercase tracking-widest`}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-5`}>
          <View style={tw`p-3 border-b border-slate-50`}>
            <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3`}>Preferences</Text>
          </View>
          <View>
            <SettingsItem icon={<Wallet size={18} color="#64748B" />} label="Currency" value="INR (₹)" />
            <SettingsItem icon={<Bell size={18} color="#64748B" />} label="Notifications" value="Enabled" />
            <SettingsItem icon={<Smartphone size={18} color="#64748B" />} label="SMS Sync" value="Automatic" />
            <SettingsItem icon={<History size={18} color="#64748B" />} label="Data Backup" value="Cloud Sync" />
          </View>
        </View>

        <View style={tw`bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-5`}>
          <View style={tw`p-3 border-b border-slate-50`}>
            <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3`}>Support</Text>
          </View>
          <View>
            <SettingsItem icon={<HelpCircle size={18} color="#64748B" />} label="Help Center" />
            <SettingsItem icon={<FileText size={18} color="#64748B" />} label="Privacy Policy" />
          </View>
        </View>

        <TouchableOpacity style={tw`w-full py-4 bg-red-50 rounded-2xl items-center shadow-sm`}>
          <Text style={tw`text-red-600 font-bold text-sm uppercase tracking-widest`}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
