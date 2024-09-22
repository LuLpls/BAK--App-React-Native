import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';

// Typování props pro navigaci
type ListScreenProps = {
  route: RouteProp<RootStackParamList, 'List'>;
};

const ListScreen: React.FC<ListScreenProps> = ({ route }) => {
  const { listName } = route.params;

  // Stav pro položky v seznamu
  const [items, setItems] = useState<{ id: string; name: string }[]>([]);
  const [newItem, setNewItem] = useState('');

  // Přidání nové položky
  const addNewItem = () => {
    if (newItem.trim() === '') return;

    const item = {
      id: Math.random().toString(), // Generování náhodného ID
      name: newItem,
    };

    setItems((prevItems) => [...prevItems, item]);
    setNewItem(''); // Vyčistit input
  };

  return (
    <View>
      <Text>Seznam: {listName}</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />

      <TextInput
        placeholder="Zadejte položku"
        value={newItem}
        onChangeText={setNewItem}
        style={{ borderWidth: 1, padding: 8, margin: 10 }}
      />

      <Button title="Přidat položku" onPress={addNewItem} />
    </View>
  );
};

export default ListScreen;
