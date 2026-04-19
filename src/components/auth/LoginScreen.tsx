import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Alert,
  ScrollView
} from "react-native";
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import tw from "twrnc";
import { Mail, Lock, LogIn, ChevronRight, AlertCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView, AnimatePresence } from "moti";
import { Image } from "react-native";

interface LoginScreenProps {
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSwitchToSignup, onForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = async () => {
    setError(null);
    setSuccess(null);
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error: any) {
      console.error("Login Error:", error);
      let message = "An error occurred during login";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        message = "Invalid email or password";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email format";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many failed attempts. Please try again later.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Use signInWithPopup which is more reliable in the AI Studio environment
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Google Login Error:", error);
      if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
        setError("Sign in with Google is currently unavailable in this preview. Please use your email instead.");
      }
    } finally {
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
        style={tw`flex-1`}
      >
        <ScrollView contentContainerStyle={tw`flex-grow justify-center px-6 py-12`}>
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 500 }}
            style={tw`items-center mb-12`}
          >
            <View style={tw`w-20 h-20 bg-indigo-500 rounded-3xl items-center justify-center shadow-2xl mb-6`}>
              <LogIn size={40} color="white" strokeWidth={2.5} />
            </View>
            <Text style={tw`text-3xl font-black text-white tracking-tighter`}>MoneyTracker</Text>
            <Text style={tw`text-slate-400 font-medium mt-2`}>Welcome back, login to your account</Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 600, delay: 200 }}
            style={tw`gap-4`}
          >
            <AnimatePresence>
              {error && (
                <MotiView
                  from={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={tw`bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex-row items-center gap-3`}
                >
                  <AlertCircle size={18} color="#EF4444" />
                  <Text style={tw`text-red-500 text-xs font-bold flex-1`}>{error}</Text>
                </MotiView>
              )}
              {success && (
                <MotiView
                  from={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={tw`bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex-row items-center gap-3`}
                >
                  <LogIn size={18} color="#10B981" />
                  <Text style={tw`text-emerald-600 text-xs font-bold flex-1`}>{success}</Text>
                </MotiView>
              )}
            </AnimatePresence>

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

            <View style={tw`relative`}>
              <View style={tw`absolute left-4 top-4.5 z-10`}>
                <Lock size={18} color="#64748B" />
              </View>
              <TextInput
                style={tw`bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white font-medium`}
                placeholder="Password"
                placeholderTextColor="#64748B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              onPress={onForgotPassword}
              style={tw`items-end mt-1`}
            >
              <Text style={tw`text-indigo-400 font-bold text-xs uppercase tracking-widest`}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleLogin}
              disabled={loading}
              style={tw`bg-indigo-500 rounded-2xl py-4 flex-row items-center justify-center shadow-lg mt-4`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={tw`text-white font-black text-lg mr-2`}>Login</Text>
                  <ChevronRight size={20} color="white" strokeWidth={3} />
                </>
              )}
            </TouchableOpacity>

            <View style={tw`flex-row items-center my-6`}>
              <View style={tw`flex-1 h-px bg-slate-700`} />
              <Text style={tw`text-slate-500 px-4 font-bold text-[10px] uppercase tracking-widest`}>Or continue with</Text>
              <View style={tw`flex-1 h-px bg-slate-700`} />
            </View>

            <TouchableOpacity 
              onPress={handleGoogleLogin}
              style={tw`w-full bg-white rounded-2xl py-3.5 items-center justify-center shadow-sm flex-row gap-3`}
            >
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} 
                style={tw`w-5 h-5`}
                referrerPolicy="no-referrer"
              />
              <Text style={tw`text-slate-900 font-bold`}>Sign in with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onSwitchToSignup}
              style={tw`mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl items-center`}
            >
              <Text style={tw`text-slate-400 font-medium`}>New to MoneyTracker?</Text>
              <Text style={tw`text-indigo-400 font-black text-lg mt-1 underline`}>Create Free Account</Text>
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};
