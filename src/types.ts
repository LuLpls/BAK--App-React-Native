export type RootStackParamList = {
  Home: undefined; // HomeScreen nemá žádné parametry
  List: { listId: string; listName: string; items: { id: string; purchased: boolean }[] }; // ListScreen přijímá listId, listName a volitelně items
  Settings: undefined;
};
