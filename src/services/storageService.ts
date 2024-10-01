import AsyncStorage from '@react-native-async-storage/async-storage';

export const createItem = async (key: string, newItem: any) => {
  try {
    const existingItems = await AsyncStorage.getItem(key);
    const parsedItems = existingItems ? JSON.parse(existingItems) : [];
    const updatedItems = [...parsedItems, newItem];
    await AsyncStorage.setItem(key, JSON.stringify(updatedItems));
  } catch (error) {
    console.error('Failed to create item:', error);
  }
};

export const readItems = async (key: string) => {
  try {
    const items = await AsyncStorage.getItem(key);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Failed to read items:', error);
    return [];
  }
};

export const updateItem = async (key: string, updatedItem: any, idField: string) => {
  try {
    const existingItems = await AsyncStorage.getItem(key);
    if (existingItems) {
      const parsedItems = JSON.parse(existingItems);
      const updatedItems = parsedItems.map((item: any) =>
        item[idField] === updatedItem[idField] ? updatedItem : item
      );
      await AsyncStorage.setItem(key, JSON.stringify(updatedItems));
    }
  } catch (error) {
    console.error('Failed to update item:', error);
  }
};

export const deleteItem = async (key: string, id: string, idField: string) => {
  try {
    const existingItems = await AsyncStorage.getItem(key);
    if (existingItems) {
      const parsedItems = JSON.parse(existingItems);
      const updatedItems = parsedItems.filter((item: any) => item[idField] !== id);
      await AsyncStorage.setItem(key, JSON.stringify(updatedItems));
    }
  } catch (error) {
    console.error('Failed to delete item:', error);
  }
};
