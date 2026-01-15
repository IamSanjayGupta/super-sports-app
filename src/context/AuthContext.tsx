import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import StorageUtil from "../utils/storage.util";

import { router } from "expo-router";
import { STORAGE_KEYS } from "../constants/storagekeys";
import { Session } from "../interfaces/session.interface";
import { User } from "../interfaces/user.interface";

interface AuthContextType {
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
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!user;

  useEffect(() => {
    (async () => {
      const session = await StorageUtil.load<Session>(STORAGE_KEYS.SESSION);
      setUser(session);
      setLoading(false);
      if (session) router.replace("/(tabs)");
    })();
  }, []);

  const signup = async (userBody: {
    fullname: string;
    username: string;
    password: string;
  }) => {
    const users = (await StorageUtil.load<User[]>(STORAGE_KEYS.USERS)) || [];

    userBody.username = userBody.username.trim();

    const exists = users.find((u) => u.username === userBody.username.trim());
    if (exists) {
      Alert.alert("User already exists");
      return;
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

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout, isLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
