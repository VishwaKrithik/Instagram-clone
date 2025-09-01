import { createSlice } from "@reduxjs/toolkit";

const RTNSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotifications: [],
  },
  reducers: {
    setLikeNotifications: (state, action) => {
      if (action.payload.type === "like") {
        console.log("Like");
        state.likeNotifications.push(action.payload)
      } else if (action.payload.type === "dislike") {
        console.log("Dislike");
        state.likeNotifications = state.likeNotifications.filter((item) => item.userId !== action.payload.userId);
      }
    },
  },
});

export const { setLikeNotifications } = RTNSlice.actions;
export default RTNSlice.reducer;