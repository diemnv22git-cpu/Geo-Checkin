import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ModalScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Modal Check-in</Text>
      <Text style={styles.subtitle}>Sử dụng modal cho confirm check-in nếu cần</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  title: { fontSize: 24, fontWeight: '700', color: '#1A1A1A' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8, textAlign: 'center' },
});