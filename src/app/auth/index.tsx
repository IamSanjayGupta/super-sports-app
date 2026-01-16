import { useAppContext } from "@/src/context/AppContext";
import { Link } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAppContext();

  const handleLogin = async () => {
    await login(username, password);
  };

  return (
    <View className="flex-1 justify-center px-6">
      <Text className="text-3xl font-bold text-center mb-2">Welcome Back</Text>

      <View className="gap-6">
        <Text className="text-center mb-8">Login to your account</Text>

        <TextInput
          mode="outlined"
          label="Username"
          value={username}
          onChangeText={(username) => setUsername(username.trim())}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={(password) => setPassword(password.trim())}
          secureTextEntry
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          contentStyle={{ paddingVertical: 8 }}
          disabled={!username || !password}
        >
          Login
        </Button>
      </View>

      <View className="flex-row justify-center mt-6">
        <Link href={"/auth/signup"} replace>
          <Text className="">Don’t have an account? </Text>
          <Text className="ml-1 underline ">Sign up</Text>
        </Link>
      </View>
    </View>
  );
}
