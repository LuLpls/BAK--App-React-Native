import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';

const NewListScreen: React.FC = () => {
  const [listName, setListName] = useState('');

  const handleSave = () => {
    // Zde přidáme logiku pro uložení nového seznamu
    console.log('Nový seznam:', listName);
  };

  return (
    <View>
      <Text>Přidat nový seznam</Text>
      <TextInput
        placeholder="Název seznamu"
        value={listName}
        onChangeText={setListName}
      />
      <Button title="Uložit" onPress={handleSave} />
    </View>
  );
};

export default NewListScreen;
