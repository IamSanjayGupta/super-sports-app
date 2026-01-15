import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { EventType } from "../../enum/event.enum";

/* ------------------ Types ------------------ */

interface EventFormState {
  title: string;
  description: string;
  bannerUrl: string;
  eventType: EventType | null;
  startDate: Date | null;
  endDate: Date | null;
  maxParticipants: string;
  organizedBy: string;
}

type ActiveDateField = "startDate" | "endDate" | null;

/* ------------------ Initial State ------------------ */

const initialState: EventFormState = {
  title: "",
  description: "",
  bannerUrl: "",
  eventType: null,
  startDate: null,
  endDate: null,
  maxParticipants: "",
  organizedBy: "",
};

/* ------------------ Screen ------------------ */

export default function CreateEventScreen() {
  const theme = useTheme();

  const [form, setForm] = useState<EventFormState>(initialState);
  const [eventTypeVisible, setEventTypeVisible] = useState(false);

  const [activeDateField, setActiveDateField] = useState<ActiveDateField>(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  /* ------------------ Helpers ------------------ */

  const updateForm = <K extends keyof EventFormState>(
    key: K,
    value: EventFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const mergeDateAndTime = (
    date: Date,
    time: { hours: number; minutes: number },
  ) => {
    const merged = new Date(date);
    merged.setHours(time.hours);
    merged.setMinutes(time.minutes);
    merged.setSeconds(0);
    return merged;
  };

  const openDatePicker = (field: ActiveDateField) => {
    setActiveDateField(field);
    setDatePickerVisible(true);
  };

  const onConfirmDate = ({ date }: { date: Date }) => {
    setDatePickerVisible(false);
    updateForm(activeDateField!, date);
    setTimePickerVisible(true);
  };

  const onConfirmTime = (time: { hours: number; minutes: number }) => {
    if (!activeDateField) return;

    const baseDate = form[activeDateField] ?? new Date();
    const merged = mergeDateAndTime(baseDate, time);

    updateForm(activeDateField, merged);
    setTimePickerVisible(false);
    setActiveDateField(null);
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      maxParticipants: Number(form.maxParticipants),
      organizedBy: Number(form.organizedBy),
      participants: [],
    };

    console.log("CREATE EVENT PAYLOAD:", payload);
  };

  const isDisabled =
    !form.title ||
    !form.eventType ||
    !form.startDate ||
    !form.endDate ||
    !form.maxParticipants;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Card.Content>
          <Text style={styles.heading}>Create Event</Text>

          <TextInput
            label="Event Title"
            mode="outlined"
            value={form.title}
            onChangeText={(v) => updateForm("title", v)}
            style={styles.input}
          />

          <TextInput
            label="Description"
            mode="outlined"
            multiline
            numberOfLines={3}
            value={form.description}
            onChangeText={(v) => updateForm("description", v)}
            style={styles.input}
          />

          <TextInput
            label="Banner Image URL"
            mode="outlined"
            value={form.bannerUrl}
            onChangeText={(v) => updateForm("bannerUrl", v)}
            style={styles.input}
          />

          {/* -------- Event Type Select -------- */}
          <View style={styles.input}>
            <Pressable onPress={() => setEventTypeVisible(true)}>
              <View pointerEvents="none">
                <TextInput
                  label="Event Type"
                  mode="outlined"
                  value={form.eventType ? form.eventType.toUpperCase() : ""}
                  placeholder="Select event type"
                  editable={false}
                  right={<TextInput.Icon icon="chevron-down" />}
                />
              </View>
            </Pressable>

            <Portal>
              <Modal
                visible={eventTypeVisible}
                onDismiss={() => setEventTypeVisible(false)}
                contentContainerStyle={[
                  styles.bottomModal,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <Text style={styles.title}>Select Event Type</Text>

                {Object.values(EventType).map((type) => (
                  <Pressable
                    key={type}
                    onPress={() => {
                      updateForm("eventType", type);
                      setEventTypeVisible(false);
                    }}
                  >
                    <Text style={styles.item}>
                      {form.eventType === type ? "✓ " : ""}
                      {type.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </Modal>
            </Portal>
          </View>

          {/* -------- Event Time -------- */}

          {/* Start Date */}
          <Pressable
            style={styles.dateInputWrapper}
            onPress={() => openDatePicker("startDate")}
          >
            <View pointerEvents="none">
              <TextInput
                label="Start Date & Time"
                mode="outlined"
                value={form.startDate ? form.startDate.toLocaleString() : ""}
                placeholder="Select start date & time"
                editable={false}
                right={<TextInput.Icon icon="calendar-clock" />}
              />
            </View>
          </Pressable>

          {/* End Date */}
          <Pressable
            style={styles.dateInputWrapper}
            onPress={() => openDatePicker("endDate")}
          >
            <View pointerEvents="none">
              <TextInput
                label="End Date & Time"
                mode="outlined"
                value={form.endDate ? form.endDate.toLocaleString() : ""}
                placeholder="Select end date & time"
                editable={false}
                right={<TextInput.Icon icon="calendar-clock" />}
              />
            </View>
          </Pressable>

          <TextInput
            label="Max Participants"
            mode="outlined"
            keyboardType="numeric"
            value={form.maxParticipants}
            onChangeText={(v) => updateForm("maxParticipants", v)}
            style={styles.input}
          />
        </Card.Content>

        <Card.Actions>
          <Button mode="contained" onPress={handleSubmit} disabled={isDisabled}>
            Create Event
          </Button>
        </Card.Actions>
      </Card>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={datePickerVisible}
        date={
          activeDateField ? (form[activeDateField] ?? new Date()) : new Date()
        }
        onConfirm={({ date }) =>
          date && onConfirmDate({ date: new Date(date.toISOString()) })
        }
        onDismiss={() => setDatePickerVisible(false)}
      />

      <TimePickerModal
        visible={timePickerVisible}
        onDismiss={() => setTimePickerVisible(false)}
        onConfirm={onConfirmTime}
        hours={form[activeDateField!]?.getHours() ?? 12}
        minutes={form[activeDateField!]?.getMinutes() ?? 0}
      />
    </ScrollView>
  );
}

/* ------------------ Styles ------------------ */

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  dateBtn: {
    flex: 1,
  },
  bottomModal: {
    margin: 0,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  item: {
    fontSize: 16,
    paddingVertical: 14,
  },

  dateInputWrapper: {
    flex: 1,
    marginBottom: 12,
  },
});
