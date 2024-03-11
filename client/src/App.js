// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
import ThemeSettings from "./components/settings";
import { Snackbar } from "@mui/material";
import { forwardRef } from "react";
import MuiAlert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { CloseSnackbar } from "./redux/slices/app";

const vertical = "bottom";
const horizontal = "center";
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const { open, message, severity } = useSelector(
    (state) => state.app.snackbar
  );
  const dispatch = useDispatch();
  return (
    <>
      <ThemeProvider>
        <ThemeSettings>
          {" "}
          <Router />{" "}
        </ThemeSettings>
      </ThemeProvider>
      {message && open ? (
        <Snackbar
          anchorOrigin={{
            vertical,
            horizontal,
          }}
          open={open}
          autoHideDuration={4000}
          key={vertical + horizontal}
          onClose={() => {
            dispatch(CloseSnackbar());
          }}
        >
          <Alert
            onClose={() => {
              dispatch(CloseSnackbar());
            }}
            severity={severity}
            sx={{
              width: "100%",
            }}
          >
            {message}
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}
    </>
  );
}

export default App;
