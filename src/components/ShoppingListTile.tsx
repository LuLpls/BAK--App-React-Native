import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ShoppingListTileProps = {
  listName: string;
  items: { id: string; purchased: boolean }[];
  onPress: () => void;
  onOptionsPress: () => void;
  theme: 'light' | 'dark';
};

const ShoppingListTile: React.FC<ShoppingListTileProps> = ({ listName, items, onPress, onOptionsPress, theme }) => {
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
    optionsButton: {
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.listName}>{listName}</Text>
      </View>
      <TouchableOpacity
        onPress={onOptionsPress}
        style={styles.optionsButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={24}
          color={theme === 'dark' ? '#ccc' : '#555'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ShoppingListTile;
