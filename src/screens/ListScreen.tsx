import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { ProgressBar } from 'react-native-paper';
import ItemTile from '../components/ItemTile'; // Importování komponenty

type ListScreenProps = {
  route: RouteProp<RootStackParamList, 'List'>;
};

const ListScreen: React.FC<ListScreenProps> = ({ route }) => {
  const { listId } = route.params;

  // Stav pro položky v seznamu
  const [items, setItems] = useState<{ id: string; name: string; quantity?: number; unit?: string; purchased: boolean }[]>([]);
  const [newItem, setNewItem] = useState(''); // Stav pro nový item
  const [modalVisible, setModalVisible] = useState(false); // Stav pro viditelnost modalu
  const [editItem, setEditItem] = useState<{ id: string; name: string; quantity?: string; unit?: string } | null>(null);  // Stav pro editaci položky

  // Načítání položek při načtení obrazovky
  const loadItems = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(`items_${listId}`);
      if (jsonValue != null) {
        setItems(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.log('Failed to load items from storage.');
    }
  };

  // Ukládání položek do AsyncStorage
  const saveItems = async (updatedItems: { id: string; name: string; quantity?: number; unit?: string; purchased: boolean }[]) => {
    try {
      const jsonValue = JSON.stringify(updatedItems);
      await AsyncStorage.setItem(`items_${listId}`, jsonValue);
    } catch (e) {
      console.log('Failed to save items to storage.');
    }
  };

  // Přidání nové položky
  const addNewItem = () => {
    if (newItem.trim() === '') return; // Pokud je prázdný input, nic nepřidá

    const item = {
      id: Math.random().toString(),
      name: newItem,
      purchased: false,
    };

    const updatedItems = [...items, item];
    setItems(updatedItems);
    saveItems(updatedItems);
    setNewItem(''); // Reset pole po přidání
  };

  // Otevření modalu pro editaci položky
  const openEditModal = (item: { id: string; name: string; quantity?: number; unit?: string }) => {
    setEditItem({
      id: item.id,
      name: item.name,
      quantity: item.quantity ? item.quantity.toString() : '',  // Pokud je nastaveno množství, převedeme ho na string
      unit: item.unit || '',  // Pokud není nastavená jednotka, prázdný string
    });
    setModalVisible(true); // Zobrazení modalu
  };

  // Uložení upravené položky
  const handleEditItem = () => {
    if (editItem) {
      const updatedItems = items.map((item) =>
        item.id === editItem.id
          ? { ...item, name: editItem.name, quantity: editItem.quantity ? parseFloat(editItem.quantity) : undefined, unit: editItem.unit || undefined }
          : item
      );
      setItems(updatedItems);
      saveItems(updatedItems);
      setModalVisible(false); // Zavřít modal po uložení
    }
  };

  // Přepnutí stavu položky mezi zakoupenou a nezakoupenou
  const togglePurchased = (itemId: string) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, purchased: !item.purchased } : item
    );
    setItems(updatedItems);
    saveItems(updatedItems);
  };

  // Smazání položky
  const deleteItem = (itemId: string) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
    saveItems(updatedItems);
  };

  // Procentuální dokončení
  const purchasedCount = items.filter((item) => item.purchased).length;
  const totalCount = items.length;
  const progress = totalCount === 0 ? 0 : purchasedCount / totalCount;

  // Načtení položek při prvním renderování
  useEffect(() => {
    loadItems();
  }, []);

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} color='#3498db' style={styles.progressBar} />

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
            togglePurchased={togglePurchased}
            onDelete={deleteItem}
            onEdit={() => openEditModal(item)} // Otevření modalu při kliknutí na editaci
          />
        )}
      />

      {/* Přidání nové položky */}
      <View>
        <TextInput
          style={styles.newItemInput}
          placeholder="Add new item"
          value={newItem}
          onChangeText={setNewItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={addNewItem}>
          <Text style={styles.addButtonText}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Modal pro editaci položky */}
      {modalVisible && editItem && (
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Item</Text>

              {/* Input pro jméno položky */}
              <TextInput
                value={editItem.name}
                onChangeText={(text) => setEditItem({ ...editItem, name: text })}
                style={styles.modalInput}
                placeholder="Edit item name"
              />

              {/* Input pro množství */}
              <TextInput
                value={editItem.quantity}
                onChangeText={(text) => setEditItem({ ...editItem, quantity: text })}
                style={styles.modalInput}
                placeholder="Amount (optional)"
                keyboardType="numeric"
              />

              {/* Input pro jednotku */}
              <TextInput
                value={editItem.unit}
                onChangeText={(text) => setEditItem({ ...editItem, unit: text })}
                style={styles.modalInput}
                placeholder="Unit (e.g. kg, l, pcs) (optional)"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButtonSave} onPress={handleEditItem}>
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  newItemInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
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

export default ListScreen;
