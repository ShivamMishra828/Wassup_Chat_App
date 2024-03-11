import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { OpenSnackbar } from "./app";

const initialState = {
  isLoggedIn: false,
  token: "",
  isLoading: false,
  email: "",
  error: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateIsLoading: (state, action) => {
      state.error = action.payload.error;
      state.isLoading = action.payload.isLoading;
    },
    login: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = "";
    },
    updateRegisterEmail: (state, action) => {
      state.email = action.payload.email;
    },
  },
});

export default slice.reducer;

export function LoginUser(formValues) {
  return async (dispatch, getState) => {
    await axios
      .post(
        "/api/v1/auth/login",
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        dispatch(
          slice.actions.login({
            isLoggedIn: true,
            token: response.data.token,
          })
        );

        dispatch(
          OpenSnackbar({
            message: response.data.message,
            severity: "success",
          })
        );
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        dispatch(
          OpenSnackbar({
            message: err.response.data.message,
            severity: "error",
          })
        );
      });
  };
}

export function LogoutUser() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.logout());
    dispatch(
      OpenSnackbar({
        message: "You have been logged out",
        severity: "success",
      })
    );
  };
}

export function ForgotPassword(formValues) {
  return async (dispatch, getState) => {
    await axios
      .post(
        "/api/v1/auth/forgot-password",
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        dispatch(
          OpenSnackbar({ message: response.data.message, severity: "success" })
        );
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        dispatch(
          OpenSnackbar({
            message: err.response.data.message,
            severity: "error",
          })
        );
      });
  };
}

export function NewPassword(formValues) {
  return async (dispatch, getState) => {
    await axios
      .post(
        "/api/v1/auth/reset-password",
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(`Response: ${response}`);
        dispatch(
          OpenSnackbar({ message: response.data.message, severity: "success" })
        );
        dispatch(
          slice.actions.login({
            isLoggedIn: true,
            token: response.data.token,
          })
        );
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        dispatch(
          OpenSnackbar({
            message: err.response.data.message,
            severity: "error",
          })
        );
      });
  };
}

export function RegisterUser(formValues) {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.updateIsLoading({
        isLoading: true,
        error: false,
      })
    );
    await axios
      .post(
        "/api/v1/auth/register",
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        dispatch(
          slice.actions.updateRegisterEmail({
            email: formValues.email,
          })
        );
        dispatch(
          slice.actions.updateIsLoading({
            isLoading: false,
            error: false,
          })
        );
        dispatch(
          OpenSnackbar({ message: response.data.message, severity: "success" })
        );
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        dispatch(
          slice.actions.updateIsLoading({
            isLoading: false,
            error: true,
          })
        );
        dispatch(
          OpenSnackbar({
            message: err.response.data.message,
            severity: "error",
          })
        );
      })
      .finally(() => {
        if (!getState().auth.error) {
          window.location.href = "/auth/verify";
        }
      });
  };
}

export function VerifyUser(formValues) {
  return async (dispatch, getState) => {
    await axios
      .post(
        "/api/v1/auth/verify",
        { ...formValues },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        dispatch(
          slice.actions.login({
            isLoggedIn: true,
            token: response.data.token,
          })
        );
        dispatch(
          OpenSnackbar({ message: response.data.message, severity: "success" })
        );
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        dispatch(
          OpenSnackbar({
            message: err.response.data.message,
            severity: "error",
          })
        );
      });
  };
}
