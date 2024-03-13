import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

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

        window.localStorage.setItem("user_id", response.data.user_id);

        dispatch(
          toast.success(response.data.message, {
            duration: 4000,
          })
        );
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        dispatch(
          toast.error(err.response.data.message, {
            duration: 4000,
          })
        );
      });
  };
}

export function LogoutUser() {
  return async (dispatch, getState) => {
    window.localStorage.removeItem("user_id");
    dispatch(slice.actions.logout());
    dispatch(
      toast.success("Logged out successfully", {
        duration: 4000,
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
          toast.success(response.data.message, {
            duration: 4000,
          })
        );
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        dispatch(
          toast.error(err.response.data.message, {
            duration: 4000,
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
          slice.actions.login({
            isLoggedIn: true,
            token: response.data.token,
          })
        );
        dispatch(
          toast.success(response.data.message, {
            duration: 4000,
          })
        );
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        dispatch(
          toast.error(err.response.data.message, {
            duration: 4000,
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
          }),

          toast.success(response.data.message)
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
          toast.error(err.response.data.message, {
            duration: 4000,
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

        window.localStorage.setItem("user_id", response.data.user_id);

        dispatch(
          toast.success(response.data.message, {
            duration: 4000,
          })
        );
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        dispatch(
          toast.error(err.response.data.message, {
            duration: 4000,
          })
        );
      });
  };
}
