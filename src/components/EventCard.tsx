import { Image, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Text } from "react-native-paper";
import { Event } from "../interfaces/event.interface";

interface Props {
  event: Event;
}

export function EventCard({ event }: Props) {
  const eventFull = event.participants.length >= event.maxParticipants;

  return (
    <Card className="mb-4">
      <Image
        source={{ uri: event.bannerUrl }}
        className="h-40 w-full rounded-t-xl"
        resizeMode="cover"
      />

      <Card.Content>
        <View className="flex-row justify-between items-center mt-3">
          <Text style={styles.title} numberOfLines={1}>
            {event.title}
          </Text>

          <Chip compact>{event.eventType.toUpperCase()}</Chip>
        </View>

        <Text style={styles.description}>{event.description}</Text>

        <View className="flex-row justify-between mt-3">
          <Text style={styles.metaText}>{event.startDate.toDateString()}</Text>

          <Text style={styles.metaText}>
            {event.participants.length}/{event.maxParticipants} joined
          </Text>
        </View>
      </Card.Content>

      <Card.Actions>
        <Button mode="contained" disabled={eventFull}>
          {eventFull ? "Full" : "Join"}
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  description: {
    marginTop: 8,
    color: "#dddddd",
  },
  metaText: {
    fontSize: 12,
    color: "#dddddd",
  },
});
