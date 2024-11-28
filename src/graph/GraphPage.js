import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import Graph from "../graph/Graph.js";
import "../style/GraphPage.css"; 

const GraphPage = () => {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const {fileName = [] ,edges = [], extractedData = [] } = location.state || {}; 

  const [nodes, setNodes] = useState([]);
  const [graphEdges, setGraphEdges] = useState([]);

  useEffect(() => {
    const newNodes = extractedData.map((item) => ({
      id: item.id,
      label: item.formula,
      smiles: item.smiles,
      type: item.type,
      rxnID: item.rxnID
    }));

    const newEdges = edges.map((edge) => {
        
      
        return {
          from: edge.from,
          to: edge.to,
          label: `Edge ${edge.id}`,  
          arrows: 'to',             
          width: 2,                 
          smooth: { type: 'dynamic' },  
        };
      });
      
      


    setNodes(newNodes);
    setGraphEdges(newEdges);
  }, [edges, extractedData]);

  return (
    <div className="graph-page">
      <h1>Graph Visualization</h1>
      <Graph nodesData={nodes} edgesData={graphEdges} /> 
      <button className="back-button" onClick={() => navigate(-1)}>
        Back to Graph List
      </button>
    </div>
  );
};

export default GraphPage;
