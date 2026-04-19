import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Switch, Image, ActivityIndicator } from "react-native";
import { MotiView, AnimatePresence } from "moti";
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
} from "lucide-react-native";
import { format, parseISO } from "date-fns";
import tw from "twrnc";
import { Transaction } from "../types";
import { formatPaymentMethod } from "../utils";
import { CategoryIcon } from "./CategoryIcon";
import { parseTransactionWithAI, suggestCategoryWithAI } from "../services/aiService";

// Remove raw GoogleGenAI initialization as it's now in aiService

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
      const result = await parseTransactionWithAI(smsInput);
      if (result && result.amount) {
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
      const suggested = await suggestCategoryWithAI(text, categories.map(c => c.label));
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
    <View style={tw`flex-1 bg-slate-50`}>
      <ScrollView contentContainerStyle={tw`pb-32`}>
        {/* Header Area */}
        <View style={tw`bg-slate-900 p-6 pt-12 pb-10 rounded-b-[40px] relative overflow-hidden`}>
          <View style={[tw`absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32`, { opacity: 0.1 }]} />
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <View style={tw`flex-row items-center gap-3`}>
              <TouchableOpacity 
                onPress={() => {
                  setActiveTab(previousTab as any);
                  setSelectedTransaction(null);
                  setEditingTransaction(null);
                }} 
                style={tw`p-2 bg-white/10 rounded-full`}
              >
                <ArrowLeft size={20} color="white" />
              </TouchableOpacity>
              <Text style={tw`text-lg font-bold text-white tracking-tight`}>
                {editingTransaction.id === "" ? "Add Transaction" : "Details"}
              </Text>
            </View>
            {editingTransaction.id !== "" && (
              <TouchableOpacity 
                onPress={deleteTransaction}
                style={tw`p-2 bg-white/10 rounded-full`}
              >
                <Trash2 size={20} color="#F87171" />
              </TouchableOpacity>
            )}
          </View>

          {editingTransaction.id !== "" && (
            <View style={tw`items-center mb-6`}>
              <View style={tw`w-16 h-16 bg-white/10 rounded-2xl items-center justify-center shadow-lg mb-3 border border-white/10`}>
                <CategoryIcon category={editingTransaction.category} size={28} color="white" />
              </View>
              <View style={tw`flex-row items-center gap-2`}>
                <Text style={tw`text-white/80 font-bold uppercase tracking-widest text-[10px]`}>{editingTransaction.category}</Text>
                <TouchableOpacity onPress={() => setShowCategoryPicker(true)} style={tw`p-1 bg-white/10 rounded-full`}>
                  <Edit2 size={12} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={tw`items-center py-2`}>
            <View style={tw`flex-row items-center justify-center gap-1`}>
              <Text style={tw`text-3xl font-light text-white/60`}>₹</Text>
              <TextInput 
                keyboardType="numeric"
                placeholder="0" 
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={editingTransaction.amount ? editingTransaction.amount.toString() : ""}
                onChangeText={(text) => setEditingTransaction({ ...editingTransaction, amount: parseFloat(text) || 0 })}
                style={tw`text-4xl font-extrabold text-white w-48 text-center tracking-tighter`}
              />
            </View>
            <Text style={tw`text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2`}>
              {formatPaymentMethod(editingTransaction.paymentMethod)} • {format(parseISO(editingTransaction.date), "dd MMM yyyy")}
            </Text>
          </View>
        </View>

        {/* Form Content */}
        <View style={tw`px-4 -mt-6`}>
          <View style={tw`bg-white rounded-3xl p-4 shadow-xl border border-slate-100`}>
            {/* Description Input */}
            <View style={tw`flex-row items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-6`}>
              <View style={tw`w-10 h-10 bg-white rounded-xl items-center justify-center shadow-sm`}>
                <CategoryIcon category={editingTransaction.category} size={18} color="#94A3B8" />
              </View>
              <TextInput 
                placeholder="What was this for?" 
                placeholderTextColor="#CBD5E1"
                value={editingTransaction.description}
                onChangeText={(text) => setEditingTransaction({ ...editingTransaction, description: text })}
                style={tw`flex-1 font-bold text-slate-800 text-sm`}
              />
            </View>

            {editingTransaction.id === "" && (
              <View style={tw`mb-6`}>
                <View style={tw`flex-row justify-between items-center mb-4`}>
                  <View style={tw`flex-row items-center gap-2`}>
                    <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest`}>Category</Text>
                    <AnimatePresence>
                      {suggestedCategory && suggestedCategory !== editingTransaction.category && (
                        <MotiView 
                          from={{ opacity: 0, translateX: -10 }}
                          animate={{ opacity: 1, translateX: 0 }}
                          exit={{ opacity: 0, translateX: -10 }}
                          style={tw`flex-row items-center gap-1.5 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100`}
                        >
                          <Sparkles size={10} color="#4F46E5" />
                          <Text style={tw`text-[9px] font-bold text-indigo-600 uppercase tracking-tight`}>Suggest: {suggestedCategory}</Text>
                          <TouchableOpacity 
                            onPress={() => {
                              setEditingTransaction({ ...editingTransaction, category: suggestedCategory });
                              setSuggestedCategory(null);
                            }}
                            style={tw`p-0.5 bg-indigo-100 rounded-full`}
                          >
                            <Check size={10} color="#4F46E5" />
                          </TouchableOpacity>
                        </MotiView>
                      )}
                    </AnimatePresence>
                  </View>
                  <TouchableOpacity onPress={() => setShowAllCategories(!showAllCategories)}>
                    <Text style={tw`text-[10px] font-bold text-indigo-600 uppercase tracking-widest`}>
                      {showAllCategories ? "Show Less" : "Show All"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={tw`flex-row flex-wrap gap-y-6 justify-between`}>
                  {(showAllCategories ? categories : categories.slice(0, 8)).map((cat) => (
                    <TouchableOpacity 
                      key={cat.id} 
                      onPress={() => setEditingTransaction({ ...editingTransaction, category: cat.label })}
                      style={tw`items-center w-[22%]`}
                    >
                      <View 
                        style={[
                          tw`w-12 h-12 rounded-2xl items-center justify-center shadow-sm mb-1.5`,
                          { backgroundColor: cat.color },
                          editingTransaction.category === cat.label ? tw`border-2 border-indigo-500` : { opacity: 0.8 }
                        ]}
                      >
                        <CategoryIcon category={cat.label} size={20} color="white" />
                      </View>
                      <Text 
                        numberOfLines={1}
                        style={tw`text-[9px] font-bold text-center leading-tight ${editingTransaction.category === cat.label ? "text-indigo-600" : "text-slate-500"}`}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity 
                    onPress={() => setShowAddCategoryModal(true)}
                    style={tw`items-center w-[22%]`}
                  >
                    <View style={tw`w-12 h-12 rounded-2xl border-2 border-dashed border-slate-200 items-center justify-center`}>
                      <Plus size={20} color="#94A3B8" />
                    </View>
                    <Text style={tw`text-[9px] font-bold text-slate-400 mt-1.5`}>New</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Form Fields */}
            <View style={tw`border-t border-slate-50 pt-4`}>
              <View style={tw`flex-row items-center justify-between py-3`}>
                <View style={tw`flex-row items-center gap-3`}>
                  <Calendar size={18} color="#94A3B8" />
                  <Text style={tw`text-xs font-bold text-slate-700`}>Date</Text>
                </View>
                <Text style={tw`text-xs font-bold text-slate-400`}>
                  {format(parseISO(editingTransaction.date), "dd MMM yyyy")}
                </Text>
              </View>

              <View style={tw`flex-row items-center justify-between py-3`}>
                <View style={tw`flex-row items-center gap-3`}>
                  <Wallet size={18} color="#94A3B8" />
                  <Text style={tw`text-xs font-bold text-slate-700`}>Method</Text>
                </View>
                <View style={tw`flex-row bg-slate-50 p-1 rounded-xl border border-slate-100`}>
                  <TouchableOpacity 
                    onPress={() => setEditingTransaction({ ...editingTransaction, paymentMethod: "cash" })}
                    disabled={editingTransaction.id !== ""}
                    style={tw`px-4 py-1.5 rounded-lg ${editingTransaction.paymentMethod === "cash" ? "bg-white shadow-sm" : ""}`}
                  >
                    <Text style={tw`text-[9px] font-bold ${editingTransaction.paymentMethod === "cash" ? "text-indigo-600" : "text-slate-400"}`}>Cash</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setEditingTransaction({ ...editingTransaction, paymentMethod: "upi" })}
                    disabled={editingTransaction.id !== ""}
                    style={tw`px-4 py-1.5 rounded-lg ${editingTransaction.paymentMethod === "upi" ? "bg-white shadow-sm" : ""}`}
                  >
                    <Text style={tw`text-[9px] font-bold ${editingTransaction.paymentMethod === "upi" ? "text-indigo-600" : "text-slate-400"}`}>Online</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={tw`flex-row items-center justify-between py-3`}>
                <View style={tw`flex-row items-center gap-3`}>
                  <RotateCcw size={18} color="#94A3B8" />
                  <Text style={tw`text-xs font-bold text-slate-700`}>Is Expense</Text>
                </View>
                <Switch 
                  value={editingTransaction.isSpend}
                  onValueChange={(val) => setEditingTransaction({ ...editingTransaction, isSpend: val })}
                  trackColor={{ false: "#E2E8F0", true: "#10B981" }}
                  thumbColor="white"
                />
              </View>

              {editingTransaction.smsContent && (
                <View style={tw`py-4 border-b border-slate-50`}>
                  <View style={tw`flex-row items-center gap-3 mb-2`}>
                    <MessageSquare size={18} color="#94A3B8" />
                    <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest`}>SMS Content</Text>
                  </View>
                  <View style={tw`bg-slate-50 p-3 rounded-xl border border-slate-100`}>
                    <Text style={tw`text-[11px] text-slate-500 italic leading-relaxed`}>"{editingTransaction.smsContent}"</Text>
                  </View>
                </View>
              )}

              <View style={tw`flex-row items-start gap-3 py-3 border-b border-slate-50`}>
                <FileText size={18} color="#94A3B8" style={tw`mt-1`} />
                <TextInput 
                  placeholder="Add Note (Optional)"
                  placeholderTextColor="#CBD5E1"
                  multiline
                  value={editingTransaction.note || ""}
                  onChangeText={(text) => setEditingTransaction({ ...editingTransaction, note: text })}
                  style={tw`flex-1 text-xs font-bold text-slate-700 min-h-[40px]`}
                />
              </View>

              <View style={tw`flex-row items-center justify-between py-3`}>
                <View style={tw`flex-row items-center gap-3 flex-1`}>
                  <Upload size={18} color="#94A3B8" />
                  <Text style={tw`text-xs font-bold text-slate-700`}>
                    {editingTransaction.billImage ? "Bill Uploaded" : "Upload Bill/Receipt"}
                  </Text>
                </View>
                {editingTransaction.billImage && (
                  <View style={tw`w-8 h-8 rounded bg-slate-100 overflow-hidden border border-slate-200`}>
                    <Image source={{ uri: editingTransaction.billImage }} style={tw`w-full h-full`} resizeMode="cover" />
                  </View>
                )}
              </View>
            </View>
          </View>

          <TouchableOpacity 
            onPress={saveTransaction}
            style={tw`w-full bg-indigo-600 py-4 rounded-2xl items-center shadow-xl mt-4`}
          >
            <Text style={tw`text-white font-bold text-sm`}>
              {editingTransaction.id === "" ? "Add Transaction" : "Save Changes"}
            </Text>
          </TouchableOpacity>

          {editingTransaction.id === "" && (
            <View style={tw`mt-8 bg-slate-100 p-5 rounded-3xl border border-slate-100`}>
              <View style={tw`flex-row items-center gap-3 mb-4`}>
                <View style={tw`w-8 h-8 bg-indigo-600 rounded-lg items-center justify-center shadow-sm`}>
                  <History size={16} color="white" />
                </View>
                <View>
                  <Text style={tw`font-bold text-slate-800 text-xs`}>Sync from SMS</Text>
                  <Text style={tw`text-[9px] text-slate-400 font-bold uppercase tracking-widest`}>Auto-fill with AI</Text>
                </View>
              </View>
              <TextInput 
                placeholder="Paste your bank SMS here..."
                placeholderTextColor="#CBD5E1"
                multiline
                value={smsInput}
                onChangeText={(text) => setSmsInput(text)}
                style={tw`w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 min-h-[80px] shadow-sm mb-3`}
              />
              <TouchableOpacity 
                onPress={handleAiParse}
                disabled={isAiLoading || !smsInput.trim()}
                style={tw`w-full bg-white py-2.5 rounded-xl border border-indigo-100 shadow-sm flex-row items-center justify-center gap-2 ${isAiLoading || !smsInput.trim() ? "opacity-50" : ""}`}
              >
                {isAiLoading ? (
                  <>
                    <ActivityIndicator size="small" color="#4F46E5" />
                    <Text style={tw`text-indigo-600 font-bold text-[10px] uppercase tracking-widest`}>Parsing...</Text>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} color="#4F46E5" />
                    <Text style={tw`text-indigo-600 font-bold text-[10px] uppercase tracking-widest`}>Parse with AI</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
