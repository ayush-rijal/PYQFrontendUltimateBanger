// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// import axios from "axios";

// export const fetchNotifications = createAsyncThunk(
//   "notifications/fetchNotifications",
//     async () => {
//         const response = await axios.get(
//         `/notification/notifications`
//         );
//         return response.data;
//     }
// );
// const notificationsSlice = createSlice({
//     name: 'notifications',
//     initialState: {
//       items: [],
//       loading: false,
//       error: null,
//     },
//     reducers: {},
//     extraReducers(builder) {
//       builder
//         .addCase(fetchNotifications.pending, (state) => {
//           state.loading = true;
//         })
//         .addCase(fetchNotifications.fulfilled, (state, action) => {
//           state.items = action.payload;
//           state.loading = false;
//         })
//         .addCase(fetchNotifications.rejected, (state, action) => {
//           state.error = action.error.message;
//           state.loading = false;
//         });
//     },
//   });
  
//   export default notificationsSlice.reducer;




// store/notificationSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Notification {
  message: string;
  timestamp: string;
}

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    const response = await axios.get(`/notification/notifications`);
    return response.data;
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchNotifications.pending, state => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, state => {
        state.loading = false;
      });
  },
});

export default notificationSlice.reducer;
