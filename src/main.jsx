import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";

import "./index.css";
import App from "./App.jsx";

import { ConfigProvider } from "antd";
import { SpeedInsights } from "@vercel/speed-insights/react";

import store from "./store.js";
import { theme } from "./utils/theme.js";
import AuthProvider from "./hooks/auth.jsx";
import { AbilityProvider } from "./hooks/casl.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider theme={theme}>
        <ReduxProvider store={store}>
          <AuthProvider>
            <AbilityProvider>
              <App />
            </AbilityProvider>
          </AuthProvider>
          <SpeedInsights />
        </ReduxProvider>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>
);
