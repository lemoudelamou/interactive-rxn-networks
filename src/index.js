import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.js';
import GraphList from './graph/GraphList.js';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Graph from './graph/Graph.js';
import GraphPage from './graph/GraphPage.js';



function AppRouter() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/graph" element={<Graph />} />
        <Route path="/graph-list" element={<GraphList />} />
        <Route path="/graph-page" element={<GraphPage />} /> {/* Graph page */}

      </Routes>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <BrowserRouter>
          <AppRouter/>
      </BrowserRouter>
);
