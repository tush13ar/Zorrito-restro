import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import authReducer from "./AuthSlice";
import dbReducer from "./DBSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["authDetails"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: { auth: persistedAuthReducer, db: dbReducer },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);
