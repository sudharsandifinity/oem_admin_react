import {
  ThemeProvider,
} from "@ui5/webcomponents-react";
import FormConfigProvider from "./Components/Context/FormConfigContext";
import "@ui5/webcomponents/dist/Assets.js";
import "@ui5/webcomponents-fiori/dist/Assets.js";
import { Provider } from "react-redux";
import store from "./store/store";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <FormConfigProvider>
          <AppRoutes />
        </FormConfigProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
