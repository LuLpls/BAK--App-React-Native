export type RootStackParamList = {
  Home: undefined; // HomeScreen nemá žádné parametry
  List: { listId: string; listName: string }; // ListScreen bude přijímat parametr listName
  NewList: undefined; // NewListScreen nemá žádné parametry
  Settings: undefined;
};
