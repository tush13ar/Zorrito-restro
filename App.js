import "react-native-gesture-handler";
import React, { useEffect } from "react";
import firebase from "firebase";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigators/RootNavigator";
import { Provider } from "react-redux";
import { persistor, store } from "./src/store/store";
import { PersistGate } from "redux-persist/integration/react";

const firebaseConfig = {
  apiKey: "AIzaSyBymHY9jDzpG64gAxgrvSBS0FAFQebqjrM",
  authDomain: "zorrito-a9beb.firebaseapp.com",
  databaseURL: "https://zorrito-a9beb-default-rtdb.firebaseio.com",
  storageBucket: "zorrito-a9beb.appspot.com",
};

const config = {
  name: "Zorrito-restro",
};

// if (firebase.apps.length === 0) {
//   firebase.initializeApp(firebaseConfig);
// }

export default function App() {
  useEffect(() => {
    if (firebase.apps.length === 0) {
      console.log(firebase.apps);
      firebase.initializeApp(firebaseConfig, config);
      console.log(firebase.apps);
    }
  }, []);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
