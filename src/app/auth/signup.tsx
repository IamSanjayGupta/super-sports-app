import { Link } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

type Props = {
  onNavigateLogin?: () => void;
};

export default function SignupScreen({ onNavigateLogin }: Props) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    console.log({ name, username: username, password });
  };

  return (
    <View className="flex-1 justify-center px-6">
      <Text className="text-3xl font-bold mb-2">Create Account</Text>

      <View className="gap-4">
        <Text className="mb-8">Sign up to get started</Text>

        <TextInput
          mode="outlined"
          label="Full Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          mode="outlined"
          label="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          keyboardType="numbers-and-punctuation"
        />

        <TextInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          mode="contained"
          onPress={handleSignup}
          contentStyle={{ paddingVertical: 8 }}
        >
          Sign Up
        </Button>
      </View>

      <View className="flex-row justify-center mt-6">
        <Link href={"/auth"}>
          <Text className="">Already have an account? </Text>
          <Text className="ml-1">Login</Text>
        </Link>
      </View>
    </View>
  );
}
