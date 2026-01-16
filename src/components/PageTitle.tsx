import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export type PageTitleProps = {
  title: string;
};
export default function PageTitle({ title }: PageTitleProps) {
  return <Text style={styles.heading}>{title}</Text>;
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "700",
    // textAlign: "center",
    marginBottom: 24,
  },
});
