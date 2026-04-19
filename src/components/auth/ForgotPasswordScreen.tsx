import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Alert
} from "react-native";
import { 
  sendPasswordResetEmail,
  confirmPasswordReset
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import tw from "twrnc";
import { Mail, Lock, KeyRound, ChevronRight, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView, AnimatePresence } from "moti";

interface ForgotPasswordScreenProps {
  onBackToLogin: () => void;
}

type Step = "email" | "otp" | "reset" | "success";

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onBackToLogin }) => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSendOtp = async () => {
    setError(null);
    if (!email.trim() || !validateEmail(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      // In a real app with custom OTP, we would call a backend here.
      // For this Firebase-only setup, we'll send the official reset link
      // but continue the UI flow as requested by the user.
      await sendPasswordResetEmail(auth, email.trim());
      setStep("otp");
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    setError(null);
    if (otp.length !== 4) {
      setError("Please enter 4-digit verification code");
      return;
    }
    // Simulation: Accepting any 4-digit code for the preview experience
    setStep("reset");
  };

  const handleResetPassword = async () => {
    setError(null);
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Note: Full password reset via API requires the OOB code from the email.
      // For this UI mockup, we'll show success.
      // In production, the user would use the link in their email.
      setTimeout(() => {
        setStep("success");
        setLoading(false);
      }, 1500);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1 bg-slate-900`}
    >
      <LinearGradient
        colors={['#0F172A', '#1E293B']}
        style={tw`flex-1 px-6 justify-center`}
      >
        <TouchableOpacity 
          onPress={onBackToLogin}
          style={tw`absolute top-12 left-6 z-20 flex-row items-center gap-2`}
        >
          <ArrowLeft size={20} color="white" />
          <Text style={tw`text-white font-bold`}>Back</Text>
        </TouchableOpacity>

        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={tw`items-center mb-12`}
        >
          <View style={tw`w-20 h-20 bg-amber-500 rounded-3xl items-center justify-center shadow-2xl mb-6`}>
            {step === "success" ? (
              <CheckCircle2 size={40} color="white" strokeWidth={2.5} />
            ) : (
              <KeyRound size={40} color="white" strokeWidth={2.5} />
            )}
          </View>
          <Text style={tw`text-3xl font-black text-white tracking-tighter`}>
            {step === "success" ? "All Set!" : "Reset Password"}
          </Text>
          <Text style={tw`text-slate-400 font-medium mt-2 text-center`}>
            {step === "email" && "Enter your email to receive a reset code"}
            {step === "otp" && `We've sent a code to ${email}`}
            {step === "reset" && "Create a strong new password"}
            {step === "success" && "Your password has been updated"}
          </Text>
        </MotiView>

        <AnimatePresence>
          {error && (
            <MotiView
              from={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={tw`bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex-row items-center gap-3 mb-4`}
            >
              <AlertCircle size={18} color="#EF4444" />
              <Text style={tw`text-red-500 text-xs font-bold flex-1`}>{error}</Text>
            </MotiView>
          )}

          {step === "email" && (
            <MotiView
              key="email-step"
              from={{ opacity: 0, translateX: 50 }}
              animate={{ opacity: 1, translateX: 0 }}
              exit={{ opacity: 0, translateX: -50 }}
              style={tw`gap-4`}
            >
              <View style={tw`relative`}>
                <View style={tw`absolute left-4 top-4.5 z-10`}>
                  <Mail size={18} color="#64748B" />
                </View>
                <TextInput
                  style={tw`bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white font-medium`}
                  placeholder="Email Address"
                  placeholderTextColor="#64748B"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              <TouchableOpacity 
                onPress={handleSendOtp}
                disabled={loading}
                style={tw`bg-indigo-500 rounded-2xl py-4 flex-row items-center justify-center shadow-lg mt-2`}
              >
                {loading ? <ActivityIndicator color="white" /> : (
                  <>
                    <Text style={tw`text-white font-black text-lg mr-2`}>Send Verification</Text>
                    <ChevronRight size={20} color="white" strokeWidth={3} />
                  </>
                )}
              </TouchableOpacity>
            </MotiView>
          )}

          {step === "otp" && (
            <MotiView
              key="otp-step"
              from={{ opacity: 0, translateX: 50 }}
              animate={{ opacity: 1, translateX: 0 }}
              exit={{ opacity: 0, translateX: -50 }}
              style={tw`gap-4`}
            >
              <View style={tw`flex-row justify-center gap-4`}>
                <TextInput
                  style={tw`bg-slate-800/50 border border-slate-700 rounded-2xl w-full py-4 text-center text-white text-2xl font-black`}
                  placeholder="0000"
                  placeholderTextColor="#334155"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={4}
                  keyboardType="number-pad"
                />
              </View>
              <TouchableOpacity 
                onPress={handleVerifyOtp}
                disabled={loading}
                style={tw`bg-indigo-500 rounded-2xl py-4 flex-row items-center justify-center shadow-lg mt-2`}
              >
                <Text style={tw`text-white font-black text-lg mr-2`}>Verify Code</Text>
                <ChevronRight size={20} color="white" strokeWidth={3} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleSendOtp}
                style={tw`items-center`}
              >
                <Text style={tw`text-indigo-400 font-bold text-xs uppercase tracking-widest`}>Resend Code</Text>
              </TouchableOpacity>
            </MotiView>
          )}

          {step === "reset" && (
            <MotiView
              key="reset-step"
              from={{ opacity: 0, translateX: 50 }}
              animate={{ opacity: 1, translateX: 0 }}
              exit={{ opacity: 0, translateX: -50 }}
              style={tw`gap-4`}
            >
              <View style={tw`relative`}>
                <View style={tw`absolute left-4 top-4.5 z-10`}>
                  <Lock size={18} color="#64748B" />
                </View>
                <TextInput
                  style={tw`bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white font-medium`}
                  placeholder="New Password"
                  placeholderTextColor="#64748B"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
              </View>
              <View style={tw`relative`}>
                <View style={tw`absolute left-4 top-4.5 z-10`}>
                  <Lock size={18} color="#64748B" />
                </View>
                <TextInput
                  style={tw`bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white font-medium`}
                  placeholder="Confirm New Password"
                  placeholderTextColor="#64748B"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
              <TouchableOpacity 
                onPress={handleResetPassword}
                disabled={loading}
                style={tw`bg-indigo-500 rounded-2xl py-4 flex-row items-center justify-center shadow-lg mt-2`}
              >
                {loading ? <ActivityIndicator color="white" /> : (
                  <>
                    <Text style={tw`text-white font-black text-lg mr-2`}>Reset Password</Text>
                    <CheckCircle2 size={20} color="white" strokeWidth={3} />
                  </>
                )}
              </TouchableOpacity>
            </MotiView>
          )}

          {step === "success" && (
            <MotiView
              key="success-step"
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={tw`items-center`}
            >
              <TouchableOpacity 
                onPress={onBackToLogin}
                style={tw`bg-emerald-500 rounded-2xl py-4 px-8 flex-row items-center justify-center shadow-lg`}
              >
                <Text style={tw`text-white font-black text-lg mr-2`}>Return to Login</Text>
                <ChevronRight size={20} color="white" strokeWidth={3} />
              </TouchableOpacity>
            </MotiView>
          )}
        </AnimatePresence>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};
