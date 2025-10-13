import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router'; // Fix: Import Link từ expo-router
import { Ionicons } from '@expo/vector-icons';

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
      <Text style={styles.title}>Unmatched Route</Text>
      <Text style={styles.subtitle}>Page could not be found</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Go to Home</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F8F9FA' },
  title: { fontSize: 24, fontWeight: '700', color: '#1A1A1A', marginTop: 16 },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8, textAlign: 'center' },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, marginTop: 24 },
  buttonText: { color: '#fff', fontWeight: '600' },
  link: { marginTop: 12 },
  linkText: { color: '#007AFF', fontSize: 16 },
});