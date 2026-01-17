import PageTitle from "@/src/components/PageTitle";
import { useAppContext } from "@/src/context/AppContext";
import { Link, router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Divider, List, Text } from "react-native-paper";

export default function Profile() {
  const { isLoggedIn, session, logout } = useAppContext();

  return (
    <View style={styles.container}>
      <PageTitle title="Profile" showBack />

      {isLoggedIn ? (
        <>
          {/* Profile Card */}
          <Card style={styles.profileCard}>
            <Card.Content style={styles.profileContent}>
              <Avatar.Icon size={72} icon="account" style={styles.avatar} />

              <View style={styles.userInfo}>
                <Text style={styles.username}>
                  {session?.username || "User"}
                </Text>
                <Text style={styles.subText}>Logged in user</Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.actionsCard}>
            <List.Item
              title="My Joined Events"
              left={(props) => <List.Icon {...props} icon="calendar-check" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                router.push("/event/myevent");
              }}
            />

            {/* <List.Item
              title="My Requests"
              left={(props) => <List.Icon {...props} icon="calendar-check" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                router.push("/event/myevent");
              }}
            /> */}

            <Divider />

            <List.Item
              title="Logout"
              titleStyle={styles.logoutText}
              left={(props) => <List.Icon {...props} icon="logout" />}
              onPress={logout}
            />
          </Card>
        </>
      ) : (
        <Card style={styles.guestCard}>
          <Card.Content>
            <Avatar.Icon
              size={64}
              icon="account-outline"
              style={styles.avatar}
            />

            <Text style={styles.guestTitle}>You’re not logged in</Text>

            <Text style={styles.subText}>
              Login to view your profile and applied events
            </Text>

            <Link href="/auth" asChild>
              <Button mode="contained" style={styles.loginBtn}>
                Login Now
              </Button>
            </Link>
          </Card.Content>
        </Card>
      )}
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  profileCard: {
    marginBottom: 16,
  },

  profileContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    marginLeft: "auto",
    marginRight: "auto",
  },

  userInfo: {
    flex: 1,
    marginLeft: 16,
  },

  username: {
    fontSize: 18,
    fontWeight: "700",
  },

  subText: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },

  actionsCard: {
    overflow: "hidden",
  },

  logoutText: {
    // color: "red",
  },

  guestCard: {
    alignItems: "center",
    paddingVertical: 24,
  },

  guestTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    textAlign: "center",
  },

  loginBtn: {
    marginTop: 16,
  },
});
