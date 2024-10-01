import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ShoppingListProps = {
  listId: string;
  listName: string;
  onPress: () => void; // Funkce, která se spustí po kliknutí na seznam
  onOptionsPress: () => void; // Funkce, která se spustí po kliknutí na tři tečky
};

const ShoppingList: React.FC<ShoppingListProps> = ({ listId, listName, onPress, onOptionsPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.listItem}>
        <Text style={styles.listName}>{listName}</Text>
        <TouchableOpacity onPress={onOptionsPress} style={styles.iconTouchable}>
          <Ionicons name="ellipsis-vertical" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  listName: {
    fontSize: 18,
  },
  iconTouchable: {
    padding: 10, // Zóna pro snadnější klikání
  },
});

export default ShoppingList;
