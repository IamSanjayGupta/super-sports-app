import { EventCard } from "@/src/components/EventCard";
import { EventFilters } from "@/src/components/EventFilter";
import { EventType } from "@/src/enum/event.enum";
import { EVENTS } from "@/src/interfaces/event.interface";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";

export default function EventListScreen() {
  const [type, setType] = useState<EventType | "all">("all");
  const [sortBy, setSortBy] = useState<"date" | "participants">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [search, setSearch] = useState("");

  console.log(sortBy, "sortBy", type, "type", search, "search");

  const filteredEvents = useMemo(() => {
    let data = [...EVENTS];

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

    if (sortBy === "date") {
      data.sort((a, b) =>
        sortOrder === "asc"
          ? a.startDate.getTime() - b.startDate.getTime()
          : b.startDate.getTime() - a.startDate.getTime(),
      );
    }

    if (sortBy === "participants") {
      data.sort((a, b) =>
        sortOrder === "asc"
          ? a.participants.length - b.participants.length
          : b.participants.length - a.participants.length,
      );
    }

    return data;
  }, [search, type, sortBy, sortOrder]);

  return (
    <View className="flex-1 px-4 pt-4 ">
      <EventFilters
        selectedType={type}
        onTypeChange={setType}
        onSortChange={setSortBy}
        search={search}
        onSearchChange={setSearch}
      />

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <EventCard event={item} />}
        showsVerticalScrollIndicator={false}
      />

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
