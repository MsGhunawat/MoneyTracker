import React from "react";
import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  PieChart, 
  Plus, 
  Wallet, 
  Settings 
} from "lucide-react";
import { cn } from "../lib/utils";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  onAddClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onAddClick }) => {
  const NavButton = ({ id, icon: Icon, label, isAction = false }: { id: string, icon: any, label: string, isAction?: boolean }) => (
    <button 
      onClick={isAction ? onAddClick : () => onTabChange(id)}
      className={cn(
        "flex flex-col items-center gap-1 transition-all duration-300 relative",
        isAction ? "text-slate-600" : activeTab === id ? "text-indigo-600" : "text-slate-500"
      )}
    >
      <div className={cn(
        "p-2 rounded-2xl transition-all duration-300",
        !isAction && activeTab === id ? "bg-indigo-50" : "hover:bg-slate-50"
      )}>
        <Icon size={22} strokeWidth={activeTab === id ? 2.5 : 2} />
      </div>
      <span className={cn(
        "text-[9px] font-bold uppercase tracking-wider",
        activeTab === id ? "opacity-100" : "opacity-70"
      )}>{label}</span>
      
      {activeTab === id && !isAction && (
        <motion.div 
          layoutId="activeTab"
          className="absolute -top-1 w-1 h-1 bg-indigo-600 rounded-full"
        />
      )}
    </button>
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-4 py-3 flex justify-between items-center z-40 pb-8 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
      <NavButton id="dashboard" icon={LayoutDashboard} label="Home" />
      <NavButton id="summary" icon={PieChart} label="Stats" />
      
      <div className="px-2">
        <button 
          onClick={onAddClick}
          className="bg-indigo-600 text-white p-3 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-90 hover:bg-indigo-700 flex items-center justify-center"
          aria-label="Add Transaction"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>
      
      <NavButton id="bills" icon={Wallet} label="Bills" />
      <NavButton id="settings" icon={Settings} label="More" />
    </nav>
  );
};
