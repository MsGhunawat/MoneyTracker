import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Trash2, 
  Layers, 
  Edit2, 
  Store, 
  Plus, 
  Calendar, 
  Wallet, 
  RotateCcw, 
  MessageSquare, 
  FileText, 
  Upload, 
  History,
  Sparkles,
  Check,
  Loader2
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from "../lib/utils";
import { Transaction } from "../types";
import { CategoryIcon } from "./CategoryIcon";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface TransactionFormProps {
  editingTransaction: Transaction;
  setEditingTransaction: (tx: Transaction | null) => void;
  setActiveTab: (tab: any) => void;
  previousTab: string;
  setSelectedTransaction: (tx: Transaction | null) => void;
  deleteTransaction: () => void;
  saveTransaction: () => void;
  setShowCategoryPicker: (show: boolean) => void;
  categories: any[];
  showAllCategories: boolean;
  setShowAllCategories: (show: boolean) => void;
  setShowAddCategoryModal: (show: boolean) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  editingTransaction,
  setEditingTransaction,
  setActiveTab,
  previousTab,
  setSelectedTransaction,
  deleteTransaction,
  saveTransaction,
  setShowCategoryPicker,
  categories,
  showAllCategories,
  setShowAllCategories,
  setShowAddCategoryModal,
}) => {
  const [smsInput, setSmsInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);

  const handleAiParse = async () => {
    if (!smsInput.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Parse this bank SMS and extract transaction details. 
        Available categories: ${categories.map(c => c.label).join(", ")}.
        SMS: "${smsInput}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              amount: { type: Type.NUMBER },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              isSpend: { type: Type.BOOLEAN },
              date: { type: Type.STRING, description: "ISO 8601 date string" }
            },
            required: ["amount", "description", "category", "isSpend"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      if (result.amount) {
        setEditingTransaction({
          ...editingTransaction,
          amount: result.amount,
          description: result.description || editingTransaction.description,
          category: result.category || editingTransaction.category,
          isSpend: result.isSpend ?? editingTransaction.isSpend,
          smsContent: smsInput,
          date: result.date || editingTransaction.date
        });
        setSmsInput("");
      }
    } catch (error) {
      console.error("AI Parse Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSuggestCategory = useCallback(async (text: string) => {
    if (text.length < 3) return;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Suggest the best category for this transaction description: "${text}". 
        Available categories: ${categories.map(c => c.label).join(", ")}.
        Return ONLY the category name.`,
      });
      const suggested = response.text?.trim();
      if (suggested && categories.some(c => c.label === suggested)) {
        setSuggestedCategory(suggested);
      }
    } catch (error) {
      console.error("AI Suggestion Error:", error);
    }
  }, [categories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (editingTransaction.description && !suggestedCategory) {
        handleSuggestCategory(editingTransaction.description);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [editingTransaction.description, handleSuggestCategory, suggestedCategory]);

  return (
    <motion.div
      key="transactionForm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-white z-50 overflow-y-auto pb-32"
    >
      {/* Header Area */}
      <div className="bg-[#0A2E1F] text-white p-6 pt-5 pb-10 rounded-b-[3rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
        <div className="flex justify-between items-center mb-2 relative z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setActiveTab(previousTab as any);
                setSelectedTransaction(null);
                setEditingTransaction(null);
              }} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-bold tracking-tight">
              {editingTransaction.id === "" ? "Add Transaction" : "Details"}
            </h2>
          </div>
          {editingTransaction.id !== "" && (
            <button 
              onClick={deleteTransaction}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-red-400"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>

        {editingTransaction.id !== "" && (
          <div className="flex flex-col items-center mb-2 relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg mb-3 border border-white/10">
              <div className="text-white">
                <CategoryIcon category={editingTransaction.category} size={28} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/80 font-bold uppercase tracking-widest text-[10px]">{editingTransaction.category}</span>
              <button onClick={() => setShowCategoryPicker(true)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <Edit2 size={12} className="text-white/60" />
              </button>
            </div>
          </div>
        )}

        <div className="text-center py-2 relative z-10">
          <div className="flex items-center justify-center gap-1">
            <span className="text-3xl font-light text-white/60">₹</span>
            <input 
              type="number" 
              placeholder="0" 
              value={editingTransaction.amount || ""}
              onChange={(e) => setEditingTransaction({ ...editingTransaction, amount: parseFloat(e.target.value) || 0 })}
              className="bg-transparent border-none text-4xl font-extrabold text-white focus:ring-0 w-48 text-center placeholder:text-white/20 tracking-tighter"
            />
          </div>
          <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            {editingTransaction.paymentMethod} • {format(parseISO(editingTransaction.date), "dd MMM yyyy")}
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-2 -mt-6 relative z-20">
        <div className="bg-white rounded-3xl p-3 shadow-xl border border-slate-100">
          {/* Description Input */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400">
              <CategoryIcon category={editingTransaction.category} size={18} />
            </div>
            <input 
              type="text" 
              placeholder="What was this for?" 
              value={editingTransaction.description}
              onChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.target.value })}
              className="bg-transparent border-none p-0 font-bold text-slate-800 focus:ring-0 w-full placeholder:text-slate-300 text-sm"
            />
          </div>

          {editingTransaction.id === "" && (
          <div className="space-y-4" >
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</p>
                <AnimatePresence>
                  {suggestedCategory && suggestedCategory !== editingTransaction.category && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100"
                    >
                      <Sparkles size={10} />
                      <span className="text-[9px] font-bold uppercase tracking-tight">Suggest: {suggestedCategory}</span>
                      <button 
                        onClick={() => {
                          setEditingTransaction({ ...editingTransaction, category: suggestedCategory });
                          setSuggestedCategory(null);
                        }}
                        className="p-0.5 hover:bg-indigo-100 rounded-full transition-colors"
                      >
                        <Check size={10} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button 
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest"
              >
                {showAllCategories ? "Show Less" : "Show All"}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-y-6 gap-x-2">
              {(showAllCategories ? categories : categories.slice(0, 8)).map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => setEditingTransaction({ ...editingTransaction, category: cat.label })}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div 
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm transition-all active:scale-90",
                      editingTransaction.category === cat.label ? "ring-2 ring-indigo-500 ring-offset-2 scale-105" : "opacity-80"
                    )}
                    style={{ backgroundColor: cat.color }}
                  >
                    <cat.icon size={20} />
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold text-center leading-tight transition-colors truncate w-full px-1",
                    editingTransaction.category === cat.label ? "text-indigo-600" : "text-slate-500"
                  )}>
                    {cat.label}
                  </span>
                </button>
              ))}
              <button 
                onClick={() => setShowAddCategoryModal(true)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all">
                  <Plus size={20} />
                </div>
                <span className="text-[9px] font-bold text-slate-400">New</span>
              </button>
            </div>
          </div>
          )}

          {/* Form Fields */}
          <div className="space-y-1 pt-2 border-t border-slate-50">
            <div className="flex items-center justify-between py-2 px-1">
              <div className="flex items-center gap-3 w-full">
                <Calendar size={18} className="text-slate-400" />
                <input 
                  type="date" 
                  value={editingTransaction.date.split('T')[0]}
                  disabled={editingTransaction.id !== ""}
                  onChange={(e) => {
                    if (e.target.value) {
                      const newDate = new Date(e.target.value);
                      newDate.setHours(12, 0, 0, 0);
                      setEditingTransaction({ ...editingTransaction, date: newDate.toISOString() });
                    }
                  }}
                  className={cn(
                    "bg-transparent border-none p-0 text-xs font-bold focus:ring-0 w-full",
                    editingTransaction.id !== "" ? "text-slate-400 cursor-not-allowed" : "text-slate-700 cursor-pointer"
                  )}
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2 px-1">
              <div className="flex items-center gap-3">
                <Wallet size={18} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Method</span>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                <button 
                  onClick={() => setEditingTransaction({ ...editingTransaction, paymentMethod: "cash" })}
                  disabled={editingTransaction.id !== ""}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[9px] font-bold transition-all",
                    editingTransaction.paymentMethod === "cash" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"
                  )}
                >
                  Cash
                </button>
                <button 
                  onClick={() => setEditingTransaction({ ...editingTransaction, paymentMethod: "upi" })}
                  disabled={editingTransaction.id !== ""}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[9px] font-bold transition-all",
                    editingTransaction.paymentMethod === "upi" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"
                  )}
                >
                  UPI
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 px-1">
              <div className="flex items-center gap-3">
                <RotateCcw size={18} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-700">Is Expense</span>
              </div>
              <button 
                onClick={() => setEditingTransaction({ ...editingTransaction, isSpend: !editingTransaction.isSpend })}
                className={cn(
                  "w-10 h-5 rounded-full relative transition-colors duration-300",
                  editingTransaction.isSpend ? "bg-emerald-500" : "bg-slate-200"
                )}
              >
                <motion.div 
                  animate={{ x: editingTransaction.isSpend ? 22 : 2 }}
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>

            {editingTransaction.smsContent && (
              <div className="py-4 space-y-2 border-b border-slate-50 px-1">
                <div className="flex items-center gap-3 text-slate-400">
                  <MessageSquare size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">SMS Content</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                  "{editingTransaction.smsContent}"
                </p>
              </div>
            )}

            <div className="flex items-start gap-3 py-2 px-1 border-b border-slate-50">
              <FileText size={18} className="text-slate-400 mt-0.5" />
              <textarea 
                placeholder="Add Note (Optional)"
                value={editingTransaction.note || ""}
                onChange={(e) => setEditingTransaction({ ...editingTransaction, note: e.target.value })}
                className="bg-transparent border-none p-0 text-xs font-bold text-slate-700 focus:ring-0 w-full placeholder:text-slate-300 resize-none h-10"
              ></textarea>
            </div>

            <div className="flex items-center justify-between py-2 px-1">
              <div className="flex items-center gap-3 w-full">
                <Upload size={18} className="text-slate-400" />
                <label className="text-xs font-bold text-slate-700 cursor-pointer flex-1">
                  {editingTransaction.billImage ? "Bill Uploaded" : "Upload Bill/Receipt"}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditingTransaction({ ...editingTransaction, billImage: URL.createObjectURL(file) });
                      }
                    }}
                  />
                </label>
                {editingTransaction.billImage && (
                  <div className="w-8 h-8 rounded bg-slate-100 overflow-hidden border border-slate-200">
                    <img src={editingTransaction.billImage} alt="bill" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={saveTransaction}
          className="w-full bg-[#0A2E1F] text-white py-4 rounded-2xl font-bold text-sm shadow-xl active:scale-[0.98] transition-all mt-2"
        >
          {editingTransaction.id === "" ? "Add Transaction" : "Save Changes"}
        </button>

        {editingTransaction.id === "" && (
          <div className="mt-8 bg-slate-100/50 rounded-3xl p-5 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-sm">
                <History size={16} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs">Sync from SMS</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Auto-fill with AI</p>
              </div>
            </div>
            <textarea 
              placeholder="Paste your bank SMS here..."
              value={smsInput}
              onChange={(e) => setSmsInput(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500 h-20 resize-none shadow-sm"
            ></textarea>
            <button 
              onClick={handleAiParse}
              disabled={isAiLoading || !smsInput.trim()}
              className="w-full mt-3 bg-white text-indigo-600 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-indigo-100 shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAiLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Parsing...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Parse with AI
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
