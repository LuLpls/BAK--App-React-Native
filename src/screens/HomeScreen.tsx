import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Modal, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { createItem, readItems, updateItem, deleteItem } from '../services/storageService'; // Import CRUD functions

import ShoppingListTile from '../components/ShoppingListTile';
import Header from '../components/Header';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [shoppingLists, setShoppingLists] = useState<{ id: string; name: string; items: { id: string; purchased: boolean }[] }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedList, setSelectedList] = useState<{ id: string; name: string } | null>(null);
  const [listNameInput, setListNameInput] = useState('');

  const SHOPPING_LIST_KEY = 'shoppingLists';

  // Načtení seznamů při startu aplikace
  const loadShoppingLists = async () => {
    const lists = await readItems(SHOPPING_LIST_KEY);
    setShoppingLists(lists);
  };

  // Uložení (vytvoření nového seznamu nebo přejmenování)
  const saveList = async () => {
    if (listNameInput.trim() === '') return;

    if (selectedList) {
      // Přejmenování existujícího seznamu
      const updatedLists = { ...selectedList, name: listNameInput}
      await updateItem(SHOPPING_LIST_KEY, updatedLists, 'id')
    } else {
      const newList = { id: Math.random().toString(), name: listNameInput, items: [] };
      await createItem(SHOPPING_LIST_KEY, newList);
    }
    loadShoppingLists();
    setModalVisible(false);
  };

  // Smazání seznamu
  const deleteList = async () => {
    if (selectedList) {
      await deleteItem(SHOPPING_LIST_KEY, selectedList.id, 'id');
      loadShoppingLists();
      setModalVisible(false);
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

  useEffect(() => {
    loadShoppingLists();
    navigation.setOptions({
      headerRight: () => <Header navigation={navigation} />,
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Načti seznamy pokaždé, když se HomeScreen zobrazí
      loadShoppingLists();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Shopping Lists</Text>

      <FlatList
        data={shoppingLists}
        keyExtractor={(list) => list.id}
        renderItem={({ item }) => (
          <ShoppingListTile
            listId={item.id}
            listName={item.name}
            items = {item.items}
            onPress={() => navigation.navigate('List', { listName: item.name, listId: item.id, items: item.items })}
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
              maxLength={20}
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
