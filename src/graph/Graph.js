//https://visjs.github.io/vis-network/examples/ (creating the graph)
//https://www.npmjs.com/package/html2canvas/v/1.4.1 (creating screenshots)


import '../style/Graph.css';
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Network } from 'vis-network';
import '../style/Graph.css';
import Controls from './Controls';
import Sidebar from './Sidebar';
import Legend from './Legend';
import { networkOptions } from './NetworkOptions';

const Graph = ({ nodesData, edgesData }) => {
  const graphContainerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const networkRef = useRef(null);

  useEffect(() => {
    if (nodesData && edgesData && graphContainerRef.current) {
      setSelectedNode(null);
  
      const nodes = nodesData.map((node) => ({
        id: node.id,
        label: node.type === 'reaction' ? '' : node.label,
        smiles: node.smiles,
        type: node.type,
        formula: node.formula,
        title: `ID: ${node.id}\nLabel: ${node.label}`,
        color: node.type === 'reaction' ? '#e74c3c' : '#3498db',
        shape: 'ellipse',
      }));
  
      const edges = edgesData.map((edge) => {
        const fromType = nodesData.find((node) => node.id === edge.from)?.type;
        const toType = nodesData.find((node) => node.id === edge.to)?.type;
  
        const edgeColor =
          fromType === 'molecule' && toType === 'reaction'
            ? { color: '#3498db', highlight: '#1f77b4', opacity: 0.8 } 
            : { color: '#e74c3c', highlight: '#f39c12', opacity: 0.8 } 
            
  
        return {
          from: edge.from,
          to: edge.to,
          arrows: 'to',
          color: edgeColor,
          width: 2,
          smooth: { type: 'dynamic' },
        };
      });
  
      const network = new Network(graphContainerRef.current, { nodes, edges }, networkOptions);
      networkRef.current = network;
  
      network.on('selectNode', (event) => {
        const nodeId = event.nodes[0];
        const selected = nodesData.find((node) => node.id === nodeId);
        setSelectedNode(selected);
      });
  
      return () => {
        network.off('selectNode');
        network.destroy();
      };
    }
  }, [nodesData, edgesData]);
  
  useEffect(() => {
    const network = networkRef.current;
    if (network) network.fit({ animation: true });
  }, [isFullscreen]);

  return (
    <div className={`graph-container ${isFullscreen ? 'fullscreen' : ''}`}>
      <Controls
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        networkRef={networkRef}
        graphContainerRef={graphContainerRef}
      />
      
      <div ref={graphContainerRef} className="graph-view" />
      <Legend />
      <Sidebar selectedNode={selectedNode} />
      
    </div>
  );
};

export default Graph;
