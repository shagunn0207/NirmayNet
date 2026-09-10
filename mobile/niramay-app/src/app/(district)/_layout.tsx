import { Tabs } from 'expo-router';
export default function DistrictLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="queue" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
