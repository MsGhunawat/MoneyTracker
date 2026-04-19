import React from "react";
import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import { MotiView, AnimatePresence } from "moti";
import tw from "twrnc";

interface AddCategoryModalProps {
  showAddCategoryModal: boolean;
  setShowAddCategoryModal: (show: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  availableIcons: any[];
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  handleAddCategory: () => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  showAddCategoryModal,
  setShowAddCategoryModal,
  newCategoryName,
  setNewCategoryName,
  availableIcons,
  selectedIcon,
  setSelectedIcon,
  handleAddCategory,
}) => {
  return (
    <Modal
      visible={showAddCategoryModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowAddCategoryModal(false)}
    >
      <View style={tw`flex-1 justify-center items-center p-6 bg-black/60`}>
        <MotiView 
          from={{ opacity: 0, scale: 0.9, translateY: 20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          style={tw`bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl gap-5`}
        >
          <Text style={tw`text-lg font-bold text-slate-800 tracking-tight`}>Add Custom Category</Text>
          
          <View style={tw`gap-4`}>
            <View style={tw`bg-slate-50 p-4 rounded-2xl border border-slate-100`}>
              <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1`}>Category Name</Text>
              <TextInput 
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder="e.g. Gym" 
                placeholderTextColor="#CBD5E1"
                style={tw`w-full p-0 font-bold text-slate-800 text-sm`}
              />
            </View>

            <View style={tw`gap-2`}>
              <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1`}>Select Icon</Text>
              <View style={tw`flex-row flex-wrap gap-2`}>
                {availableIcons.map((item) => (
                  <TouchableOpacity 
                    key={item.name}
                    onPress={() => setSelectedIcon(item.name)}
                    style={tw`w-11 h-11 rounded-xl items-center justify-center ${selectedIcon === item.name ? "bg-[#0A2E1F] shadow-lg" : "bg-slate-50"}`}
                  >
                    <item.icon size={18} color={selectedIcon === item.name ? "white" : "#94A3B8"} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={tw`flex-row gap-3 pt-2`}>
            <TouchableOpacity 
              onPress={() => setShowAddCategoryModal(false)}
              style={tw`flex-1 bg-slate-100 py-3 rounded-xl items-center`}
            >
              <Text style={tw`text-slate-600 font-bold text-xs uppercase tracking-widest`}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleAddCategory}
              style={tw`flex-1 bg-[#0A2E1F] py-3 rounded-xl items-center shadow-lg`}
            >
              <Text style={tw`text-white font-bold text-xs uppercase tracking-widest`}>Add</Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      </View>
    </Modal>
  );
};
