import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebar: {
    open: false,
    type: "CONTACT",
  },
  snackbar: {
    open: null,
    message: null,
    severity: null,
  },
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
    openSnackbar(state, action) {
      state.snackbar.open = true;
      state.snackbar.message = action.payload.message;
      state.snackbar.severity = action.payload.severity;
    },
    closeSnackbar(state, action) {
      state.snackbar.open = false;
      state.snackbar.message = null;
      state.snackbar.severity = null;
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

export function OpenSnackbar({ message, severity }) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.openSnackbar({ message, severity }));

    setTimeout(() => {
      dispatch(slice.actions.closeSnackbar());
    }, 4000);
  };
}

export function CloseSnackbar() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.closeSnackbar());
  };
}
