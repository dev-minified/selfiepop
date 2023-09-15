import { configureStore } from '@reduxjs/toolkit';
import localforage from 'localforage';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import appTheme from './reducer/Apptheme';
import bottomNav from './reducer/bottomNav';
import cardModal from './reducer/cardModal';
import membershipModel from './reducer/changeMembershipModal';
import chatReducer from './reducer/chat';
import chatSlider from './reducer/chatSlider';
import checkout from './reducer/checkout';
import counterReducer from './reducer/counter';
import eventSlice from './reducer/eventslice';
import filesReducer from './reducer/files';
import global from './reducer/global';
import header from './reducer/headerState';
import libraryMedia from './reducer/libraryFileUpload';
import managedUsers from './reducer/managed-users';
import managedAccounts from './reducer/managedAccounts';
import managerFaqs from './reducer/manager-faqs';
import memberPost from './reducer/member-post';
import orders from './reducer/mypurchase';
import profileOrders from './reducer/Orders';
import popslice from './reducer/popSlice';
import profileVisitor from './reducer/profileVisitor';
import purchaseOrders from './reducer/purchaseOrder';
import ruleReducer from './reducer/rule';
import salesSlice from './reducer/salesState';
import scheduledMessaging from './reducer/scheduledMessaging';
import slider from './reducer/slider';
import stateModal from './reducer/statisticsModelState';
import supportSlice from './reducer/support';
import task from './reducer/task';
import teamManagedUsers from './reducer/teamManager';
import theme from './reducer/theme';
import topic from './reducer/topic';
import vault from './reducer/vault';

const reducers = combineReducers({
  counter: counterReducer,
  chatSlider: chatSlider,
  slider,
  vault,
  support: supportSlice,
  stateModal: stateModal,
  membershipModel: membershipModel,
  popslice,
  header,
  orders,
  purchaseOrders,
  profileOrders,
  mysales: salesSlice,
  appTheme: appTheme,
  eventSlice,
  bottomNav,
  profileVisitor: profileVisitor,
  chat: persistReducer(
    {
      key: 'chat',
      storage: localforage,
      whitelist: ['subscriptions'],
    },
    chatReducer,
  ),
  fileGroups: filesReducer,
  libraryMedia,
  scheduledMessaging: scheduledMessaging,
  rule: ruleReducer,
  managedUsers,
  teamManagedUsers,
  managedAccounts,
  managerFaqs,
  task,
  global,
  checkout,
  theme,
  memberPost,
  cardModal,
  topic,
});

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: localforage,
    whitelist: [],
    blacklist: ['chat'],
  },
  reducers,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
