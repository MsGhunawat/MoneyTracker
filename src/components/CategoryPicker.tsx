import React from "react";
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView } from "react-native";
import { MotiView } from "moti";
import { Plus, Search } from "lucide-react-native";
import tw from "twrnc";
import { Transaction } from "../types";

interface CategoryPickerProps {
  showCategoryPicker: boolean;
  setShowCategoryPicker: (show: boolean) => void;
  categories: any[];
  editingTransaction: Transaction | null;
  setEditingTransaction: (tx: Transaction | null) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  showCategoryPicker,
  setShowCategoryPicker,
  categories,
  editingTransaction,
  setEditingTransaction,
}) => {
  return (
    <Modal
      visible={showCategoryPicker}
      transparent
      animationType="slide"
      onRequestClose={() => setShowCategoryPicker(false)}
    >
      <View style={tw`flex-1 justify-end bg-black/60`}>
        <MotiView 
          from={{ translateY: 300 }}
          animate={{ translateY: 0 }}
          style={tw`bg-white w-full rounded-t-[2.5rem] p-8 max-h-[85%]`}
        >
          <View style={tw`flex-row items-center justify-between mb-8`}>
            <Text style={tw`text-xl font-bold text-slate-800`}>Select Category</Text>
            <TouchableOpacity 
              onPress={() => setShowCategoryPicker(false)}
              style={tw`w-10 h-10 bg-slate-100 rounded-full items-center justify-center`}
            >
              <Plus size={20} color="#94A3B8" style={{ transform: [{ rotate: '45deg' }] }} />
            </TouchableOpacity>
          </View>

          <View style={tw`relative mb-8`}>
            <View style={tw`absolute left-4 top-1/2 -translate-y-1/2 z-10`}>
              <Search color="#94A3B8" size={18} />
            </View>
            <TextInput 
              placeholder="Search category" 
              placeholderTextColor="#94A3B8"
              style={tw`w-full bg-slate-50 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-slate-800`}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={tw`mb-8`}>
              <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6`}>All Categories</Text>
              <View style={tw`flex-row flex-wrap gap-y-8 gap-x-4`}>
                {categories.map((cat) => (
                  <TouchableOpacity 
                    key={cat.id} 
                    onPress={() => {
                      if (editingTransaction) {
                        setEditingTransaction({ ...editingTransaction, category: cat.label });
                      }
                      setShowCategoryPicker(false);
                    }}
                    style={tw`items-center gap-2 w-[22%]`}
                  >
                    <View 
                      style={[
                        tw`w-14 h-14 rounded-full items-center justify-center shadow-md`,
                        { backgroundColor: cat.color },
                        editingTransaction?.category === cat.label && tw`border-4 border-indigo-500`
                      ]}
                    >
                      <cat.icon size={24} color="white" />
                    </View>
                    <Text style={tw`text-[10px] font-bold text-center leading-tight ${editingTransaction?.category === cat.label ? "text-indigo-600" : "text-slate-500"}`}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </MotiView>
      </View>
    </Modal>
  );
};
