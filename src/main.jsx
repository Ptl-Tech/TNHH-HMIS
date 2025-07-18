import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import store from './store.js';
import { SpeedInsights } from "@vercel/speed-insights/react"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#0060a3',
            colorPrimaryBg: '#0060a3',
            // Keeping colorIcon as is
            colorIcon: '#FAFAFA',
          },
          components: {
            Menu: {
              itemSelectedBg: '#ac8342',
              itemColor: '#ffffff', // Updated to white
              itemSelectedColor: '#ffffff', // Keeps the selected item text white
              itemHoverBg: 'rgba(172, 131, 66, 0.6)',
              itemHoverColor: '#ffffff', // Keeps hover text white
            },
            Table: {
              headerBg: '#0f5689',
              headerColor: '#FAFAFA',
              headerCellBg: '#0f5689',
             // headerCellColor: '#FAFAFA',
              headerCellHoverBg: '#ac8342',
              headerCellHoverColor: '#ffffff',
              headerCellHoverBorder: '#ac8342',
              rowSelectedBg: '#ac8342',
            rowHoverBg: 'transparent', // No hover effect
            rowHoverColor: '#0f5689', // Keeps hover text white

            },
          },
        }}
      >
        <Provider store={store}>
          <App />
          <SpeedInsights />
        </Provider>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
);
