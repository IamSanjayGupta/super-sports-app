import { EventCard } from "@/src/components/EventCard";
import { EventFilters, SortField } from "@/src/components/EventFilter";
import { useAppContext } from "@/src/context/AppContext";
import { EventType } from "@/src/enum/event.enum";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ActivityIndicator, FAB, Text } from "react-native-paper";

export default function EventListScreen() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<EventType | "all">("all");
  const [sortBy, setSortBy] = useState<{
    field: SortField;
    order: "asc" | "desc";
  }>({ field: "date", order: "asc" });
  const { joinEvent, isEventLoading, events, user } = useAppContext();

  const filteredEvents = useMemo(() => {
    let data = [...events];

    if (search.trim()) {
      data = data.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (search.trim()) {
      data = data.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (type !== "all") {
      data = data.filter((e) => e.eventType === type);
    }

    if (sortBy.field === "date") {
      data.sort((a, b) =>
        sortBy.order === "asc"
          ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          : new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      );
    }

    if (sortBy.field === "participants") {
      data.sort((a, b) =>
        sortBy.order === "asc"
          ? a.participants.length - b.participants.length
          : b.participants.length - a.participants.length,
      );
    }

    return data;
  }, [search, type, sortBy, events]);

  const myJoinedEvents = !user?.userId
    ? []
    : events.filter((event) => event.participants.includes(user.userId));

  return (
    <View className="flex-1 px-4 pt-4 ">
      <EventFilters
        selectedType={type}
        onTypeChange={setType}
        onSortChange={(field, order) => setSortBy({ field, order })}
        search={search}
        onSearchChange={setSearch}
      />

      {isEventLoading ? (
        <ActivityIndicator className="flex-1" animating={true} />
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              showJoinBtn
              onJoin={joinEvent}
              isAlreadyJoined={myJoinedEvents.includes(item)}
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-5">
              <Text className="text-lg">No events available</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push("/event/new")}
        // label="Create Event"
        animated
        // customSize={40}
        // variant=""
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});
