import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, Modal, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ShoppingListTile from '../components/ShoppingListTile';
import Header from '../components/Header';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [shoppingLists, setShoppingLists] = useState<{ id: string; name: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedList, setSelectedList] = useState<{ id: string; name: string } | null>(null);
  const [listNameInput, setListNameInput] = useState(''); // Je 

  // Načtení seznamů při startu aplikace
  const loadShoppingLists = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('shoppingLists');
      if (jsonValue != null) {
        const lists = JSON.parse(jsonValue);
        const validatedLists = lists.map((list: { id: string; name?: string }) => ({
          ...list,
          name: list.name || 'Shopping List', // Pokud je `name` undefined, nastavíme výchozí hodnotu
        }));
        setShoppingLists(validatedLists);
      }
    } catch (e) {
      console.log('Failed to load lists from storage.');
    }
  };

  // Uložení seznamů
  const saveShoppingLists = async (lists: { id: string; name: string }[]) => {
    try {
      const jsonValue = JSON.stringify(lists);
      await AsyncStorage.setItem('shoppingLists', jsonValue);
    } catch (e) {
      console.log('Failed to save lists to storage.');
    }
  };

  // Otevření modalu pro přejmenování nebo přidání
  const openModal = (listId?: string, listName?: string) => {
    if (listId && listName) {
      // Přejmenování seznamu
      setSelectedList({ id: listId, name: listName });
      setListNameInput(listName); // Předvyplníme název seznamu
    } else {
      // Vytvoření nového seznamu
      setSelectedList(null);
      setListNameInput(''); // Vymažeme vstupní pole
    }
    setModalVisible(true);
  };

  // Uložení (vytvoření nového seznamu nebo přejmenování)
  const saveList = () => {
    if (listNameInput.trim() === '') return;

    if (selectedList) {
      // Přejmenování existujícího seznamu
      const updatedLists = shoppingLists.map((list) =>
        list.id === selectedList.id ? { ...list, name: listNameInput } : list
      );
      setShoppingLists(updatedLists);
      saveShoppingLists(updatedLists);
    } else {
      // Vytvoření nového seznamu
      const newList = { id: Math.random().toString(), name: listNameInput };
      const updatedLists = [...shoppingLists, newList];
      setShoppingLists(updatedLists);
      saveShoppingLists(updatedLists);
    }

    setModalVisible(false);
  };

  // Smazání seznamu
  const deleteList = () => {
    if (selectedList) {
      const updatedLists = shoppingLists.filter((list) => list.id !== selectedList.id);
      setShoppingLists(updatedLists);
      saveShoppingLists(updatedLists);
      setModalVisible(false);
    }
  };

  useEffect(() => {
    loadShoppingLists();
    navigation.setOptions({
      headerRight: () => <Header navigation={navigation} />,
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Shopping Lists</Text>

      <FlatList
        data={shoppingLists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ShoppingListTile
            listId={item.id}
            listName={item.name}
            onPress={() => navigation.navigate('List', { listName: item.name, listId: item.id })}
            onOptionsPress={() => openModal(item.id, item.name)}
          />
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Text style={styles.addButtonText}>+ New List</Text>
      </TouchableOpacity>

      {/* Modal pro přidání nebo přejmenování seznamu */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedList ? 'Edit List' : 'Add new List'}
            </Text>
            <TextInput
              placeholder="Name"
              value={listNameInput}
              onChangeText={(text) => setListNameInput(text)}
              style={styles.input}
            />
            <TouchableOpacity style={styles.modalSaveButton} onPress={saveList}>
              <Text style={styles.modalSaveButtonText}>{selectedList ? 'Rename' : 'Add List'}</Text>
            </TouchableOpacity>

            {selectedList && (
              <TouchableOpacity style={styles.modalDeleteButton} onPress={deleteList}>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  listName: {
    fontSize: 18,
  },
  iconTouchable: {
    paddingHorizontal: 3,
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
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

export default HomeScreen;
