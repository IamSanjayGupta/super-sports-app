import { Image, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Text } from "react-native-paper";
import { Event } from "../interfaces/event.interface";

interface Props {
  event: Event;
  onViewEvent?: (event: Event) => void;
  showJoinBtn?: boolean;
  onJoin?: (event: Event) => Promise<void>;
  isAlreadyJoined?: boolean;
  onLeave?: (eventId: number) => Promise<void>;
}

export const formatDate = (
  date: Date | string,
  format?: Intl.DateTimeFormatOptions,
) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    ...format,
  };

  return new Date(date).toLocaleString("en-IN", options);
};

export function EventCard({
  event,
  showJoinBtn,
  onJoin,
  isAlreadyJoined,
  onLeave,
  onViewEvent,
}: Props) {
  const eventFull = event.participants.length >= event.maxParticipants;

  return (
    <Card className="mb-4" onPress={() => onViewEvent?.(event)}>
      <Image
        source={
          event.bannerUrl.trim()
            ? { uri: event.bannerUrl.trim() }
            : require("@/assets/images/large-logo.png")
        }
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

        <Text className="mt-2">{event.description}</Text>

        <View className="flex-row justify-between mt-3">
          <Text style={styles.metaText}>
            {formatDate(event.startDate)} -{" "}
            {formatDate(event.endDate, { year: "2-digit" })}
          </Text>

          <Text style={styles.metaText}>
            {event.participants.length}/{event.maxParticipants} joined
          </Text>
        </View>
      </Card.Content>

      <Card.Actions>
        {((showJoinBtn && !isAlreadyJoined) || !onLeave) && (
          <Button
            mode="contained"
            disabled={eventFull || isAlreadyJoined}
            onPress={() => onJoin?.(event)}
          >
            {isAlreadyJoined ? "Already Joined" : eventFull ? "Full" : "Join"}
          </Button>
        )}

        {isAlreadyJoined && new Date(event.endDate) > new Date() && onLeave && (
          <Button
            mode="contained-tonal"
            buttonColor="error"
            onPress={() => onLeave(event.id)}
          >
            Leave Event
          </Button>
        )}
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
  metaText: {
    fontSize: 12,
  },
});
