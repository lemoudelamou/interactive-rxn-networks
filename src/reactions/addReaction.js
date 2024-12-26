import { reactionManager } from "./ReactionManager";

let previousGraphData = { nodes: [], edges: [] };

export async function addReaction(uploadedFile, pickleData, setNodes, setEdges) {
  if (!pickleData) {
    console.error("Pickle data is not loaded.");
    return;
  }


  try {
    const reactionData = await reactionManager.loadReactionsFromFile(uploadedFile, pickleData);
    reactionManager.validateReactionData(reactionData);

    const { edges: newEdges, extractedData: newNodes } = reactionData;

    if (previousGraphData.nodes.length === 0) {
      previousGraphData = { nodes: newNodes, edges: newEdges };
      setNodes(newNodes);
      setEdges(newEdges);
    } else {
      const highlightFormulas = newNodes.map((node) => node.formula);
    
      const updatedNodes = previousGraphData.nodes.map((node) => ({
        ...node,
        isHighlighted: highlightFormulas.includes(node.formula),
      }));
    
      const highlightedNodeIds = new Set(
        updatedNodes.filter((node) => node.isHighlighted).map((node) => node.id)
      );
    
      const updatedEdges = previousGraphData.edges.map((edge) => ({
        ...edge,
        isHighlighted:
          highlightedNodeIds.has(edge.from) && highlightedNodeIds.has(edge.to),
      }));
    
      setNodes(updatedNodes);  
      setEdges(updatedEdges);  
    }
    
  } catch (error) {
    console.error(`Error processing file: ${error.message}`);
  }
}
