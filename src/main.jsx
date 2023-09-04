import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import './index.css'
import { store, persistor } from './store/store.jsx';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
      <BrowserRouter>
        <PersistGate persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
        </PersistGate>
      </BrowserRouter>
    {/* </React.StrictMode> */}
  </Provider>
)
