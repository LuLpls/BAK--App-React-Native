import React, { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import ListScreen from './src/screens/ListScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { RootStackParamList } from './src/types';

const appStartTime = performance.now(); // performance test starting

const Stack = createStackNavigator<RootStackParamList>();

const MyLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f5f5f5',
    card: '#f5f5f5',
    text: '#000000',
  },
};

const MyDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#121212',
    card: '#121212',
    text: '#ffffff',
  },
};

const App = () => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(systemColorScheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      } else {
        setTheme(systemColorScheme === 'dark' ? 'dark' : 'light');
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  return (
    <NavigationContainer
      theme={theme === 'dark' ? MyDarkTheme : MyLightTheme}
      onReady={() => {
        const appReadyTime = performance.now(); // performance test ending
        console.log(`App start time: ${appReadyTime - appStartTime} ms`);
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} theme={theme} />}
        </Stack.Screen>
        <Stack.Screen name="List">
          {(props) => <ListScreen {...props} theme={theme} />}
        </Stack.Screen>
        <Stack.Screen name="Settings">
          {(props) => <SettingsScreen {...props} currentTheme={theme} setTheme={setTheme} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
