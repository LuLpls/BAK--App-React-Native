import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import i18n from '../localization';
import { Menu, Provider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsScreenProps = StackScreenProps<RootStackParamList, 'Settings'> & {
  currentTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation: _navigation, currentTheme, setTheme }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.locale);
  const [menuVisible, setMenuVisible] = useState(false);
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>(currentTheme);

  const toggleTheme = async () => {
    const start = performance.now(); // performance test starting

    const newTheme = localTheme === 'light' ? 'dark' : 'light';
    setLocalTheme(newTheme);
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);

    const end = performance.now(); // performance test ending
    console.log(`Theme switch time: ${end - start} ms`);
  };

  const changeLanguage = async (language: string) => {
    const start = performance.now(); // performance test starting

    i18n.locale = language;
    setSelectedLanguage(language);
    setMenuVisible(false);
    await AsyncStorage.setItem('selectedLanguage', language);

    const end = performance.now(); // performance test ending
    console.log(`Language switch time: ${end - start} ms`);
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case 'en':
        return 'English';
      case 'cs':
        return 'Čeština';
      default:
        return lang;
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      const savedTheme = await AsyncStorage.getItem('theme');

      if (savedLanguage) {
        i18n.locale = savedLanguage;
        setSelectedLanguage(savedLanguage);
      }

      if (savedTheme === 'light' || savedTheme === 'dark') {
        setLocalTheme(savedTheme);
        setTheme(savedTheme);
      }
    };
    loadSettings();
  }, [setTheme]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'flex-start',
      backgroundColor: localTheme === 'dark' ? '#2c2c2c' : '#f5f5f5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: localTheme === 'dark' ? '#ffffff' : '#000000',
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    },
    label: {
      fontSize: 18,
      color: localTheme === 'dark' ? '#ffffff' : '#000000',
    },
    menuButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: localTheme === 'dark' ? '#1e1e1e' : '#e0e0e0',
      borderRadius: 5,
    },
    menuButtonText: {
      fontSize: 16,
      color: localTheme === 'dark' ? '#ffffff' : '#000000',
    },
  });

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>{i18n.t('settings.title')}</Text>

        <View style={styles.settingRow}>
          <Text style={styles.label}>{i18n.t('settings.darkMode')}</Text>
          <Switch
            value={localTheme === 'dark'}
            onValueChange={toggleTheme}
          />
        </View>

        <View style={{ marginTop: 30 }}>
          <Text style={styles.label}>{i18n.t('settings.language')}</Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
                <Text style={styles.menuButtonText}>
                  {getLanguageLabel(selectedLanguage)}
                </Text>
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={() => changeLanguage('en')} title="English" />
            <Menu.Item onPress={() => changeLanguage('cs')} title="Čeština" />
          </Menu>
        </View>
      </View>
    </Provider>
  );
};

export default SettingsScreen;
