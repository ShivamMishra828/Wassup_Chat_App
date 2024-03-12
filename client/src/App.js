// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
import ThemeSettings from "./components/settings";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <ThemeProvider>
        <ThemeSettings>
          {" "}
          <Router />{" "}
        </ThemeSettings>
      </ThemeProvider>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
