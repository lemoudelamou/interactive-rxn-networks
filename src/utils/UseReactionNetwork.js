import { useState } from 'react';
import { addReaction } from './ReactionUtils';

const useReactionNetwork = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const handleAddReaction = (reaction) => {
    addReaction(reaction, setNodes, setEdges);
  };

  return { nodes, edges, handleAddReaction };
};

export default useReactionNetwork;
