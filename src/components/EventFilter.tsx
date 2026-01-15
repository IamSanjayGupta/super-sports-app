import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Chip, IconButton, Text, TextInput } from "react-native-paper";
import Popover from "react-native-popover-view";
import { EventType } from "../enum/event.enum";

type SortField = "date" | "participants";
type SortOrder = "asc" | "desc";

interface Props {
  selectedType: EventType | "all";
  search: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (type: EventType | "all") => void;
  onSortChange: (field: SortField, order: SortOrder) => void;
}

export function EventFilters({
  selectedType,
  search,
  onSearchChange,
  onTypeChange,
  onSortChange,
}: Props) {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [selectedSortField, setSelectedSortField] = useState<SortField | null>(
    null,
  );

  const sortButtonRef = useRef<any>(null);

  const closePopover = () => {
    setPopoverVisible(false);
    setSelectedSortField(null);
  };

  return (
    <View style={styles.container}>
      {/* Search + Sort Row */}
      <View style={styles.searchRow}>
        <TextInput
          mode="outlined"
          placeholder="🔍 Search events"
          value={search}
          onChangeText={onSearchChange}
          style={styles.searchInput}
          dense
          keyboardType="web-search"
        />

        <TouchableOpacity
          ref={sortButtonRef}
          onPress={() => setPopoverVisible(true)}
        >
          <IconButton icon="sort" size={24} />
        </TouchableOpacity>

        {/* Sort Popover */}
        <Popover
          isVisible={popoverVisible}
          from={sortButtonRef}
          onRequestClose={closePopover}
          popoverStyle={styles.popover}
        >
          <View style={styles.popoverMenu}>
            {/* STEP 1: Choose field */}
            {selectedSortField === null && (
              <>
                <TouchableOpacity onPress={() => setSelectedSortField("date")}>
                  <Text style={styles.popoverItem}>Sort by Date</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSelectedSortField("participants")}
                >
                  <Text style={styles.popoverItem}>Sort by Participants</Text>
                </TouchableOpacity>
              </>
            )}

            {/* STEP 2: Choose order */}
            {selectedSortField !== null && (
              <>
                <Text style={styles.popoverTitle}>
                  {selectedSortField === "date" ? "Date" : "Participants"}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    onSortChange(selectedSortField, "asc");
                    closePopover();
                  }}
                >
                  <Text style={styles.popoverItem}>Ascending ↑</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    onSortChange(selectedSortField, "desc");
                    closePopover();
                  }}
                >
                  <Text style={styles.popoverItem}>Descending ↓</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Popover>
      </View>

      {/* Horizontal Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chipRow}>
          <Chip
            compact
            selected={selectedType === "all"}
            onPress={() => onTypeChange("all")}
            style={styles.chip}
          >
            All
          </Chip>

          {Object.values(EventType).map((type) => (
            <Chip
              key={type}
              compact
              selected={selectedType === type}
              onPress={() => onTypeChange(type)}
              style={styles.chip}
            >
              {type}
            </Chip>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    marginRight: 4,
  },
  chipRow: {
    flexDirection: "row",
    gap: 4,
  },
  chip: {
    marginRight: 4,
  },
  popover: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#000",
  },
  popoverMenu: {
    width: 180,
  },
  popoverTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  popoverItem: {
    paddingVertical: 10,
    fontSize: 16,
  },
});
