import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.js';
import GraphList from './graph/GraphList.js';
import './index.css';
import reportWebVitals from './reportWebVitals';
import GraphPage from './graph/GraphPage.js';
import { PickleProvider } from "./context/FileDataContext";



function AppRouter() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/graph-list" element={<GraphList />} />
        <Route path="/graph-page" element={<GraphPage />} /> 

      </Routes>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <BrowserRouter>
      <PickleProvider>
          <AppRouter/>
      </PickleProvider>
      </BrowserRouter>
);
