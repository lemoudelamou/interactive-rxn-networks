import React, { useState, useEffect } from 'react';
import '../style/Sidebar.css';

const Sidebar = ({ selectedNode, tableData, tofCoverageData, highlightToggled}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

  useEffect(() => {
    console.log('Selected Node:', selectedNode);
  }, [selectedNode]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
 

  const renderTables = () => (
    <>
      <div className='formate'>
        <h3>Node Details</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {selectedNode ? (
              Object.entries(selectedNode)
                .filter(([key, value]) => value !== null && key !== 'isHighlighted' && key !== 'rateControl' && key !== 'TOF' && key !== 'coverage' && key !== 'originalHighlight')
                .map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="2" className="empty-message">Select a node to see its details.</td>
              </tr>
            )}
          </tbody>
        </table>

        <h3>TOF & Coverage & Species</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {tofCoverageData.length > 0 ? (
              tofCoverageData.map(({ property, value }) => (
                <tr key={property}>
                  <td>{property}</td>
                  <td>{value}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No TOF or Coverage Data Available</td>
              </tr>
            )}
          </tbody>
        </table>

        {highlightToggled && (
          <>
            <h3>Rate Control Data</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Compound</th>
                  <th>Property</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map(({ compound, properties }) =>
                    properties
                      .filter(({ label }) => label !== 'smiles') // filter out 'smiles' data
                      .map(({ label, value }) => (
                        <tr key={`${compound}-${label}`}>
                          <td>{compound}</td>
                          <td>{label}</td>
                          <td>{value}</td>
                        </tr>
                      ))
                  )
                ) : (
                  <tr>
                    <td colSpan="3">No Rate Control Data Available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );

  return (
    <div className="sidebar-container">
      <div className={` ${isSidebarOpen ? 'active' : ''}`} />

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}>
        {renderTables()}

          
        
      </div>
    </div>
  );
};

export default Sidebar;
