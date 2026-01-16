import { EventCard } from "@/src/components/EventCard";
import PageTitle from "@/src/components/PageTitle";
import { useAppContext } from "@/src/context/AppContext";
import { router } from "expo-router";
import { useMemo } from "react";
import { FlatList, View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function MyEvents() {
  const { session: user, events, leaveEvent } = useAppContext();

  const myEvents = useMemo(() => {
    return events.filter((event) => event.participants.includes(user!.userId));
  }, [events, user]);

  return (
    <View className="flex-1 p-4">
      <PageTitle title="My Events" />

      <FlatList
        data={myEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            isAlreadyJoined
            onLeave={leaveEvent}
            onViewEvent={(event) =>
              router.push({
                pathname: "/event/[id]",
                params: { id: event.id },
              })
            }
          />
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg font-bold mb-5">No events available</Text>
            <Button mode="text" onPress={() => router.push("/(tabs)")}>
              Back to home
            </Button>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
