import React from 'react';
import '../style/Sidebar.css'

const Sidebar = ({ selectedNode }) => (
  <div className="sidebar">
    {selectedNode ? (
      <table className="table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(selectedNode).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="empty-message">Select a node to see its details.</p>
    )}
  </div>
);

export default Sidebar;
