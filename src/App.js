import './App.css';
import React, { useEffect, useState } from 'react';
import Graph from './graph/Graph.js';
import logo from './assets/logo-Haber.png'
import '@fortawesome/fontawesome-free/css/all.min.css';
import FileUpload from './utils/FileUpload.js';
import Modal from './utils/Modal.js';
import Image from 'react-bootstrap/Image';


function App() {

  const currentYear = new Date().getFullYear();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);


  return (
    <div className="App"> 
      <header className="header">
        <Image src={logo} alt="Logo" className="logo" roundedCircle/>
        <h1 className="title-box">Chemical Reaction Network Explorer</h1>
        <button className="instruction-button" onClick={handleOpen}>
                <i className="fa-regular fa-circle-question" style={{ fontSize: 30 }}></i>
            </button>
        <Modal className="instruction-button" open={isModalOpen} onClose={handleClose}/>
    </header>
    <body className="App-header">
      <div>    
        <FileUpload setNodes={setNodes} setEdges={setEdges} />
      </div>
      
      <Graph nodesData={nodes} edgesData={edges} />
    </body>
    <footer>
      <div class="footer-container">
        <div class="footer-left">
          <p>&copy; {currentYear} Fritz-Haber-Institut. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
  );
}

export default App;
