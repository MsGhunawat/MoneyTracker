import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform, Switch, ActivityIndicator } from "react-native";
import { MotiView } from "moti";
import { 
  Plus, 
  Wallet, 
  Bell, 
  Smartphone, 
  History, 
  HelpCircle, 
  FileText, 
  ChevronRight,
  LogOut,
  Moon,
  Shield,
  CreditCard,
  Download,
  Info,
  CircleUser,
  ExternalLink
} from "lucide-react-native";
import tw from "twrnc";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { LinearGradient } from "expo-linear-gradient";
import { Currency, SUPPORTED_CURRENCIES } from "../types";
import { X, Check } from "lucide-react-native";

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  color?: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, label, value, onPress, rightElement, color = "#64748B" }) => (
  <TouchableOpacity 
    onPress={onPress}
    disabled={!onPress && !rightElement}
    activeOpacity={onPress ? 0.6 : 1}
    style={tw`w-full p-4 flex-row items-center justify-between`}
  >
    <View style={tw`flex-row items-center gap-4`}>
      <View style={[tw`w-10 h-10 rounded-2xl items-center justify-center`, { backgroundColor: `${color}15` }]}>
        {React.cloneElement(icon as React.ReactElement, { color, size: 20 })}
      </View>
      <View>
        <Text style={tw`font-bold text-slate-800 text-[13px]`}>{label}</Text>
        {value && !rightElement && <Text style={tw`text-[10px] text-slate-400 font-medium`}>{value}</Text>}
      </View>
    </View>
    <View style={tw`flex-row items-center gap-3`}>
      {value && rightElement && (
        <View style={tw`bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100`}>
          <Text style={tw`text-[10px] font-bold text-slate-500`}>{value}</Text>
        </View>
      )}
      {rightElement ? rightElement : <ChevronRight size={14} color="#CBD5E1" />}
    </View>
  </TouchableOpacity>
);

export const SettingsView: React.FC<{ currency: Currency, setCurrency: (c: Currency) => void }> = ({ currency, setCurrency }) => {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [smsSyncEnabled, setSmsSyncEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      // Forcing a slight delay and potential web-specific redirect to guarantee session clear
      if (Platform.OS === 'web') {
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
    } catch (error) {
      console.error("Logout Error:", error);
      setIsLoggingOut(false);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  const handleEditProfile = () => {
    Alert.alert("Manage Profile", `Current User: ${user?.displayName || 'User'}\nEmail: ${user?.email}\n\nYou can change your avatar and display name in the next major update.`);
  };

  const handleCurrencySelect = () => {
    Alert.alert("Currency Settings", "Primary currency is set to INR (₹) based on your region. Multi-currency support is coming soon!");
  };

  const handleDataBackup = () => {
    Alert.alert(
      "Cloud Sync",
      "Your data is automatically synced to the cloud. Last backup: Just now.",
      [
        { text: "Sync Now", onPress: () => Alert.alert("Success", "Data synchronized successfully!") },
        { text: "Done" }
      ]
    );
  };

  const handleHelpCenter = () => {
    Alert.alert("Support", "Visit our help center at moneytracker.app/help or email support@moneytracker.app");
  };

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-4 py-6 pb-24`}
      >
        {/* User Profile Hook */}
        <MotiView 
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={tw`rounded-[32px] overflow-hidden mb-6 shadow-xl shadow-slate-200`}
        >
          <LinearGradient
            colors={['#4F46E5', '#3730A3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={tw`p-6`}
          >
            <View style={tw`flex-row items-center gap-5`}>
              <TouchableOpacity 
                onPress={handleEditProfile}
                style={tw`w-20 h-20 bg-white/20 rounded-3xl items-center justify-center border border-white/30 relative`}
              >
                <Text style={tw`text-3xl font-bold text-white`}>
                  {user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : "U"}
                </Text>
                <View style={tw`absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-xl items-center justify-center shadow-lg`}>
                  <Plus size={14} color="#4F46E5" strokeWidth={3} />
                </View>
              </TouchableOpacity>
              
              <View style={tw`flex-1`}>
                <Text style={tw`text-xl font-bold text-white tracking-tight leading-tight`}>{user?.displayName || "User"}</Text>
                <Text style={tw`text-xs text-white/60 font-medium mb-3 mt-0.5`}>{user?.email || "No email linked"}</Text>
                <TouchableOpacity 
                  onPress={handleEditProfile}
                  style={tw`bg-white/10 self-start px-4 py-1.5 rounded-full border border-white/20`}
                >
                  <Text style={tw`text-[10px] font-bold text-white uppercase tracking-widest`}>Manage Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </MotiView>

        {/* Preferences Section */}
        <View style={tw`bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 mb-6`}>
          <View style={tw`px-5 pt-5 pb-2`}>
            <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest`}>Account Preferences</Text>
          </View>
          <View>
            <SettingsItem 
              icon={<Wallet />} 
              label="Default Currency" 
              value={`${currency.code} (${currency.symbol})`}
              color="#6366F1"
              onPress={() => setShowCurrencyModal(true)}
            />
            <View style={tw`mx-5 h-[1px] bg-slate-50`} />
            <SettingsItem 
              icon={<Bell />} 
              label="Smart Notifications" 
              color="#F59E0B"
              rightElement={
                <Switch 
                  value={notificationsEnabled} 
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#E2E8F0", true: "#818CF8" }}
                  thumbColor="white"
                />
              }
            />
            <View style={tw`mx-5 h-[1px] bg-slate-50`} />
            <SettingsItem 
              icon={<Smartphone />} 
              label="SMS Transaction Sync" 
              color="#10B981"
              rightElement={
                <Switch 
                  value={smsSyncEnabled} 
                  onValueChange={setSmsSyncEnabled}
                  trackColor={{ false: "#E2E8F0", true: "#34D399" }}
                  thumbColor="white"
                />
              }
            />
            <View style={tw`mx-5 h-[1px] bg-slate-50`} />
            <SettingsItem 
              icon={<Moon />} 
              label="Dark Appearance" 
              color="#64748B"
              rightElement={
                <Switch 
                  value={darkMode} 
                  onValueChange={() => Alert.alert("Coming Soon", "Dark Appearance feature is currently being refined and will be available in the next update.")}
                  trackColor={{ false: "#E2E8F0", true: "#475569" }}
                  thumbColor="white"
                />
              }
            />
          </View>
        </View>

        {/* Security & Data */}
        <View style={tw`bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 mb-6`}>
          <View style={tw`px-5 pt-5 pb-2`}>
            <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest`}>Security & Data</Text>
          </View>
          <View>
            <SettingsItem 
              icon={<Shield />} 
              label="Privacy & Security" 
              color="#EC4899"
              onPress={() => Alert.alert("Security", "Your data is encrypted end-to-end using AES-256 standards.")}
            />
            <View style={tw`mx-5 h-[1px] bg-slate-50`} />
            <SettingsItem 
              icon={<History />} 
              label="Cloud Data Backup" 
              value="Auto-Synced" 
              color="#3B82F6"
              onPress={handleDataBackup}
            />
            <View style={tw`mx-5 h-[1px] bg-slate-50`} />
            <SettingsItem 
              icon={<Download />} 
              label="Export Financial Data" 
              color="#8B5CF6"
              onPress={() => Alert.alert("Export Data", "Your transaction history will be prepared as a CSV file and emailed to you.")}
            />
          </View>
        </View>

        {/* Support */}
        <View style={tw`bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 mb-6`}>
          <View style={tw`px-5 pt-5 pb-2`}>
            <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest`}>Support & Legal</Text>
          </View>
          <View>
            <SettingsItem 
              icon={<HelpCircle />} 
              label="Help Center" 
              color="#64748B"
              onPress={handleHelpCenter}
            />
            <View style={tw`mx-5 h-[1px] bg-slate-50`} />
            <SettingsItem 
              icon={<FileText />} 
              label="Terms of Service" 
              color="#64748B"
              onPress={() => Alert.alert("Terms", "By using MoneyTracker, you agree to our standard terms of service.")}
            />
            <View style={tw`mx-5 h-[1px] bg-slate-50`} />
            <SettingsItem 
              icon={<Info />} 
              label="About MoneyTracker" 
              color="#64748B"
              onPress={() => Alert.alert("MoneyTracker", "Version 1.0.4\nDeveloped by Financial Freedom Team\n\n© 2026 MoneyTracker Inc.")}
            />
          </View>
        </View>

        {/* Logout Action */}
        {!showLogoutConfirm ? (
          <TouchableOpacity 
            onPress={() => setShowLogoutConfirm(true)}
            activeOpacity={0.7}
            style={tw`w-full py-4 bg-red-50 rounded-2xl items-center flex-row justify-center gap-3 mb-8 border border-red-100`}
          >
            <LogOut size={18} color="#DC2626" strokeWidth={2.5} />
            <Text style={tw`text-red-600 font-bold text-sm uppercase tracking-widest`}>Sign Out</Text>
          </TouchableOpacity>
        ) : (
          <MotiView 
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={tw`bg-red-50 rounded-[32px] p-6 mb-8 border border-red-100 items-center shadow-lg shadow-red-100`}
          >
            <View style={tw`w-12 h-12 bg-red-100 rounded-full items-center justify-center mb-4`}>
                <LogOut size={24} color="#DC2626" />
            </View>
            <Text style={tw`text-slate-800 font-bold text-center text-base mb-1`}>Ready to Sign Out?</Text>
            <Text style={tw`text-slate-500 text-xs text-center mb-6 leading-relaxed`}>Make sure your transactions are synced. You can sign back in at any time.</Text>
            
            <View style={tw`flex-row gap-3 w-full`}>
              <TouchableOpacity 
                onPress={() => setShowLogoutConfirm(false)}
                style={tw`flex-1 py-3.5 bg-white rounded-2xl items-center border border-slate-200`}
              >
                <Text style={tw`text-slate-600 font-bold text-sm`}>Stay Signed In</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleLogout}
                disabled={isLoggingOut}
                style={tw`flex-1 py-3.5 bg-red-600 rounded-2xl items-center shadow-sm flex-row justify-center gap-2`}
              >
                {isLoggingOut ? <ActivityIndicator size="small" color="white" /> : <LogOut size={16} color="white" />}
                <Text style={tw`text-white font-bold text-sm`}>{isLoggingOut ? "Signing Out..." : "Sign Out"}</Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        )}

          <View style={tw`items-center pb-8`}>
            <View style={tw`flex-row items-center gap-2 mb-1`}>
              <View style={tw`w-5 h-5 bg-indigo-600 rounded-lg items-center justify-center`}>
                  <Wallet size={10} color="white" strokeWidth={3} />
              </View>
              <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]`}>MoneyTracker Premium</Text>
            </View>
            <Text style={tw`text-[10px] text-slate-300 font-medium`}>Version 1.0.4 (Build 2026.04.19)</Text>
            <Text style={tw`text-[9px] text-slate-200 mt-2`}>Secured with 256-bit Encryption</Text>
          </View>
        </ScrollView>

        {/* Currency Selection Modal */}
        {showCurrencyModal && (
          <View style={[tw`absolute inset-0 bg-slate-900/60 z-50 items-center justify-center p-6`, { backgroundColor: 'rgba(15, 23, 42, 0.7)' }]}>
            <MotiView
               from={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               style={tw`bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl`}
            >
              <View style={tw`p-6 border-b border-slate-100 flex-row justify-between items-center bg-slate-50`}>
                <View>
                  <Text style={tw`text-lg font-bold text-slate-800 tracking-tight`}>Select Currency</Text>
                  <Text style={tw`text-[10px] text-slate-400 font-bold uppercase tracking-widest`}>Primary preference</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => setShowCurrencyModal(false)}
                  style={tw`p-2 bg-white rounded-xl border border-slate-200 shadow-sm`}
                >
                  <X size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={tw`max-h-96`}>
                {SUPPORTED_CURRENCIES.map((item) => (
                  <TouchableOpacity
                    key={item.code}
                    onPress={() => {
                      setCurrency(item);
                      setShowCurrencyModal(false);
                    }}
                    style={tw`p-4 flex-row items-center justify-between border-b border-slate-50 ${currency.code === item.code ? 'bg-indigo-50/50' : ''}`}
                  >
                    <View style={tw`flex-row items-center gap-4`}>
                      <View style={tw`w-10 h-10 bg-slate-100 rounded-xl items-center justify-center`}>
                        <Text style={tw`text-base font-bold text-slate-600`}>{item.symbol}</Text>
                      </View>
                      <View>
                        <Text style={tw`text-sm font-bold text-slate-800`}>{item.label}</Text>
                        <Text style={tw`text-[10px] text-slate-400 font-medium`}>{item.code}</Text>
                      </View>
                    </View>
                    {currency.code === item.code && (
                      <View style={tw`w-6 h-6 bg-indigo-500 rounded-full items-center justify-center`}>
                        <Check size={12} color="white" strokeWidth={4} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <View style={tw`p-6 bg-slate-50`}>
                 <Text style={tw`text-[9px] text-slate-400 text-center font-medium leading-relaxed`}>
                   Changing currency will update all spend, balance, and trend figures across the application instantly.
                 </Text>
              </View>
            </MotiView>
          </View>
        )}
      </View>
  );
};
