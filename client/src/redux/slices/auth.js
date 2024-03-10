import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

const initialState = {
  isLoggedIn: false,
  token: "",
  isLoading: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = "";
    },
  },
});

export default slice.reducer;

export function LoginUser(formValue) {
  return async (dispatch, getState) => {
    await axios
      .post(
        "api/v1/auth/login",
        { ...formValue },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(`Response: ${response}`);
        dispatch(
          slice.actions.login({
            isLoggedIn: true,
            token: response.data.token,
          })
        );
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  };
}
