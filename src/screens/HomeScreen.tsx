// HomeScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Modal, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { createItem, readItems, updateItem, deleteItem } from '../services/storageService';
import ShoppingListTile from '../components/ShoppingListTile';
import Header from '../components/Header';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
  theme: 'light' | 'dark';
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, theme }) => {
  const [shoppingLists, setShoppingLists] = useState<{ id: string; name: string; items: { id: string; purchased: boolean }[] }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedList, setSelectedList] = useState<{ id: string; name: string } | null>(null);
  const [listNameInput, setListNameInput] = useState('');

  const SHOPPING_LIST_KEY = 'shoppingLists';

  const loadShoppingLists = async () => {
    const lists = await readItems(SHOPPING_LIST_KEY);
    setShoppingLists(lists);
  };

  const saveList = async () => {
    if (listNameInput.trim() === '') {return;}

    if (selectedList) {
      const existingList = shoppingLists.find(list => list.id === selectedList.id);

      const updatedLists = {
        ...selectedList,
        name: listNameInput,
        items: existingList?.items || [],
      };

      await updateItem(SHOPPING_LIST_KEY, updatedLists, 'id');
    } else {
      const newList = { id: Math.random().toString(), name: listNameInput, items: [] };
      await createItem(SHOPPING_LIST_KEY, newList);
    }
    loadShoppingLists();
    setModalVisible(false);
  };

  const deleteList = async () => {
    if (selectedList) {
      await deleteItem(SHOPPING_LIST_KEY, selectedList.id, 'id');
      loadShoppingLists();
      setModalVisible(false);
    }
  };

  const openModal = (listId?: string, listName?: string) => {
    if (listId && listName) {
      setSelectedList({ id: listId, name: listName });
      setListNameInput(listName);
    } else {
      setSelectedList(null);
      setListNameInput('');
    }
    setModalVisible(true);
  };

  useEffect(() => {
    loadShoppingLists();
    navigation.setOptions({
      headerRight: () => <Header navigation={navigation} />,
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      loadShoppingLists();
    }, [])
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f5f5f5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme === 'dark' ? '#ffffff' : '#333',
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
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
      padding: 20,
      borderRadius: 10,
      width: '80%',
    },
    modalTitle: {
      fontSize: 18,
      marginBottom: 10,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#ffffff' : '#000',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff',
      color: theme === 'dark' ? '#ffffff' : '#000000',
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Shopping Lists</Text>

      <FlatList
        data={shoppingLists}
        keyExtractor={(list) => list.id}
        renderItem={({ item }) => (
          <ShoppingListTile
            listName={item.name}
            items={item.items}
            onPress={() => navigation.navigate('List', { listName: item.name, listId: item.id, items: item.items })}
            onOptionsPress={() => openModal(item.id, item.name)}
            theme={theme}
          />
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Text style={styles.addButtonText}>+ New List</Text>
      </TouchableOpacity>

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
              placeholderTextColor={theme === 'dark' ? '#aaaaaa' : '#999999'} // 🟩 Dynamický placeholder
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

export default HomeScreen;
