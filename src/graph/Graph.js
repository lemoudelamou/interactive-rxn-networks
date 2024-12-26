import '../style/Graph.css';
import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import Controls from './Controls';
import Legend from './Legend';
import { networkOptions } from '../utils/NetworkOptions';

const Graph = ({ nodesData, edgesData, onNodeSelect }) => {
  const graphContainerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const networkRef = useRef(null);

  const initializeNetwork = () => {
    const nodes = nodesData.map((node) => ({
      id: node.id,
      label: node.type === 'reaction' ? '' : node.formula,
      smiles: node.smiles,
      type: node.type,
      formula: node.formula,
      title: `ID: ${node.id}\nLabel: ${node.label}`,
      color: node.isHighlighted
        ? '#3f8176' 
        : node.type === 'reaction'
        ? '#e74c3c' 
        : '#3498db', 
      shape: 'ellipse',
      borderWidth: node.isHighlighted ? 3 : 1,
    }));

    const edges = edgesData.map((edge) => ({
      from: edge.from,
      to: edge.to,
      arrows: 'to',
      width: edge.isHighlighted ? 10 : 2,
      color: edge.isHighlighted ? { color: '#3f8176' } : { color: '#000000' },
      smooth: { type: 'dynamic' },
    
    
    
    
    }));

   

    const network = new Network(graphContainerRef.current, { nodes, edges }, networkOptions);
    networkRef.current = network;

   // Handle node selection
   network.on('selectNode', (event) => {
    const nodeId = event.nodes[0];
    const selected = nodesData.find((node) => node.id === nodeId);
    onNodeSelect(selected);
  });

  network.on('deselectNode', () => {
    onNodeSelect(null);
  });

    return network;
  };

  useEffect(() => {
    if (nodesData && edgesData && graphContainerRef.current) {
      const network = initializeNetwork();

      return () => {
        if (network) {
          network.destroy();
        }
      };
    }
  }, [nodesData, edgesData]);

  useEffect(() => {
    setSelectedNode(null); 
  }, [nodesData, edgesData]);

  useEffect(() => {
    if (networkRef.current) {
      networkRef.current.fit({ animation: true });
    }
  }, [isFullscreen]);

  return (
    <div className={`graph-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <Controls
        className="controls"
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        networkRef={networkRef}
        graphContainerRef={graphContainerRef}
        
      />
      <div ref={graphContainerRef} className="graph-view" />
      <Legend />
    </div>
  );
};

export default Graph;






