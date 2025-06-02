import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type SettingsScreenProps = StackScreenProps<RootStackParamList, 'Settings'> & {
  currentTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation: _navigation, currentTheme, setTheme }) => {
  const toggleTheme = async () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'flex-start',
      backgroundColor: currentTheme === 'dark' ? '#2c2c2c' : '#f5f5f5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: currentTheme === 'dark' ? '#ffffff' : '#000000',
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    },
    label: {
      fontSize: 18,
      color: currentTheme === 'dark' ? '#ffffff' : '#000000',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch
          value={currentTheme === 'dark'}
          onValueChange={toggleTheme}
        />
      </View>
    </View>
  );
};

export default SettingsScreen;
