import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ItemProps = {
  id: string;
  name: string;
  purchased: boolean;
  togglePurchased: (id: string) => void;
};

const Item: React.FC<ItemProps> = ({ id, name, purchased, togglePurchased }) => {
  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => togglePurchased(id)}>
        <Ionicons
          name={purchased ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={purchased ? '#3498db' : '#000'}
        />
      </TouchableOpacity>
      <Text style={[styles.itemText, purchased && styles.purchasedItem]}>{name}</Text>
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
  },
  itemText: {
    marginLeft: 10,
    fontSize: 18,
  },
  purchasedItem: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});

export default Item;
