import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Checkin, saveCheckin } from '../../utils/storage';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [note, setNote] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getCurrentLocationRef = useRef<(() => Promise<void>) | null>(null);

  const requestLocationPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Quyền bị từ chối', 'Cần quyền location để check-in.');
        return;
      }
      if (getCurrentLocationRef.current) {
        await getCurrentLocationRef.current();
      }
    } catch (error) {
      console.error('Lỗi request permission:', error);
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    try {
      const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation({ lat: coords.latitude, lng: coords.longitude });
    } catch (error) {
      Alert.alert('Lỗi lấy vị trí', 'Không thể lấy GPS. Vui lòng thử lại.');
      console.error('Lỗi get location:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  getCurrentLocationRef.current = getCurrentLocation;

  const handleCheckin = useCallback(async () => {
    if (!location || !note.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập note và lấy vị trí.');
      return;
    }

    const checkin: Checkin = {
      id: Date.now().toString(),
      lat: location.lat,
      lng: location.lng,
      note: note.trim(),
      time: new Date().toISOString(),
    };

    try {
      await saveCheckin(checkin);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setNote('');
      Keyboard.dismiss();
      Alert.alert('Thành công', 'Check-in đã lưu!');
      router.push('/(tabs)/map');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu check-in.');
      console.error('Lỗi handle checkin:', error);
    }
  }, [location, note, router]);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.innerContainer}>
        <View style={styles.header}>
          <Ionicons name="location-outline" size={32} color="#007AFF" />
          <Text style={styles.title}>Check-in Vị Trí</Text>
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Nhập note (ví dụ: 'Ăn trưa tại quán A')"
          value={note}
          onChangeText={setNote}
          onSubmitEditing={handleCheckin}
          placeholderTextColor="#A0A0A0"
        />

        <TouchableOpacity style={styles.button} onPress={getCurrentLocation} disabled={loading}>
          <Ionicons name={loading ? undefined : "navigate-circle-outline"} size={20} color="#fff" style={styles.icon} />
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Lấy Vị Trí GPS</Text>}
        </TouchableOpacity>

        {location && (
          <View style={styles.locationCard}>
            <Ionicons name="location" size={16} color="#34C759" />
            <Text style={styles.locationText}>
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.button, styles.checkinButton]} 
          onPress={handleCheckin} 
          disabled={!location || !note.trim()}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Check-in Ngay</Text>
        </TouchableOpacity>

        <View style={styles.navSection}>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/(tabs)/map')}>
            <Ionicons name="map-outline" size={20} color="#007AFF" />
            <Text style={styles.navText}>Xem Bản Đồ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/(tabs)/list')}>
            <Ionicons name="list-outline" size={20} color="#007AFF" />
            <Text style={styles.navText}>Xem Danh Sách</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  innerContainer: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '700', color: '#1A1A1A', marginTop: 8 },
  input: { 
    borderWidth: 1.5, 
    borderColor: '#E0E0E0', 
    padding: 16, 
    marginBottom: 16, 
    borderRadius: 12, 
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#007AFF', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkinButton: { backgroundColor: '#34C759', shadowColor: '#34C759' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16, marginLeft: 8 },
  icon: { marginRight: 8 },
  locationCard: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  locationText: { marginLeft: 8, color: '#666', fontSize: 14 },
  navSection: { alignItems: 'center' },
  navButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  navText: { marginLeft: 8, color: '#007AFF', fontSize: 16, fontWeight: '500' },
});