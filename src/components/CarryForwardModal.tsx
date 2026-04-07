import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wallet } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "../utils";

interface CarryForwardModalProps {
  showCarryForwardModal: boolean;
  pendingCarryForward: number;
  handleCarryForward: (carry: boolean) => void;
}

export const CarryForwardModal: React.FC<CarryForwardModalProps> = ({
  showCarryForwardModal,
  pendingCarryForward,
  handleCarryForward,
}) => {
  return (
    <AnimatePresence>
      {showCarryForwardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-5"
          >
            <div className="w-14 h-14 bg-emerald-50 text-[#0A2E1F] rounded-full flex items-center justify-center mx-auto">
              <Wallet size={24} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">New Month Detected!</h3>
              <p className="text-slate-500 text-xs font-medium">
                You had <span className="font-bold text-slate-800">{formatCurrency(pendingCarryForward)}</span> remaining in cash from last month.
              </p>
            </div>
            <div className="space-y-2">
              <button 
                onClick={() => handleCarryForward(true)}
                className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
              >
                Carry Forward to {format(new Date(), "MMMM")}
              </button>
              <button 
                onClick={() => handleCarryForward(false)}
                className="w-full bg-slate-100 text-slate-600 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-all"
              >
                Mark as Misc Spend
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
