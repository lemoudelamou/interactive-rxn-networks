//https://visjs.github.io/vis-network/docs/network/
//https://visjs.github.io/vis-network/examples/
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Network } from 'vis-network/standalone';
import { searchReactionPathways } from '../utils/ReactionUtils';
import '../style/Graph.css'
import 'bootstrap/dist/css/bootstrap.min.css';


const Graph = ({ nodes, edges }) => {
  const graphRef = useRef(null);
  const networkRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [relatedEdges, setRelatedEdges] = useState([]);

  const data = useMemo(() => ({ nodes, edges }), [nodes, edges]);

  const options = useMemo(() => ({
    physics: false,
    layout: {
      improvedLayout: true,
    },
    nodes: {
      shape: 'box',
      size: 40,
      font: {
        color: 'black'
      },
    },
    edges: {
      arrows: {
        to: { enabled: true, scaleFactor: 1.2, smooth: false },
      },
      color: { color: 'gray' },
    },
    manipulation: {
      enabled: true,
      addNode: (data, callback) => {
        const title = prompt("Enter node title:");
        if (title) {
          data.label = title;
          callback(data);
        } else {
          callback(null);
        }
      },
      deleteNode: (data, callback) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this node?");
        if (confirmDelete) {
          callback(data);
        } else {
          callback(null);
        }
      },
      editNode: (data, callback) => {
        const newLabel = prompt("Edit node title:", data.label);
        if (newLabel !== null) {
          data.label = newLabel;
          callback(data);
          setSelectedNode(prev => prev?.id === data.id ? { ...prev, label: newLabel } : prev);
        } else {
          callback(null);
        }
      },
    },
  }), []);

  useEffect(() => {
    networkRef.current = new Network(graphRef.current, data, options);

    // Click event to handle node/edge selection and pathway highlight
    networkRef.current.on("click", (params) => {
      if (params.nodes.length) {
        const nodeId = params.nodes[0];
        const nodeData = nodes.find(node => node.id === nodeId);
        setSelectedNode(nodeData);
        setSelectedEdge(null);

        // Find the pathway from selected node and highlight it
        const pathway = searchReactionPathways(nodeData.label, nodes, edges);
        setRelatedEdges(pathway);

        const edgeIds = pathway.map(edge => edge.id);
        networkRef.current.setOptions({
          edges: {
            color: { color: 'gray' }, 
          }
        });
        
      } else if (params.edges.length) {
        const edgeId = params.edges[0];
        const edgeData = edges.find(edge => edge.id === edgeId);
        setSelectedEdge(edgeData);
        setSelectedNode(null);
        setRelatedEdges([]);
      } else {
        setSelectedNode(null);
        setSelectedEdge(null);
        setRelatedEdges([]);
      }
    });

    return () => {
      networkRef.current.destroy();
    };
  }, [data, options, nodes, edges, searchReactionPathways]);

  return (
    <div className="graph-container">
      <div ref={graphRef} className="graph-view" />
      <div className="sidebar">
        {selectedNode ? (
          <>
            <table class="table">
            <thead>
                <tr>
                  <th>Property</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{selectedNode.id}</td>
                </tr>
                <tr>
                  <td>Label</td>
                  <td>{selectedNode.label}</td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <p className="empty-message">Select a node to see its details.</p>
        )}
      </div>
    </div>
  );
};

export default Graph;