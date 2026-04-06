import React from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  Wallet, 
  Bell, 
  Smartphone, 
  History, 
  HelpCircle, 
  FileText, 
  ChevronRight 
} from "lucide-react";

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, label, value, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors active:scale-[0.98]"
  >
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500">
        {icon}
      </div>
      <span className="font-bold text-slate-700 text-sm">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{value}</span>}
      <ChevronRight size={14} className="text-slate-300" />
    </div>
  </button>
);

export const SettingsView: React.FC = () => {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-5 pb-24 max-w-lg mx-auto"
    >
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center space-y-3">
        <div className="w-20 h-20 bg-indigo-50 rounded-full mx-auto flex items-center justify-center text-indigo-600 shadow-inner relative">
          <span className="text-2xl font-bold">MG</span>
          <div className="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 rounded-full border-4 border-white flex items-center justify-center text-white">
            <Plus size={12} />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Mohit Ghunawat</h3>
          <p className="text-xs text-slate-400 font-medium">mm.ghunawat@gmail.com</p>
        </div>
        <button className="px-5 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors">
          Edit Profile
        </button>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
        <div className="p-3 border-b border-slate-50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3">Preferences</p>
        </div>
        <div className="divide-y divide-slate-50">
          <SettingsItem icon={<Wallet size={18} />} label="Currency" value="INR (₹)" />
          <SettingsItem icon={<Bell size={18} />} label="Notifications" value="Enabled" />
          <SettingsItem icon={<Smartphone size={18} />} label="SMS Sync" value="Automatic" />
          <SettingsItem icon={<History size={18} />} label="Data Backup" value="Cloud Sync" />
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
        <div className="p-3 border-b border-slate-50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3">Support</p>
        </div>
        <div className="divide-y divide-slate-50">
          <SettingsItem icon={<HelpCircle size={18} />} label="Help Center" />
          <SettingsItem icon={<FileText size={18} />} label="Privacy Policy" />
        </div>
      </div>

      <button className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-sm active:scale-[0.98] transition-all">
        Logout
      </button>
    </motion.div>
  );
};
