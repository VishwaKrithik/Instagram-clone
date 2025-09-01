import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedChatter: null,
    onlineUsers: [],
    messages: []
  },
  reducers: {
    setSelectedChatter: (state, action) => {
      state.selectedChatter = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    }
  },
});

export const { setSelectedChatter, setOnlineUsers, setMessages } = chatSlice.actions;
export default chatSlice.reducer;