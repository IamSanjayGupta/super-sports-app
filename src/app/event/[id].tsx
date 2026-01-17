import PageTitle from "@/src/components/PageTitle";
import { useAppContext } from "@/src/context/AppContext";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { Avatar, Button, Card, Chip, Divider, Text } from "react-native-paper";

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, users, session, joinEvent, createRequest, leaveEvent } =
    useAppContext();

  const event = events.find((e) => e.id === Number(id));

  if (!event) {
    return <Text style={{ padding: 16 }}>Event not found</Text>;
  }

  const organizer = users.find((u) => u.id === event.organizedBy);

  const participants = event.participants
    .map((userId) => users.find((u) => u.id === userId))
    .filter(Boolean);

  const eventFull = event.participants.length >= event.maxParticipants;
  const isAlreadyJoined = session
    ? event.participants.includes(session.userId)
    : false;

  return (
    <ScrollView className="p-4">
      <PageTitle title={event.title} showBack />

      <View className="flex-row flex-wrap gap-2 my-2">
        <Chip icon="tag">{event.eventType.toUpperCase()}</Chip>
        <Chip icon="account-group">
          {event.participants.length}/{event.maxParticipants} Joined
        </Chip>
      </View>

      <Card className="mt-3">
        <Card.Content>
          <Text variant="titleMedium">Event Details</Text>

          <Text className="mt-2">{event.description}</Text>

          <Divider className="my-3" />

          <Text className="my-2">Timing</Text>
          <Text variant="bodySmall" className="text-gray-600">
            {new Date(event.startDate).toLocaleString()} –{" "}
            {new Date(event.endDate).toLocaleString()}
          </Text>
        </Card.Content>

        <Card.Actions>
          {/* Show Join button if: user logged in, showJoinBtn enabled, and not already joined */}
          {session && !isAlreadyJoined && (
            <Button
              mode="contained"
              disabled={eventFull}
              onPress={() => createRequest?.(event.id)}
            >
              {eventFull ? "Full" : "Join"}
            </Button>
          )}

          {/* Show Leave button if: user logged in, already joined, event not ended */}
          {session &&
            isAlreadyJoined &&
            new Date(event.endDate) > new Date() &&
            leaveEvent && (
              <Button
                mode="contained-tonal"
                buttonColor="error"
                onPress={() => leaveEvent(event.id)}
              >
                Leave Event
              </Button>
            )}

          {!session && (
            <Button
              mode="contained"
              onPress={() => alert("Please login to join the event")}
            >
              Join
            </Button>
          )}
        </Card.Actions>
      </Card>

      {/* Organizer */}
      <Text variant="titleMedium" className="mt-6 mb-2">
        Organizer
      </Text>

      <Card className="mb-2">
        <Card.Content className="flex-row items-center">
          <Avatar.Text
            size={42}
            label={organizer?.fullname[0]?.toUpperCase() || "O"}
          />
          <View className="ml-3">
            <Text variant="bodyLarge">
              {organizer?.fullname || "Unknown"}
              {session?.userId === event.organizedBy && "(You)"}
            </Text>
            <Text variant="bodySmall" className="text-gray-500">
              Organizer
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Participants */}
      <Text variant="titleMedium" className="mt-6 mb-2">
        Participants
      </Text>

      {participants.length === 0 ? (
        <Card className="mt-2">
          <Card.Content>
            <Text className="text-center text-gray-500">
              No participants joined yet
            </Text>
          </Card.Content>
        </Card>
      ) : (
        participants?.map((user) => (
          <Card key={user!.id} className="mb-2">
            <Card.Content className="flex-row items-center">
              <Avatar.Text size={42} label={user!.fullname[0].toUpperCase()} />
              <View className="ml-3">
                <Text variant="bodyLarge">
                  {user!.fullname}
                  {session?.userId === user?.id && "(You)"}
                </Text>
                <Text variant="bodySmall" className="text-gray-500">
                  Participant
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
}
