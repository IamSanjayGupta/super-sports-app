import AsyncStorage from "@react-native-async-storage/async-storage";

export default class StorageUtil {
  static async save<T>(key: string, value: T) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Save error", e);
    }
  }

  static async load<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error("Load error", e);
      return null;
    }
  }

  static async remove(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error("Remove error", e);
    }
  }
}
