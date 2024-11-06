import './App.css';
import React, { useState } from 'react';
import Graph from './components/Graph';
import InputForm from './components/InputForm';
import useReactionNetwork from './utils/UseReactionNetwork';
import logo from './assets/logo-Haber.png'

const App = () => {
  const { nodes, edges, handleAddReaction } = useReactionNetwork();

  return (
    <div>
      <header className="header">
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="title-box">Chemical Reaction Network Explorer</h1>
      <button className="instruction-button" onClick=''>
        Instructions
      </button>
    </header>
    <body className='page-container'>
      <InputForm onAddReaction={handleAddReaction} />
      <Graph nodes={nodes} edges={edges} />
    </body>
    <footer>
      <div class="footer-container">
        <div class="footer-left">
          <p>&copy; 2024 Fritz-Haber-Institut. All rights reserved.</p>
        </div>
        
    </div>
</footer>

    </div>
  );
};

export default App;