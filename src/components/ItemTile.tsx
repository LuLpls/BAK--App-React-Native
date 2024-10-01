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
};

const Item: React.FC<ItemProps> = ({ id, name, quantity, unit, purchased, togglePurchased, onOptionsPress }) => {
  return (
    <View style={[styles.itemContainer, purchased && styles.purchasedBackground]}>
      <TouchableOpacity onPress={() => togglePurchased(id)}>
        <Ionicons
          name={purchased ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={purchased ? '#3498db' : '#000'}
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={[styles.itemText, purchased && styles.purchasedText]}>{name}</Text>
        { (quantity || unit) && (
          <Text style={[styles.quantityUnitText, purchased && styles.purchasedQuantityUnitText]}>
            {quantity && quantity} {unit && unit}
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={onOptionsPress} style={styles.iconTouchable}>
        <Ionicons name="ellipsis-vertical" size={24} color={purchased ? '#b0b0b0' : '#333'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 5,
    justifyContent: 'space-between',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  purchasedBackground: {
    backgroundColor: '#e0e0e0', 
  },
  itemText: {
    marginLeft: 10,
    fontSize: 18,
    flex: 1,
  },
  quantityUnitText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 'auto',
  },
  purchasedQuantityUnitText: {
    color: '#b0b0b0', // Even lighter when purchased
  },
  purchasedText: {
    color: '#b0b0b0',
  },
  iconTouchable: {
    paddingHorizontal: 10,
  },
});

export default Item;
