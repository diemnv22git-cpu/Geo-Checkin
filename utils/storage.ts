import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Checkin {
  id: string;
  lat: number;
  lng: number;
  note: string;
  time: string;
}

const STORAGE_KEY = 'checkins';

export const saveCheckin = async (checkin: Checkin): Promise<Checkin[]> => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const checkins: Checkin[] = existing ? JSON.parse(existing) : [];
    checkins.unshift(checkin);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(checkins));
    return checkins;
  } catch (error) {
    console.error('Lỗi lưu check-in:', error);
    throw error;
  }
};

export const loadCheckins = async (): Promise<Checkin[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Lỗi load check-ins:', error);
    return [];
  }
};

export const deleteCheckin = async (id: string): Promise<Checkin[]> => {
  try {
    const checkins = await loadCheckins();
    const filtered = checkins.filter((item) => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Lỗi xóa check-in:', error);
    throw error;
  }
};