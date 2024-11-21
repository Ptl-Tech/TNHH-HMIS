import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import store from './store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0060a3',
          colorBorder:'#62c1db',
          colorPrimaryBg	:'#0060a3',
         // colorText:'#000',
          colorIcon:'#FAFAFA'
        },
        components: {
          Menu: {
            itemSelectedBg: '#ac8342',
            itemColor: '#000',
            itemSelectedColor: '#000',
            itemHoverBg: 'rgba(172, 131, 66, 0.6)', // Updated to match itemSelectedBg
            itemHoverColor: '#000',
        },
      },
    }}>
    <Provider store={store}>
    <App />
    </Provider>
    </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)
