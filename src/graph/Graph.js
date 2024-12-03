//https://visjs.github.io/vis-network/examples/ (creating the graph)
//https://www.npmjs.com/package/html2canvas/v/1.4.1 (creating screenshots)


import '../style/Graph.css';
import React, { useEffect, useRef, useState } from 'react';
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

  const initializeNetwork = () => {

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
    const edges = edgesData.map((edge) => ({
      from: edge.from,
      to: edge.to,
      arrows: 'to',
      width: 2,
      smooth: { type: 'dynamic' },
    }));

    const network = new Network(
      graphContainerRef.current,
      { nodes, edges },
      networkOptions
    );

    networkRef.current = network;

    network.on('selectNode', (event) => {
      const nodeId = event.nodes[0];
      const selected = nodesData.find((node) => node.id === nodeId);
      setSelectedNode(selected);
    });

    return network;
  };


  useEffect(() => {
    if (nodesData && edgesData && graphContainerRef.current) {
      const network = initializeNetwork();

      return () => {
        network.off('selectNode');
        network.destroy();
      };
    }
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
      <Sidebar selectedNode={selectedNode} />
      
    </div>
  );
};

export default Graph;
