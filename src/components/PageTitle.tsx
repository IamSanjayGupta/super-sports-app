import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

export type PageTitleProps = {
  title: string;
  showBack?: boolean;
};

export default function PageTitle({ title, showBack }: PageTitleProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {showBack && (
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <IconButton icon="arrow-left" size={24} />
          {/* <MaterialIcons name="arrow-back" size={24} /> */}
        </TouchableOpacity>
      )}
      <Text style={styles.heading}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    padding: 0,
    marginLeft: -12,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
  },
});
