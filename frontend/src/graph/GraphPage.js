import React, { useEffect, useState, useMemo, useContext, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Graph from "../graph/Graph.js";
import "../style/GraphPage.css";
import Sidebar from "../components/Sidebar.js";
import DataVizualisation from "./DataVizualisation.js";
import { PickleContext } from "../context/FileDataContext";

const GraphPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickleData, freeEnergyData } = useContext(PickleContext);

  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeDetailsData, setNodeDetailsData] = useState([]);
  const [highlightedFormulas, setHighlightedFormulas] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highlightToggled, setHighlightToggled] = useState(false);

  const {
    edges: initialEdges = [],
    extractedData = [],
    data = [],
    id,
    freeEnergy = [],
  } = location.state || { ...pickleData, freeEnergy: freeEnergyData };

  const toggleModal = useCallback(() => {
    setIsModalOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const initializeGraph = () => {
      const graphNodes = extractedData.map((item) => ({
        id: item.id,
        formula: item.formula,
        smiles: item.smiles,
        type: item.type,
        rxnID: item.rxnID,
        isHighlighted: false,
        originalHighlight: item.isHighlighted,
        level: item.level,
      }));

      const graphEdges = initialEdges.map((edge) => ({
        from: edge.from,
        to: edge.to,
        label: `Edge ${edge.id}`,
        isHighlighted: false,
        originalHighlight: edge.isHighlighted,
        arrows: "to",
        width: 2,
        smooth: { type: "dynamic" },
      }));

      setNodes(graphNodes);
      setEdges(graphEdges);
      setIsLoading(false);
    };

    initializeGraph();
  }, [extractedData, initialEdges]);

  const rateControlData = useMemo(() => {
    return (data?.rate_control || []).map((item) => {
      const compound = Object.keys(item)[0];
      const properties = Object.entries(item[compound]).map(([label, details]) => ({
        label,
        value: details.value,
      }));
      return { compound, properties };
    });
  }, [data]);

  console.log("rate: ", rateControlData)


  const tofData = useMemo(() => {
    return (data?.TOF || []).flatMap((item) => {
      return Object.entries(item).map(([label, value]) => {
        const extractedValue = value && value.TOF !== undefined ? value.TOF : value;
        
        const finalValue = typeof extractedValue === 'object' 
          ? JSON.stringify(extractedValue) 
          : extractedValue;
  
        return { label, value: finalValue };
      });
    });
  }, [data]);
  
  

  const coverageData = useMemo(() => {
    return (data?.coverage || []).flatMap((item) => {
      return Object.entries(item).map(([label, value]) => {
        const extractedValue = value && value.coverage !== undefined ? value.coverage : value;
        
        const finalValue = typeof extractedValue === 'object' 
          ? JSON.stringify(extractedValue) 
          : extractedValue;
  
        return { label, value: finalValue };  
      });
    });
  }, [data]);
  

  
  useEffect(() => {
    const filteredFormulas = nodes
      .filter((node) => node.isHighlighted && node.formula.includes("="))
      .map((node) => node.formula);
  
    setHighlightedFormulas(filteredFormulas);
  
    console.log("Highlighted Formulas with '=' symbol:", filteredFormulas);
  }, [nodes]); 
  
  

  useEffect(() => {
    if (selectedNode) {
      const speciesEntry = data?.species_name?.find((item) => item.smiles === selectedNode.smiles) || {};
  
      setNodeDetailsData([
        { property: "Formula", value: selectedNode.formula },
        { property: "Smiles", value: selectedNode.smiles },
        { property: "Species", value: speciesEntry?.label || "No matching species found" },
        { property: "Level", value: selectedNode.level },

      ]);
    } else {
      setNodeDetailsData([]);
    }
  }, [selectedNode, data]);
  
  

  const toggleHighlights = useCallback(() => {
    setHighlightToggled((prevState) => !prevState);
    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        isHighlighted: !highlightToggled ? node.originalHighlight : false,
      }))
    );
    setEdges((prevEdges) =>
      prevEdges.map((edge) => ({
        ...edge,
        isHighlighted: !highlightToggled ? edge.originalHighlight : false,
      }))
    );
  }, [highlightToggled]);

  const handleNavigation = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  return (
    <div className="graph-page">
      {isLoading ? (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <h1>Graph Visualization</h1>
          <Graph
            nodesData={nodes}
            edgesData={edges}
            onNodeSelect={setSelectedNode}
          />
          <Sidebar
            selectedNode={selectedNode}
            tableData={rateControlData}
            tofData={tofData}
            coverageData={coverageData}
            nodeDetailsData={nodeDetailsData}
            highlightToggled={highlightToggled}
            highlightedFormulas={highlightedFormulas}
            allData={extractedData}
          />
          {isModalOpen && (
            <DataVizualisation
              isOpen={isModalOpen}
              onClose={toggleModal}
              id={id}
            />
          )}
          <div className="button-container">
            <button className="button-style" onClick={toggleHighlights}>
              {highlightToggled ? "Hide Subnetwork" : "Show Subnetwork"}
            </button>
            <button className="button-style" onClick={toggleModal}>
              Visualize Data
            </button>
            <button
              className="button-style"
              onClick={() => handleNavigation("/graph-list")}
            >
              Back to List
            </button>
            <button
              className="button-style"
              onClick={() => handleNavigation("/")}
            >
              Create a Graph
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GraphPage;
