import { configureStore, combineReducers } from "@reduxjs/toolkit"
import authSlice from "./authSlics.js"
import postSlice from './postSlice.js'
import chatSlice from './chatSlice.js'
import socketSlice from "./socketSlice.js"
import RTNSlice from './RTNslice.js';
import storage from "redux-persist/lib/storage";

import { 
  persistReducer,
  PURGE,
  PAUSE,
  REGISTER,
  REHYDRATE,
  PERSIST,
  FLUSH
} from "redux-persist";

const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  chat: chatSlice,
  socketio: socketSlice,
  realTimeNotification:RTNSlice,
})

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["auth", "post", "chat", "socketio"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleWare) => 
    getDefaultMiddleWare({
      serializableCheck: {
        ignoredActions: [FLUSH, PURGE, PAUSE, REGISTER, REHYDRATE, PERSIST],
      },
    }),
});

export default store;