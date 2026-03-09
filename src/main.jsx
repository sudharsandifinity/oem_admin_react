import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";
import "../src/assets/themes/marine_blue.css"

setTheme("sap_horizon");

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);