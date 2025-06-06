import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { ProgressBar } from 'react-native-paper';
import ItemTile from '../components/ItemTile';
import i18n from '../localization';

type ListScreenProps = {
  route: RouteProp<RootStackParamList, 'List'>;
  theme: 'light' | 'dark';
};

const ListScreen: React.FC<ListScreenProps> = ({ route, theme }) => {
  const { listId } = route.params;

  const [items, setItems] = useState<{ id: string; name: string; quantity?: string; unit?: string; purchased: boolean }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string; quantity?: string; unit?: string } | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState<string>('');
  const [editUnit, setEditUnit] = useState('');

  const loadItems = React.useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(`items_${listId}`);
      if (jsonValue != null) {
        setItems(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.log('Failed to load items from storage.');
    }
  }, [listId]);

  const updateShoppingLists = async (updatedItems: typeof items) => {
    try {
      const jsonLists = await AsyncStorage.getItem('shoppingLists');
      if (jsonLists != null) {
        const shoppingLists = JSON.parse(jsonLists);
        const updatedLists = shoppingLists.map((list: { id: string; name: string; items: typeof items }) =>
          list.id === listId ? { ...list, items: updatedItems } : list
        );
        await AsyncStorage.setItem('shoppingLists', JSON.stringify(updatedLists));
      }
    } catch (e) {
      console.log('Failed to update shoppingLists.');
    }
  };

  const saveItems = async (updatedItems: typeof items) => {
    try {
      const jsonValue = JSON.stringify(updatedItems);
      await AsyncStorage.setItem(`items_${listId}`, jsonValue);
      updateShoppingLists(updatedItems);
    } catch (e) {
      console.log('Failed to save items to storage.');
    }
  };

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

  const saveItem = () => {
    if (editName.trim() === '') { return; }

    const sanitizedQuantity = editQuantity.trim() !== '' ? editQuantity.replace(',', '.') : '';

    if (sanitizedQuantity !== '' && isNaN(Number(sanitizedQuantity))) {
      Alert.alert('Invalid Input', 'Please enter a valid number for the quantity.');
      return;
    }

    if (selectedItem) {
      const updatedItems = items.map((item) =>
        item.id === selectedItem.id
          ? { ...item, name: editName, quantity: sanitizedQuantity, unit: editUnit }
          : item
      );
      setItems(updatedItems);
      saveItems(updatedItems);
    } else {
      const newItem = {
        id: Math.random().toString(),
        name: editName,
        quantity: sanitizedQuantity,
        unit: editUnit,
        purchased: false,
      };
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      saveItems(updatedItems);
    }

    setModalVisible(false);
  };

  const deleteItem = () => {
    if (selectedItem) {
      const updatedItems = items.filter((item) => item.id !== selectedItem.id);
      setItems(updatedItems);
      saveItems(updatedItems);
      setModalVisible(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f5f5f5',
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
      backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
      padding: 20,
      borderRadius: 10,
      width: '80%',
    },
    modalTitle: {
      fontSize: 18,
      marginBottom: 10,
      fontWeight: 'bold',
      color: theme === 'dark' ? '#ffffff' : '#000000',
    },
    modalInput: {
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
      {items.length > 0 && (
        <ProgressBar
          progress={items.length ? items.filter(item => item.purchased).length / items.length : 0}
          color="#3498db"
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
              setItems(updatedItems);
              saveItems(updatedItems);
            }}
            onOptionsPress={() => openModal(item.id, item.name, item.quantity, item.unit)}
            theme={theme}
          />
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Text style={styles.addButtonText}>{i18n.t('list.addItemButton')}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedItem ? i18n.t('list.editItem') : i18n.t('list.addItem')}</Text>
            <TextInput
              placeholder={i18n.t('list.namePlaceholder')}
              value={editName}
              onChangeText={setEditName}
              style={styles.modalInput}
              placeholderTextColor={theme === 'dark' ? '#aaaaaa' : '#999999'}
              maxLength={20}
            />
            <TextInput
              placeholder={i18n.t('list.quantityPlaceholder')}
              value={editQuantity}
              onChangeText={setEditQuantity}
              style={styles.modalInput}
              placeholderTextColor={theme === 'dark' ? '#aaaaaa' : '#999999'}
              keyboardType="numeric"
              maxLength={10}
            />
            <TextInput
              placeholder={i18n.t('list.unitPlaceholder')}
              value={editUnit}
              onChangeText={setEditUnit}
              style={styles.modalInput}
              placeholderTextColor={theme === 'dark' ? '#aaaaaa' : '#999999'}
              maxLength={10}
            />

            <TouchableOpacity style={styles.modalSaveButton} onPress={saveItem}>
              <Text style={styles.modalSaveButtonText}>
                {selectedItem ? i18n.t('list.saveButton') : i18n.t('list.addItemButton')}
              </Text>
            </TouchableOpacity>

            {selectedItem && (
              <TouchableOpacity style={styles.modalDeleteButton} onPress={deleteItem}>
                <Text style={styles.modalDeleteButtonText}>{i18n.t('list.deleteButton')}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelButtonText}>{i18n.t('list.cancelButton')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ListScreen;
