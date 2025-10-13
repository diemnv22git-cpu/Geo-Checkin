import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Checkin, loadCheckins, deleteCheckin } from '../../utils/storage';
import { useFocusEffect } from 'expo-router';

export default function ListScreen() {
  const insets = useSafeAreaInsets();
  const [checkins, setCheckins] = useState<Checkin[]>([]);

  const loadData = useCallback(async () => {
    try {
      const data = await loadCheckins();
      setCheckins(data);
    } catch (error) {
      console.error('Lỗi load data list:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData().catch(console.error);
    }, [loadData])
  );

  const handleDelete = useCallback((id: string) => {
    Alert.alert('Xóa?', 'Bạn có chắc muốn xóa check-in này?', [
      { text: 'Hủy' },
      {
        text: 'Xóa',
        onPress: async () => {
          try {
            const updated = await deleteCheckin(id);
            setCheckins(updated);
          } catch (error) {
            Alert.alert('Lỗi', 'Không thể xóa check-in.');
            console.error('Lỗi delete:', error);
          }
        },
      },
    ]);
  }, []);

  const openMaps = useCallback((lat: number, lng: number) => {
    const url = Platform.OS === 'ios' ? `maps:0,0?q=${lat},${lng}` : `geo:0,0?q=${lat},${lng}`;
    Linking.openURL(url).catch((error) => {
      Alert.alert('Lỗi', 'Không thể mở maps.');
      console.error('Lỗi open maps:', error);
    });
  }, []);

  const renderItem = useCallback(({ item }: { item: Checkin }) => (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Ionicons name="location" size={20} color="#34C759" />
        <Text style={styles.note}>{item.note}</Text>
      </View>
      <Text style={styles.time}>{new Date(item.time).toLocaleString('vi-VN')}</Text>
      <View style={styles.divider} />
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => openMaps(item.lat, item.lng)} style={[styles.actionButton, styles.mapButton]}>
          <Ionicons name="map-outline" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Mở Maps</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.actionButton, styles.deleteButton]}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          <Text style={[styles.actionText, styles.deleteText]}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [openMaps, handleDelete]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh Sách Check-in</Text>
        <Text style={styles.headerSubtitle}>({checkins.length} mục)</Text>
      </View>
      <FlatList
        data={checkins}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onRefresh={loadData}
        refreshing={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#1A1A1A' },
  headerSubtitle: { fontSize: 16, color: '#666', marginTop: 4 },
  list: { flex: 1 },
  listContent: { padding: 16 },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  itemHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  note: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', marginLeft: 12 },
  time: { color: '#888', fontSize: 14, marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 12 },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  mapButton: { backgroundColor: 'rgba(0, 122, 255, 0.1)' },
  deleteButton: { backgroundColor: 'rgba(255, 59, 48, 0.1)' },
  actionText: { marginLeft: 8, fontSize: 14, fontWeight: '500' },
  deleteText: { color: '#FF3B30' },
});