import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0f172a' },
          headerTintColor: '#f8fafc',
          contentStyle: { backgroundColor: '#f5f7f2' },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
        <Stack.Screen name="create-dono" options={{ title: 'Cadastrar Dono' }} />
        <Stack.Screen name="create-pet" options={{ title: 'Cadastrar Pet' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
