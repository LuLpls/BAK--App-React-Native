import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { ProgressBar } from 'react-native-paper';
import { createItem, readItems, updateItem, deleteItem } from '../services/storageService'; // Import service
import ItemTile from '../components/ItemTile';

type ListScreenProps = {
  route: RouteProp<RootStackParamList, 'List'>;
};

const ListScreen: React.FC<ListScreenProps> = ({ route }) => {
  const { listId } = route.params;

  const [items, setItems] = useState<{ id: string; name: string; quantity?: string; unit?: string; purchased: boolean }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string; quantity?: string; unit?: string } | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState<string>(''); 
  const [editUnit, setEditUnit] = useState('');

  const ITEMS_KEY = `items_${listId}`;

  // Načtení položek ze seznamu
  const loadItems = async () => {
    const loadedItems = await readItems(ITEMS_KEY);
    setItems(loadedItems);
  };

  // Uložení položek a aktualizace shoppingLists
  const saveItems = async (updatedItems: typeof items) => {
    await updateItem('shoppingLists', { id: listId, items: updatedItems }, 'id');
    setItems(updatedItems);
  };

  // Otevření modalu pro přidání nebo úpravu
  const openModal = (itemId?: string, itemName?: string, itemQuantity?: string, itemUnit?: string) => {
    if (itemId) {
      setSelectedItem({ id: itemId, name: itemName || '', quantity: itemQuantity, unit: itemUnit });
      setEditName(itemName || '');
      setEditQuantity(itemQuantity || '');
      setEditUnit(itemUnit || '');
    } else {
      setSelectedItem(null);
      setEditName('');
      setEditQuantity('');
      setEditUnit('');
    }
    setModalVisible(true);
  };

  // Přidání nebo úprava položky
  const saveOrEditItem = () => {
    if (editName.trim() === '') return;

    const sanitizedQuantity = editQuantity.trim() !== '' ? editQuantity.replace(',', '.') : '';

    if (sanitizedQuantity !== '' && isNaN(Number(sanitizedQuantity))) {
      Alert.alert('Invalid Input', 'Please enter a valid number for the quantity.');
      return;
    }

    let updatedItems;
    if (selectedItem) {
      updatedItems = items.map((item) =>
        item.id === selectedItem.id
          ? { ...item, name: editName, quantity: sanitizedQuantity, unit: editUnit }
          : item
      );
    } else {
      const newItem = {
        id: Math.random().toString(),
        name: editName,
        quantity: sanitizedQuantity,
        unit: editUnit,
        purchased: false,
      };
      updatedItems = [...items, newItem];
    }
    
    saveItems(updatedItems);
    setModalVisible(false);
  };

  // Smazání položky
  const deleteItemFromList = (itemId: string) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    saveItems(updatedItems);
    setModalVisible(false)
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <View style={styles.container}>
      {items.length > 0 && (
        <ProgressBar
          progress={items.length ? items.filter(item => item.purchased).length / items.length : 0}
          color='#3498db'
          style={styles.progressBar}
        />
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemTile
            id={item.id}
            name={item.name}
            quantity={item.quantity}
            unit={item.unit}
            purchased={item.purchased}
            togglePurchased={(itemId) => {
              const updatedItems = items.map(i =>
                i.id === itemId ? { ...i, purchased: !i.purchased } : i
              );
              saveItems(updatedItems);
            }}
            onOptionsPress={() => openModal(item.id, item.name, item.quantity, item.unit)}
          />
        )}
      />

      {/* Button pro přidání nové položky */}
      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Text style={styles.addButtonText}>+ Add Item</Text>
      </TouchableOpacity>

      {/* Modal pro přidání nebo úpravu položky */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedItem ? 'Edit Item' : 'Add Item'}</Text>
            <TextInput
              placeholder="Name"
              value={editName}
              onChangeText={setEditName}
              style={styles.modalInput}
              maxLength={20}
            />
            <TextInput
              placeholder="Quantity"
              value={editQuantity}
              onChangeText={setEditQuantity}
              style={styles.modalInput}
              keyboardType="numeric"
              maxLength={10}
            />
            <TextInput
              placeholder="Unit"
              value={editUnit}
              onChangeText={setEditUnit}
              style={styles.modalInput}
              maxLength={10}
            />

            <TouchableOpacity style={styles.modalSaveButton} onPress={saveOrEditItem}>
              <Text style={styles.modalSaveButtonText}>{selectedItem ? 'Save' : 'Add Item'}</Text>
            </TouchableOpacity>

            {selectedItem && (
              <TouchableOpacity style={styles.modalDeleteButton} onPress={() => deleteItemFromList(selectedItem.id)}>
                <Text style={styles.modalDeleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalSaveButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalSaveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalDeleteButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalDeleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalCancelButton: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default ListScreen;
