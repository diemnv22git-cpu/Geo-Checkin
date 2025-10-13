import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF', headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Check-in',
            tabBarIcon: ({ color, size }) => <Ionicons name="location" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Bản đồ',
            tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="list"
          options={{
            title: 'Danh sách',
            tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}