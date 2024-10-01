import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';

type ShoppingListTileProps = {
  listId: string;
  listName: string;
  items: { id: string; purchased: boolean }[];
  onPress: () => void;
  onOptionsPress: () => void;
};


const ShoppingListTile: React.FC<ShoppingListTileProps> = ({ listId, listName, items, onPress, onOptionsPress }) => {
  // Výpočet progressu - zakoupené položky vůči celkovým položkám
  const purchasedCount = items.filter(item => item.purchased).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? purchasedCount / totalCount : 0;
  
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.listName}>{listName}</Text>
        {totalCount > 0 && (
          <ProgressBar progress={progress} color="#3498db" style={styles.progressBar} />
        )}
      </View>
      <TouchableOpacity onPress={onOptionsPress} style={styles.optionsButton}>
        <Text>⋮</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  listName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBar: {
    marginTop: 5,
    height: 10,
    borderRadius: 5,
  },
  optionsButton: {
    padding: 10,
  },
});

export default ShoppingListTile;
