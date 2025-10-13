import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, Text, TextInput, View, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Checkin, loadCheckins } from '../../utils/storage';

const DEFAULT_REGION = {
  latitude: 21.0285,
  longitude: 105.8542,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await loadCheckins();
      setCheckins(data);

      if (data.length > 0) {
        const avgLat = data.reduce((sum, item) => sum + item.lat, 0) / data.length;
        const avgLng = data.reduce((sum, item) => sum + item.lng, 0) / data.length;
        setRegion({ ...DEFAULT_REGION, latitude: avgLat, longitude: avgLng });
      }
      console.log('Loaded checkins for map:', data.length);
    } catch (error) {
      console.error('Lỗi load data map:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData().catch(console.error);
    }, [loadData])
  );

  const handleRefresh = useCallback(() => {
    loadData().catch(console.error);
  }, [loadData]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChange={setRegion}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined} // Fix: Provider cho Android
        showsUserLocation
        showsMyLocationButton
        onMapReady={() => console.log('Map ready!')}
      >
        {checkins.map((item) => (
          <Marker
            key={item.id}
            coordinate={{ latitude: item.lat, longitude: item.lng }}
            title={item.note}
            description={new Date(item.time).toLocaleString()}
            pinColor="green"
          />
        ))}
      </MapView>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#A0A0A0" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm địa điểm..."
          placeholderTextColor="#A0A0A0"
        />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Check-ins ({checkins.length})</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh} disabled={refreshing}>
          <Ionicons name="refresh-outline" size={20} color="#007AFF" />
          <Text style={styles.refreshText}>
            {refreshing ? 'Đang tải...' : 'Làm mới'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchBar: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1A1A1A',
  },
  infoCard: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  infoTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  refreshText: { marginLeft: 8, color: '#007AFF', fontWeight: '500', fontSize: 14 },
});