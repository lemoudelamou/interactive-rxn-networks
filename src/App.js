import './App.css';
import React, { useState } from 'react';
import Graph from './graph/Graph.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import FileUpload from './utils/FileUpload.js';
import Header from './components/Header.js'
import Footer from './components/Footer.js'


function App() {

  const currentYear = new Date().getFullYear();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

   


  return (
    <div className="App"> 
        <Header/>
      <div>    
        <FileUpload setNodes={setNodes} setEdges={setEdges} />
      </div>
      
      <Graph nodesData={nodes} edgesData={edges} />
      <Footer/>
  </div>
  );
}

export default App;
