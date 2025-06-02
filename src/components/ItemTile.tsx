import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ItemProps = {
  id: string;
  name: string;
  quantity?: string;
  unit?: string;
  purchased: boolean;
  togglePurchased: (id: string) => void;
  onOptionsPress: () => void;
  theme: 'light' | 'dark'; // 🟢 Přidáno
};

const Item: React.FC<ItemProps> = ({ id, name, quantity, unit, purchased, togglePurchased, onOptionsPress, theme }) => {
  const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: purchased
        ? (theme === 'dark' ? '#3a3a3a' : '#e0e0e0')
        : (theme === 'dark' ? '#1e1e1e' : '#fff'), // 🟢 Dark/Light background
      marginBottom: 5,
      borderRadius: 5,
      justifyContent: 'space-between',
    },
    textContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flex: 1,
    },
    itemText: {
      marginLeft: 10,
      fontSize: 18,
      flex: 1,
      color: purchased
        ? (theme === 'dark' ? '#777777' : '#b0b0b0')
        : (theme === 'dark' ? '#ffffff' : '#000000'), // 🟢 Text barva
    },
    quantityUnitText: {
      fontSize: 14,
      marginLeft: 'auto',
      color: purchased
        ? (theme === 'dark' ? '#777777' : '#b0b0b0')
        : (theme === 'dark' ? '#aaaaaa' : '#999999'), // 🟢 Quantity barva
    },
    iconTouchable: {
      paddingHorizontal: 10,
    },
  });

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => togglePurchased(id)}>
        <Ionicons
          name={purchased ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={purchased
            ? '#3498db'
            : (theme === 'dark' ? '#ffffff' : '#000000')} // 🟢 Ikonka podle theme
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.itemText}>{name}</Text>
        {(quantity || unit) && (
          <Text style={styles.quantityUnitText}>
            {quantity && quantity} {unit && unit}
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={onOptionsPress} style={styles.iconTouchable}>
        <Ionicons
          name="ellipsis-vertical"
          size={24}
          color={theme === 'dark' ? '#ffffff' : '#333333'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Item;
