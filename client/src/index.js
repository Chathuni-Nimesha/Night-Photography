import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/global.css";
import "./styles/antd-nightlife.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { store } from "./Redux/Store/Store";
import theme from "./theme/chakraTheme";
import { nightlifeAntdTheme } from "./theme/antdTheme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <ConfigProvider theme={nightlifeAntdTheme}>
          <Provider store={store}>
            <App />
          </Provider>
        </ConfigProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
