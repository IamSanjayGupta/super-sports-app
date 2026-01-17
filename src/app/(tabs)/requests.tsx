import PageTitle from "@/src/components/PageTitle";
import { useAppContext } from "@/src/context/AppContext";
import { EventRequest } from "@/src/interfaces/event.interface";
import { router } from "expo-router";
import { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Divider, Text } from "react-native-paper";

export default function Requests() {
  const { isLoggedIn, eventRequests, approveOrRejectRequest, events } =
    useAppContext();

  useEffect(() => {
    if (!isLoggedIn) {
      return router.replace("/auth");
    }
  }, [isLoggedIn]);

  const renderItem = ({ item }: { item: EventRequest }) => {
    const event = events.find((event) => event.id === item.eventId);

    return (
      <Card style={styles.card}>
        <Card.Title
          title={event?.title}
          subtitle={`Event: ${event?.description}`}
        />

        <Card.Content>
          <Text style={styles.timeText}>Requested {item.eventId}</Text>
        </Card.Content>

        <Divider />

        <Card.Actions style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => approveOrRejectRequest(item.id, "reject")}
            textColor="#D32F2F"
          >
            Reject
          </Button>
          <Button
            mode="contained"
            onPress={() => approveOrRejectRequest(item.id, "approve")}
          >
            Approve
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <PageTitle title="Requests" showBack />

      {eventRequests.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="titleMedium">No pending requests</Text>
          <Text style={styles.emptySub}>You’re all caught up 🎉</Text>
        </View>
      ) : (
        <FlatList
          data={eventRequests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
  },
  timeText: {
    marginTop: 4,
    color: "#6B7280",
  },
  actions: {
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptySub: {
    marginTop: 4,
    color: "#6B7280",
  },
});
