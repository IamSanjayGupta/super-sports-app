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
  user: Session | null;
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
  createEvent: (eventBody: ICreateEvent) => Promise<void>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEventLoading, setEventLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const isLoggedIn = !!user;

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

  useEffect(() => {
    (async () => {
      const session = await StorageUtil.load<Session>(STORAGE_KEYS.SESSION);
      await loadEvents();
      setUser(session);
      setLoading(false);

      if (session) router.replace("/(tabs)");
    })();
  }, [loadEvents]);

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

    setUser(session);

    return router.replace("/(tabs)");
  };

  const logout = async () => {
    await StorageUtil.remove(STORAGE_KEYS.SESSION);
    setUser(null);
  };

  const joinEvent = useCallback(
    async (event: Event) => {
      if (!user?.userId) return Alert.alert("Please login to join the event.");

      const eventIndexToJoin = events.findIndex((e) => e.id === event.id);
      if (eventIndexToJoin === -1)
        return Alert.alert("No event found. Please refresh the page and try.");

      const eventToJoin = events[eventIndexToJoin];
      if (eventToJoin.participants.includes(user.userId))
        return Alert.alert("You have already joined this event");

      events[eventIndexToJoin].participants.push(user.userId);

      setEvents([...events]);
      // update local storage
      await StorageUtil.save(STORAGE_KEYS.EVENTS, events);
      return Alert.alert("You have successfully joined the event.");
    },
    [events, user?.userId],
  );

  const createEvent = useCallback(
    async (eventBody: ICreateEvent) => {
      if (!user?.userId) return Alert.alert("Please login to create an event.");

      const newEvent: Event = {
        ...eventBody,
        id: Date.now(),
        organizedBy: user.userId,
      };

      try {
        await StorageUtil.save(STORAGE_KEYS.EVENTS, [...events, newEvent]);
        await loadEvents();
        return Alert.alert("Event created successfully.");
      } catch (error) {
        console.log("Unable to create event", error);
      }
    },
    [events, loadEvents, user?.userId],
  );

  console.log(events);
  return (
    <AppContext.Provider
      value={{
        user,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
