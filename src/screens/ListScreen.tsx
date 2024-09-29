import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { ProgressBar } from 'react-native-paper';
import ItemTile from '../components/ItemTile'; // Importování nové komponenty

type ListScreenProps = {
  route: RouteProp<RootStackParamList, 'List'>;
};

const ListScreen: React.FC<ListScreenProps> = ({ route }) => {
  const { listId } = route.params;

  // Stav pro položky v seznamu
  const [items, setItems] = useState<{ id: string; name: string; purchased: boolean }[]>([]);
  const [newItem, setNewItem] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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
  const saveItems = async (updatedItems: { id: string; name: string; purchased: boolean }[]) => {
    try {
      const jsonValue = JSON.stringify(updatedItems);
      await AsyncStorage.setItem(`items_${listId}`, jsonValue);
    } catch (e) {
      console.log('Failed to save items to storage.');
    }
  };

  // Přidání nové položky
  const addNewItem = () => {
    if (newItem.trim() === '') return;

    const item = {
      id: Math.random().toString(),
      name: newItem,
      purchased: false,
    };

    const updatedItems = [...items, item];
    setItems(updatedItems);
    saveItems(updatedItems); // Uložit aktualizované položky
    setNewItem('');
    setModalVisible(false);
  };

  // Přepnutí stavu položky mezi zakoupenou a nezakoupenou
  const togglePurchased = (itemId: string) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, purchased: !item.purchased } : item
    );
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
            purchased={item.purchased}
            togglePurchased={togglePurchased}
          />
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Item</Text>
      </TouchableOpacity>

      {/* Modal pro přidání nové položky */}
      <Modal visible={modalVisible} animationType='slide' transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add new Item</Text>
            <TextInput
              placeholder='Name'
              value={newItem}
              onChangeText={setNewItem}
              style={styles.modalInput}
            />
            <TouchableOpacity style={styles.modalAddButton} onPress={addNewItem}>
              <Text style={styles.modalAddButtonText}>Add Item</Text>
            </TouchableOpacity>
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
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  modalAddButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalAddButtonText: {
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
