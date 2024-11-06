let nodeIdCounter = 0; 
let edgeIdCounter = 0;



// Parse reaction formula and create nodes and edges
export const parseReaction = (reaction) => {
  const newNodes = [];
  const newEdges = [];
  const nodeMap = {}; 

  const reactions = reaction.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  for (const reactionLine of reactions) {
    const [reactants, products] = reactionLine.split('=').map(part => part.trim());
    
    if (!products) {
      console.error("No products found in the reaction:", reactionLine);
      continue;
    }

    const reactantNodes = reactants.split('+').map(r => r.trim());
    const productNodes = products.split('+').map(p => p.trim());

    // Create or retrieve nodes for reactants and products only
    for (const name of [...reactantNodes, ...productNodes]) {
      if (!nodeMap[name]) {
        const newNode = { id: nodeIdCounter++, label: name };
        newNodes.push(newNode);
        nodeMap[name] = newNode;
      }
    }

    // Create edges directly between reactants and products
    reactantNodes.forEach((r) => {
      productNodes.forEach((p) => {
        const fromNode = nodeMap[r];
        const toNode = nodeMap[p];

        if (!newEdges.some(edge => edge.from === fromNode.id && edge.to === toNode.id)) {
          newEdges.push({
            id: edgeIdCounter++,
            from: fromNode.id,
            to: toNode.id
          });
        }
      });
    });
  }

  return { newNodes, newEdges };
};


// Find the shortest path between two nodes
export const findShortestPath = (startNode, endNode, nodes, edges) => {
  const queue = [[startNode]];
  const visited = new Set();

  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];

    if (node === endNode) return path;  

    if (!visited.has(node)) {
      visited.add(node);

      edges
        .filter(edge => edge.from === node)
        .forEach(edge => {
          queue.push([...path, edge.to]);
        });
    }
  }
  return null; 
};



// Perform a reaction pathway search and return sampled pathways
export const searchReactionPathways = (startNodeLabel, endNodeLabel, nodes, edges) => {
  // Find node IDs for start and end based on labels
  const startNode = nodes.find(node => node.label === startNodeLabel)?.id;
  const endNode = nodes.find(node => node.label === endNodeLabel)?.id;

  if (startNode === undefined || endNode === undefined) {
    console.error("Start or end node not found in the network.");
    return [];
  }

  // Find the shortest path from startNode to endNode
  const path = findShortestPath(startNode, endNode, nodes.map(node => node.id), edges);

  if (!path) {
    console.warn("No pathway found between the specified nodes.");
    return [];
  }

  
};


// Add reaction and update nodes/edges
export const addReaction = (reaction, setNodes, setEdges) => {
  const { newNodes, newEdges } = parseReaction(reaction);
  
  setNodes((prevNodes) => [
    ...prevNodes,
    ...newNodes.filter((n) => !prevNodes.some((node) => node.label === n.label)), 
  ]);

  setEdges((prevEdges) => [
    ...prevEdges,
    ...newEdges,
  ]);
};
