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
  createUserWithEmailAndPassword, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import tw from "twrnc";
import { Mail, Lock, User, UserPlus, ChevronRight, AlertCircle } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView, AnimatePresence } from "moti";
import { Image } from "react-native";

interface SignupScreenProps {
  onSwitchToLogin: () => void;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSignup = async () => {
    setError(null);
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Update Firebase profile
      await updateProfile(user, { displayName: name.trim() });

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name.trim(),
        createdAt: new Date().toISOString(),
        monthlyBudget: 35000,
        cashInHand: 0,
      });

    } catch (error: any) {
      console.error(error);
      let message = "An error occurred during signup";
      if (error.code === "auth/email-already-in-use") {
        message = "This email is already registered";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email format";
      } else if (error.code === "auth/weak-password") {
        message = "Password is too weak";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document already exists
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date().toISOString(),
          monthlyBudget: 35000,
          cashInHand: 0,
        });
      }
    } catch (error: any) {
      console.error(error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setError(error.message);
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
            <View style={tw`w-20 h-20 bg-emerald-500 rounded-3xl items-center justify-center shadow-2xl mb-6`}>
              <UserPlus size={40} color="white" strokeWidth={2.5} />
            </View>
            <Text style={tw`text-3xl font-black text-white tracking-tighter`}>Create Account</Text>
            <Text style={tw`text-slate-400 font-medium mt-2`}>Start your financial journey today</Text>
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
            </AnimatePresence>

            <View style={tw`relative`}>
              <View style={tw`absolute left-4 top-4.5 z-10`}>
                <User size={18} color="#64748B" />
              </View>
              <TextInput
                style={tw`bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white font-medium`}
                placeholder="Full Name"
                placeholderTextColor="#64748B"
                value={name}
                onChangeText={setName}
              />
            </View>

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

            <View style={tw`relative`}>
              <View style={tw`absolute left-4 top-4.5 z-10`}>
                <Lock size={18} color="#64748B" />
              </View>
              <TextInput
                style={tw`bg-slate-800/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white font-medium`}
                placeholder="Confirm Password"
                placeholderTextColor="#64748B"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              onPress={handleSignup}
              disabled={loading}
              style={tw`bg-emerald-500 rounded-2xl py-4 flex-row items-center justify-center shadow-lg mt-4`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={tw`text-white font-black text-lg mr-2`}>Get Started</Text>
                  <ChevronRight size={20} color="white" strokeWidth={3} />
                </>
              )}
            </TouchableOpacity>

            <View style={tw`flex-row items-center my-6`}>
              <View style={tw`flex-1 h-px bg-slate-700`} />
              <Text style={tw`text-slate-500 px-4 font-bold text-[10px] uppercase tracking-widest`}>Or signup with</Text>
              <View style={tw`flex-1 h-px bg-slate-700`} />
            </View>

            <TouchableOpacity 
              onPress={handleGoogleSignup}
              style={tw`w-full bg-white rounded-2xl py-3.5 items-center justify-center shadow-sm flex-row gap-3`}
            >
              <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} 
                style={tw`w-5 h-5`}
                referrerPolicy="no-referrer"
              />
              <Text style={tw`text-slate-900 font-bold`}>Sign up with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={onSwitchToLogin}
              style={tw`mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl items-center`}
            >
              <Text style={tw`text-slate-400 font-medium`}>Already have an account?</Text>
              <Text style={tw`text-emerald-400 font-black text-lg mt-1 underline`}>Login to Continue</Text>
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};
