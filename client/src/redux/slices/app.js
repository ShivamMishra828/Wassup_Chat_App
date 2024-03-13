import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  sidebar: {
    open: false,
    type: "CONTACT",
  },
  users: [],
  friends: [],
  friendRequests: [],
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleSidebar(state, action) {
      state.sidebar.open = !state.sidebar.open;
    },
    updateSidebarType(state, action) {
      state.sidebar.type = action.payload.type;
    },
    updateUsers(state, action) {
      state.users = action.payload.users;
    },
    updateFriends(state, action) {
      state.friends = action.payload.friends;
    },
    updateFriendRequests(state, action) {
      state.friendRequests = action.payload.request;
    },
  },
});

export default slice.reducer;

export function ToggleSidebar() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.toggleSidebar());
  };
}

export function UpdateSidebarType(type) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateSidebarType({ type }));
  };
}

export const FetchUsers = () => {
  return async (dispatch, getState) => {
    await axios
      .get("/api/v1/user/get-users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      })
      .then((res) => {
        dispatch(slice.actions.updateUsers({ users: res.data.data }));
      })
      .catch((error) => {
        console.log(`Error Occured while fetching users: ${error}`);
      });
  };
};

export const FetchFriends = () => {
  return async (dispatch, getState) => {
    await axios
      .get("/api/v1/user/get-friends", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      })
      .then((res) => {
        dispatch(slice.actions.updateFriends({ friends: res.data.data }));
      })
      .catch((error) => {
        console.log(`Error Occured while fetching friends: ${error}`);
      });
  };
};

export const FetchFriendRequests = () => {
  return async (dispatch, getState) => {
    await axios
      .get("/api/v1/user/get-friend-requests", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      })
      .then((res) => {
        dispatch(
          slice.actions.updateFriendRequests({ request: res.data.data })
        );
      })
      .catch((error) => {
        console.log(`Error Occured while fetching friend requests: ${error}`);
      });
  };
};
