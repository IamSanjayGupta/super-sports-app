import { Redirect } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function Profile() {
  const isLoggedin = false;

  if (!isLoggedin) {
    return <Redirect href={{ pathname: "/auth" }} />;
  }

  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
}
