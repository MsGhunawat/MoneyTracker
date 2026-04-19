import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { MotiView } from "moti";
import { Wallet } from "lucide-react-native";
import { format } from "date-fns";
import tw from "twrnc";
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
    <Modal
      visible={showCarryForwardModal}
      transparent
      animationType="fade"
    >
      <View style={tw`flex-1 justify-center items-center p-6 bg-black/60`}>
        <MotiView 
          from={{ opacity: 0, scale: 0.9, translateY: 20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          style={tw`bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl gap-5`}
        >
          <View style={tw`w-14 h-14 bg-emerald-50 rounded-full items-center justify-center self-center`}>
            <Wallet size={24} color="#0A2E1F" />
          </View>
          <View style={tw`items-center gap-1`}>
            <Text style={tw`text-lg font-bold text-slate-800 tracking-tight`}>New Month Detected!</Text>
            <Text style={tw`text-slate-500 text-xs font-medium text-center`}>
              You had <Text style={tw`font-bold text-slate-800`}>{formatCurrency(pendingCarryForward)}</Text> remaining in cash from last month.
            </Text>
          </View>
          <View style={tw`gap-2`}>
            <TouchableOpacity 
              onPress={() => handleCarryForward(true)}
              style={tw`w-full bg-[#0A2E1F] py-3.5 rounded-xl items-center shadow-lg shadow-emerald-900/20`}
            >
              <Text style={tw`text-white font-bold text-xs uppercase tracking-widest`}>Carry Forward to {format(new Date(), "MMMM")}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleCarryForward(false)}
              style={tw`w-full bg-slate-100 py-3.5 rounded-xl items-center`}
            >
              <Text style={tw`text-slate-600 font-bold text-xs uppercase tracking-widest`}>Mark as Misc Spend</Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      </View>
    </Modal>
  );
};
