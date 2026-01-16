import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import merge from "deepmerge";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";
import { Colors } from "../constants/theme";

import { enGB, registerTranslation } from "react-native-paper-dates";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import { AppProvider } from "../context/AppContext";

registerTranslation("en", enGB);

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedLightTheme = merge(LightTheme, {
  ...MD3LightTheme,
  colors: Colors.light,
  roundness: 4,
});

const CombinedDarkTheme = merge(DarkTheme, {
  ...MD3DarkTheme,
  colors: Colors.dark,
  roundness: 4,
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const paperTheme =
    colorScheme === "dark" ? CombinedDarkTheme : CombinedLightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <ThemeProvider value={paperTheme}>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: paperTheme.colors.background,
            }}
          >
            <AppProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="auth" />
              </Stack>
            </AppProvider>
          </SafeAreaView>
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
