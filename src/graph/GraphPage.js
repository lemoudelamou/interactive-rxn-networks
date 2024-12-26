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
  const [tofCoverageData, setTofCoverageData] = useState([]);
  const [nodeDetailsData, setNodeDetailsData] = useState([]);
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

  useEffect(() => {
    if (selectedNode) {
      const tofData = data?.TOF?.find((item) => item[`${selectedNode.formula}_g`]) || {};
      const coverageData = data?.coverage?.find((item) => item[`${selectedNode.formula}_s`]) || {};
      const speciesData = data?.species_name?.find((item) => item.smiles === selectedNode.smiles) || {};

      setTofCoverageData([
        { property: "TOF", value: tofData?.TOF || "N/A" },
        { property: "Coverage", value: coverageData?.coverage || "N/A" },
        { property: "Species", value: speciesData?.label || "No matching species found" },
      ]);

      setNodeDetailsData([
        { property: "Formula", value: selectedNode.formula },
        { property: "Smiles", value: selectedNode.smiles },
      ]);
    } else {
      setTofCoverageData([]);
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
            tofCoverageData={tofCoverageData}
            highlightToggled={highlightToggled}
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
