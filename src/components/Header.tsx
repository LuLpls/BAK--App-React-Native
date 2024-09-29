// Header.tsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../types'; // Uprav si cestu dle své struktury

type HeaderProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const Header: React.FC<HeaderProps> = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
      <Ionicons name="settings-outline" size={24} color="#333" style={{ marginRight: 15 }} />
    </TouchableOpacity>
  );
};

export default Header;
