import React, { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { LoginScreen } from "./LoginScreen";
import { SignupScreen } from "./SignupScreen";
import { ForgotPasswordScreen } from "./ForgotPasswordScreen";
import tw from "twrnc";

export const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot">("login");

  if (loading) {
    return (
      <View style={tw`flex-1 bg-slate-900 justify-center items-center`}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!user) {
    if (authMode === "login") {
      return (
        <LoginScreen 
          onSwitchToSignup={() => setAuthMode("signup")} 
          onForgotPassword={() => setAuthMode("forgot")}
        />
      );
    }
    if (authMode === "signup") {
      return (
        <SignupScreen onSwitchToLogin={() => setAuthMode("login")} />
      );
    }
    return (
      <ForgotPasswordScreen onBackToLogin={() => setAuthMode("login")} />
    );
  }

  return <>{children}</>;
};
