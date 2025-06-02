import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import ListScreen from './src/screens/ListScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from './src/types';
import { LightTheme, DarkTheme } from './src/theme/theme';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme'); // 🟩 Přidáno: Načítání uloženého tématu
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      } else {
        const systemTheme = Appearance.getColorScheme(); // 🟩 Přidáno: Načítání systémového tématu
        setTheme(systemTheme === 'dark' ? 'dark' : 'light');
      }
    };

    loadTheme();
  }, []);

  const navigationTheme = theme === 'dark' ? NavigationDarkTheme : DefaultTheme;
  const appTheme = theme === 'dark' ? DarkTheme : LightTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: appTheme.colors.background },
        headerTintColor: appTheme.colors.text,
      }}>
        <Stack.Screen
          name="Home"
          component={(props: StackScreenProps<RootStackParamList, 'Home'>) =>
            <HomeScreen {...props} theme={theme} />}
          options={{ title: 'EzShop' }}
        />
        <Stack.Screen
          name="List"
          component={(props: StackScreenProps<RootStackParamList, 'List'>) =>
            <ListScreen {...props} theme={theme} />}
          options={({ route }) => ({ title: route?.params?.listName || 'Detail of the List' })}
        />
        <Stack.Screen
          name="Settings"
          component={(props: StackScreenProps<RootStackParamList, 'Settings'>) =>
            <SettingsScreen {...props} currentTheme={theme} setTheme={setTheme} />}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
