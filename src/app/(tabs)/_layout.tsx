import { useAppContext } from "@/src/context/AppContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { BottomNavigation } from "react-native-paper";

export default function TabLayout() {
  const { isLoggedIn } = useAppContext();

  return (
    <Tabs
      key={isLoggedIn ? "logged-in" : "logged-out"}
      screenOptions={{ headerShown: false }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.navigate(route.name);
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            return options.tabBarIcon?.({ focused, color, size: 26 }) ?? null;
          }}
          getLabelText={({ route }) =>
            descriptors[route.key].options.title ?? route.name
          }
        />
      )}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="emoji-events" size={26} color={color} />
          ),
        }}
      />

      <Tabs.Protected guard={isLoggedIn}>
        <Tabs.Screen
          name="requests"
          options={{
            tabBarLabel: "Private",
            title: "Requests",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="pending-actions" size={26} color={color} />
            ),
          }}
        />
      </Tabs.Protected>

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-circle" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
