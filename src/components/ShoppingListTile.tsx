import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';

type ShoppingListTileProps = {
  listName: string;
  items: { id: string; purchased: boolean }[];
  onPress: () => void;
  onOptionsPress: () => void;
  theme: 'light' | 'dark';
};

const ShoppingListTile: React.FC<ShoppingListTileProps> = ({ listName, items, onPress, onOptionsPress, theme }) => {
  // Výpočet progressu - zakoupené položky vůči celkovým položkám
  const purchasedCount = items.filter(item => item.purchased).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? purchasedCount / totalCount : 0;

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      borderRadius: 10,
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
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
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
    progressBar: {
      marginTop: 5,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme === 'dark' ? '#333333' : '#dcdcdc', // background color behind progress
    },
    optionsButton: {
      padding: 10,
    },
  });

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

export default ShoppingListTile;
