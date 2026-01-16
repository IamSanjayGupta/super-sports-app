import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";
import StorageUtil from "../utils/storage.util";

import { router } from "expo-router";
import { STORAGE_KEYS } from "../constants/storagekeys";
import { Event, ICreateEvent } from "../interfaces/event.interface";
import { Session } from "../interfaces/session.interface";
import { User } from "../interfaces/user.interface";

interface AppContextType {
  session: Session | null;
  users: User[];
  isLoggedIn: boolean;
  loading: boolean;
  signup: (userBody: {
    fullname: string;
    username: string;
    password: string;
  }) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  events: Event[];
  isEventLoading: boolean;
  loadEvents: () => Promise<void>;
  joinEvent: (event: Event) => Promise<void>;
  leaveEvent: (eventId: number) => Promise<void>;
  createEvent: (eventBody: ICreateEvent) => Promise<void>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEventLoading, setEventLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const isLoggedIn = !!session;

  const loadEvents = useCallback(async () => {
    try {
      setEventLoading(true);
      const events =
        (await StorageUtil.load<Event[]>(STORAGE_KEYS.EVENTS)) || [];
      setEvents(events);
    } catch (error) {
      console.log("Unable to load events", error);
    } finally {
      setEventLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const users = (await StorageUtil.load<User[]>(STORAGE_KEYS.USERS)) || [];
      setUsers(users);
    } catch (error) {
      console.log("Unable to load users", error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const session = await StorageUtil.load<Session>(STORAGE_KEYS.SESSION);

      setSession(session);
      setLoading(false);

      if (session) router.replace("/(tabs)");
    })();
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const signup = async (userBody: {
    fullname: string;
    username: string;
    password: string;
  }) => {
    const users = (await StorageUtil.load<User[]>(STORAGE_KEYS.USERS)) || [];

    userBody.username = userBody.username.trim();

    const exists = users.find((u) => u.username === userBody.username.trim());
    if (exists) {
      return Alert.alert("User already exists");
    }

    const newUser: User = { id: Date.now(), ...userBody };

    await StorageUtil.save(STORAGE_KEYS.USERS, [...users, newUser]);

    await login(userBody.username, userBody.password);
  };

  const login = async (username: string, password: string) => {
    const users = (await StorageUtil.load<User[]>(STORAGE_KEYS.USERS)) || [];

    const user = users.find((u) => u.username === username.trim());
    if (!user) return Alert.alert("Invalid username");
    if (user.password !== password) return Alert.alert("Invalid password");

    const session: Session = { userId: user.id, username: user.username };

    await StorageUtil.save(STORAGE_KEYS.SESSION, session);

    setSession(session);

    return router.replace("/(tabs)");
  };

  const logout = async () => {
    await StorageUtil.remove(STORAGE_KEYS.SESSION);
    setSession(null);
  };

  const joinEvent = useCallback(
    async (event: Event) => {
      if (!session?.userId)
        return Alert.alert("Please login to join the event.");

      const eventIndexToJoin = events.findIndex((e) => e.id === event.id);
      if (eventIndexToJoin === -1)
        return Alert.alert("No event found. Please refresh the page and try.");

      const eventToJoin = events[eventIndexToJoin];
      if (eventToJoin.participants.includes(session.userId))
        return Alert.alert("You have already joined this event");

      events[eventIndexToJoin].participants.push(session.userId);

      setEvents([...events]);
      // update local storage
      await StorageUtil.save(STORAGE_KEYS.EVENTS, events);
      return Alert.alert("You have successfully joined the event.");
    },
    [events, session?.userId],
  );

  const createEvent = useCallback(
    async (eventBody: ICreateEvent) => {
      if (!session?.userId)
        return Alert.alert("Please login to create an event.");

      const newEvent: Event = {
        ...eventBody,
        id: Date.now(),
        organizedBy: session.userId,
      };

      try {
        await StorageUtil.save(STORAGE_KEYS.EVENTS, [...events, newEvent]);
        await loadEvents();
        return Alert.alert("Event created successfully.");
      } catch (error) {
        console.log("Unable to create event", error);
      }
    },
    [events, loadEvents, session?.userId],
  );

  const leaveEvent = useCallback(
    async (eventId: number) => {
      if (!session?.userId)
        return Alert.alert("Please login to leave the event.");

      const eventIndexToLeave = events.findIndex((e) => e.id === eventId);

      if (eventIndexToLeave === -1)
        return Alert.alert("No event found. Please refresh the page and try.");

      const eventToLeave = events[eventIndexToLeave];
      if (!eventToLeave.participants.includes(session.userId))
        return Alert.alert("You have not joined this event");

      if (eventToLeave.startDate < new Date())
        return Alert.alert(
          "You cannot leave an event that has already started.",
        );

      events[eventIndexToLeave].participants = events[
        eventIndexToLeave
      ].participants.filter((p) => p !== session.userId);

      await StorageUtil.save(STORAGE_KEYS.EVENTS, events);
      await loadEvents();
      return Alert.alert("You have successfully left the event.");
    },

    [events, loadEvents, session?.userId],
  );

  return (
    <AppContext.Provider
      value={{
        session,
        loading,
        signup,
        login,
        logout,
        isLoggedIn,
        events,
        isEventLoading,
        loadEvents,
        joinEvent,
        createEvent,
        leaveEvent,
        users,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
