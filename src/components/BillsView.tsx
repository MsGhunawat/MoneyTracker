import React from "react";
import { motion } from "motion/react";
import { Receipt, Calendar, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Bill } from "../types";
import { formatCurrency } from "../utils";

interface BillsViewProps {
  bills: Bill[];
}

export const BillsView: React.FC<BillsViewProps> = ({ bills }) => {
  return (
    <motion.div
      key="bills"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-5 pb-24 max-w-lg mx-auto"
    >
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full -ml-16 -mb-16 blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-white/10 rounded-lg flex items-center justify-center">
              <Receipt size={12} className="text-white" />
            </div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest opacity-80">Total Unpaid Bills</p>
          </div>
          <p className="text-3xl font-extrabold tracking-tight mb-6">{formatCurrency(bills.reduce((sum, b) => sum + b.amount, 0))}</p>
          
          <div className="flex gap-2">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-xl flex-1">
              <p className="text-[8px] font-bold uppercase text-slate-400 tracking-widest mb-0.5">Next Due</p>
              <p className="text-xs font-bold">In 4 Days</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-xl flex-1">
              <p className="text-[8px] font-bold uppercase text-slate-400 tracking-widest mb-0.5">Bills Count</p>
              <p className="text-xs font-bold">{bills.length} Active</p>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Upcoming Bills</h3>
        <div className="space-y-3">
          {bills.map(bill => (
            <div key={bill.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-indigo-100 transition-all active:scale-[0.98]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shadow-sm group-hover:scale-105 transition-transform">
                  <Receipt size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm leading-tight">{bill.description}</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                    Due {format(parseISO(bill.dueDate), "dd MMM, yyyy")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800 text-sm">{formatCurrency(bill.amount)}</p>
                <button className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest mt-1.5 bg-indigo-50 px-3 py-1 rounded-lg hover:bg-indigo-100 transition-colors">
                  Pay
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button className="w-full py-4 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:border-indigo-100 hover:text-indigo-600 transition-all active:scale-[0.98]">
        <Plus size={16} /> Add New Bill
      </button>
    </motion.div>
  );
};
