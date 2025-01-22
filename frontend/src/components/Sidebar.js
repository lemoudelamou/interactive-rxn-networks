import React, { useState, useEffect } from "react";
import "../style/Sidebar.css";

const Sidebar = ({
  selectedNode,
  tableData,
  tofData,
  coverageData,
  nodeDetailsData,
  highlightToggled,
  highlightedFormulas,
  allData
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const formatValue = (value) => {
    if (typeof value !== "number") return value; 
    if (Math.abs(value) < 0.001) {
      return value.toExponential(3); 
    }
    return value.toFixed(3); 
  };

  useEffect(() => {
    console.log("Selected Node:", selectedNode);
  }, [selectedNode]);

  console.log("formula: ", highlightedFormulas)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderRateControlTable = () => {
    if (!tableData || tableData.length === 0) {
      console.log("No tableData available.");
      return (
        <table className="table">
          <tbody>
            <tr>
              <td colSpan="3">No Rate Control Data Available</td>
            </tr>
          </tbody>
        </table>
      );
    }

 
    
  
    const nodeWithHighestLevel = allData.reduce((highest, current) =>
      (current.level || 0) > (highest.level || 0) ? current : highest
    );
  
    console.log("Node with Highest Level:", nodeWithHighestLevel);
  
    if (!nodeWithHighestLevel.formula) {
      console.log("No formula found in the highest level node.");
      return (
        <table className="table">
          <tbody>
            <tr>
              <td colSpan="3">No Rate Control Data Available</td>
            </tr>
          </tbody>
        </table>
      );
    }
  
    const highestLevelFormula = nodeWithHighestLevel.formula;
    console.log("Highest Level Formula:", highestLevelFormula);
  
    const compoundPropertiesMap = {};
  
    tableData.forEach(({ compound, properties }) => {
      if (compound.replace("_g", "") === highestLevelFormula) {
        if (!compoundPropertiesMap[compound]) {
          compoundPropertiesMap[compound] = [];
        }
        properties
          .filter(
            ({ label }) =>
              label !== "smiles" &&
              compound !== "H2_g" &&
              compound !== "H2O_g"
          )
          .forEach(({ label, value }) => {
            compoundPropertiesMap[compound].push({ label, value });
          });
      }
    });
  
    if (Object.keys(compoundPropertiesMap).length === 0) {
      console.log("No matching compounds found.");
      return (
        <table className="table">
          <tbody>
            <tr>
              <td colSpan="3">No Rate Control Data Available</td>
            </tr>
          </tbody>
        </table>
      );
    }
  
    console.log("Filtered Compound Properties:", compoundPropertiesMap);
  
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Compound</th>
            <th>Property</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(compoundPropertiesMap).map(([compound, properties]) =>
            properties.map(({ label, value }, index) => (
              <tr key={`${compound}-${label}-${index}`}>
                <td>{index === 0 ? compound : ""}</td>
                <td>{label}</td>
                <td>{formatValue(value)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  };
  

  const renderTOFTable = () => (
    <>
      <h3>TOF Data</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          { tofData.length > 0 ? (
            tofData.map(({ label, value }, index) => (
              <tr key={index}>
                <td>{label}</td>
                <td>{formatValue(value)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No TOF Data Available</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
  
  
  const renderCoverageTable = () => (
    <>
      <h3>Coverage Data</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {coverageData && coverageData.length > 0 ? (
            coverageData.map(({ label, value }, index) => (
              <tr key={index}>
                <td>{label}</td>
                <td>{formatValue(value)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No Coverage Data Available</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
  
  const renderFormulaTable = () => (
    <>
      {highlightedFormulas.length > 0 && (
        <div>
          <h3>Subnetwork Formulas</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Formula</th>
              </tr>
            </thead>
            <tbody>
              {highlightedFormulas.map((formula, index) => (
                <tr key={index}>
                  <td>{formula}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
  
  
  const renderNodeDetailsTable = () => (
    <>
      <h3>Node Details</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Property</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {nodeDetailsData.length > 0 ? (
            nodeDetailsData.map(({ property, value }, index) => (
              <tr key={index}>
                <td>{property}</td>
                <td>{formatValue(value)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="empty-message">
                Select a node to see its details.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
  

  return (
    <div className="sidebar-container">
      <div className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`} />

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`} onClick={toggleSidebar}>
        {renderNodeDetailsTable()}

        {highlightToggled && (
          <>
            {renderFormulaTable()}
            {renderTOFTable()}
            {renderCoverageTable()}
            <h3>Rate Control Data</h3>
            {renderRateControlTable()}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
