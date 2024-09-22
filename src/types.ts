export type RootStackParamList = {
  Home: undefined; // HomeScreen nemá žádné parametry
  List: { listName: string }; // ListScreen bude přijímat parametr listName
  NewList: undefined; // NewListScreen nemá žádné parametry
};
