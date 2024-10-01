import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type ItemProps = {
  id: string;
  name: string;
  purchased: boolean;
  quantity?: number;
  unit?: string;
  togglePurchased: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string, quantity: number ,unit: string) => void;
};

const Item: React.FC<ItemProps> = ({ id, name, purchased, togglePurchased, onDelete, onEdit }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState(name);
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState('');

  // Funkce pro otevření modálu pro možnosti
  const openOptionsModal = () => {
    setModalVisible(true);
  };

  // Funkce pro editaci položky
  const handleEditItem = () => {
    const parsedQuantity = parseFloat(quantity);  // Převede string na číslo
    if (isNaN(parsedQuantity)) {
      // Ošetření, když není zadáno platné číslo
      console.log('Invalid quantity');
      return;
    }
    onEdit(id, newName, parsedQuantity, unit);
    setModalVisible(false);
  };

  // Funkce pro smazání položky
  const handleDeleteItem = () => {
    onDelete(id);
    setModalVisible(false);
  };

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
      <TouchableOpacity onPress={openOptionsModal} style={styles.optionsButton}>
        <Ionicons name="ellipsis-vertical" size={24} color="#333" />
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
    },
    itemText: {
      marginLeft: 10,
      fontSize: 18,
      flex: 1,
    },
    purchasedItem: {
      textDecorationLine: 'line-through',
      color: 'gray',
    },
    optionsButton: {
      paddingHorizontal: 10,
    },
    
    // Modal Styling
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark transparent background
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 15,
      width: '80%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    modalInput: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 12,
      borderRadius: 10,
      marginBottom: 20,
      backgroundColor: '#f9f9f9',
    },
    unitPickerContainer: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 12,
      borderRadius: 10,
      marginBottom: 20,
      backgroundColor: '#f9f9f9',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    modalButtonSave: {
      flex: 1,
      backgroundColor: '#3498db',
      padding: 12,
      borderRadius: 10,
      marginRight: 5,
      alignItems: 'center',
    },
    modalButtonDelete: {
      flex: 1,
      backgroundColor: '#e74c3c',
      padding: 12,
      borderRadius: 10,
      marginLeft: 5,
      marginRight: 5,
      alignItems: 'center',
    },
    modalButtonCancel: {
      flex: 1,
      backgroundColor: '#95a5a6',
      padding: 12,
      borderRadius: 10,
      marginLeft: 5,
      alignItems: 'center',
    },
    modalButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default Item;
