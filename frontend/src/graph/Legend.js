import React from 'react';
import '../style/Legend.css';


const Legend = () => (
  <div className="legend">
    <ul>
      <li>
        <span className="legend-color" style={{ backgroundColor: '#3498db' }}></span> Molecule
      </li>
      <li>
        <span className="legend-color" style={{ backgroundColor: '#e74c3c' }}></span> Reaction
      </li>
      <li>
        <span className="legend-color" style={{ backgroundColor: '#3f8176' }}></span> Subnetwork
      </li>
      
    </ul>
  </div>
);

export default Legend;
