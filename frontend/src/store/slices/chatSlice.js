import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const initialState = {
  selectedChat: null,
  allChats: [],
  notificationState: {},
  latestMessageDirectory: {},
  onlineUsers: [],
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setAllChats: (state, action) => {
      state.allChats = action.payload;
    },
    addToAllChats: (state, action) => {
      state.allChats.push(action.payload);
    },
    setChatsToDefault: (state, action) => {
      state.selectedChat = null;
      state.allChats = [];
    },
    setNotificationState: (state, action) => {
      const { notificationState } = state;
      const notificationObj = action.payload;
      state.notificationState = { ...notificationState, ...notificationObj };
    },
    setLatestMessageDirectory: (state, action) => {
      const { latestMessageDirectory } = state;
      const latestMessageObject = action.payload;
      state.latestMessageDirectory = {
        ...latestMessageDirectory,
        ...latestMessageObject,
      };
    },
    setOnline: (state, action) => {
      const { userId } = action.payload;
      state.onlineUsers.push(userId);
    },
    setOffline: (state, action) => {
      const { userId } = action.payload;
      const filteredOnlineUsers = state.onlineUsers.filter(
        (onlineUserId) => onlineUserId !== userId
      );
      state.onlineUsers = filteredOnlineUsers;
    },
  },
  extraReducers(builder) {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const {
  setSelectedChat,
  setAllChats,
  addToAllChats,
  setChatsToDefault,
  setNotificationState,
  setLatestMessageDirectory,
  setOnline,
  setOffline,
} = chatsSlice.actions;
export default chatsSlice.reducer;
