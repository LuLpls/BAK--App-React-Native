import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import ListScreen from './src/screens/ListScreen';
import NewListScreen from './src/screens/NewListScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { RootStackParamList } from './src/types';

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen
          name='Home'
          component={HomeScreen}
          options={{ title: 'EzShop'}}
        />
        <Stack.Screen
          name='List'
          component={ListScreen}
          options={({ route }) => ({ title: route?.params?.listName || 'Detail of the List' })} 
        />
        <Stack.Screen
          name='NewList'
          component={NewListScreen}
          options={{ title: 'Add New List'}}
        />
        <Stack.Screen
          name='Settings'
          component={SettingsScreen}
          options={{ title: 'Settings'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
