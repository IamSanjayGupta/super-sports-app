import PageTitle from "@/src/components/PageTitle";
import { useAppContext } from "@/src/context/AppContext";
import { EventRequest } from "@/src/interfaces/event.interface";
import { router } from "expo-router";
import { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Divider, Text } from "react-native-paper";

export default function Requests() {
  const {
    isLoggedIn,
    session,
    eventRequests,
    approveOrRejectRequest,
    events,
    users,
  } = useAppContext();

  useEffect(() => {
    if (!isLoggedIn) {
      return router.replace("/auth");
    }
  }, [isLoggedIn]);

  const eventRequestReceivedToMe = eventRequests
    .map((eventReq) => {
      const event = events.find((event) => event.id === eventReq.eventId);
      return event ? { ...eventReq, event } : undefined;
    })
    .filter(
      (req) => req?.event && req.event.organizedBy === session?.userId,
    ) as EventRequest[];

  const renderItem = ({ item }: { item: EventRequest }) => {
    const event = item.event!;

    const requestedBy = users.find((user) => user.id === item.requesterId);

    return (
      <Card
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/event/[id]",
            params: { id: event.id },
          })
        }
      >
        <Card.Title
          title={event?.title}
          subtitle={`Event: ${event?.description}`}
        />

        <Card.Content>
          <Text style={styles.timeText}>
            Requested By: {requestedBy?.fullname ?? "Unknown"}
          </Text>
        </Card.Content>

        <Divider />

        <Card.Actions style={styles.actions}>
          {item.status === "pending" ? (
            <View className="flex-row gap-3">
              <Button
                mode="outlined"
                onPress={() => approveOrRejectRequest(item.id, "reject")}
                textColor="red"
              >
                Reject
              </Button>
              <Button
                mode="contained"
                onPress={() => approveOrRejectRequest(item.id, "approve")}
              >
                Approve
              </Button>
            </View>
          ) : (
            <Chip>{item.status.toUpperCase()}</Chip>
          )}
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <PageTitle title="Requests" showBack />

      {eventRequestReceivedToMe.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="titleMedium">No Requests</Text>
          <Text style={styles.emptySub}>You’re all caught up 🎉</Text>
        </View>
      ) : (
        <FlatList
          data={eventRequestReceivedToMe}
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
    marginBottom: 8,
    color: "#7a7c81",
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
