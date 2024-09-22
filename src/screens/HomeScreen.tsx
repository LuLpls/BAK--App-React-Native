import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

// Typování props pro navigaci
type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Stav pro nákupní seznamy
  const [shoppingLists, setShoppingLists] = useState<{ id: string; name: string }[]>([]);

  // Stav pro nový název seznamu
  const [newListName, setNewListName] = useState('');

  // Funkce pro přidání nového seznamu
  const addNewList = () => {
    if (newListName.trim() === '') return;

    const newList = {
      id: Math.random().toString(), // Generujeme náhodné ID, ideálně bychom použili nějaké knihovny na unikátní ID
      name: newListName,
    };

    setShoppingLists((prevLists) => [...prevLists, newList]);
    setNewListName(''); // Vyčistit pole
  };

  return (
    <View>
      <Text>Seznam nákupních seznamů</Text>

      <FlatList
        data={shoppingLists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Button title="Otevřít" onPress={() => navigation.navigate('List', { listName: item.name })} />
          </View>
        )}
      />

      {/* Text input pro přidání nového seznamu */}
      <TextInput
        placeholder="Zadejte název nového seznamu"
        value={newListName}
        onChangeText={setNewListName}
        style={{ borderWidth: 1, padding: 8, margin: 10 }}
      />

      <Button title="Přidat nový seznam" onPress={addNewList} />
    </View>
  );
};

export default HomeScreen;
