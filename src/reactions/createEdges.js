export function createEdges(edgesFromFile, extractedData, setNodes, setEdges) {
    const moleculeLookup = extractedData.reduce((lookup, molecule) => {
      lookup[molecule.id] = molecule;
      return lookup;
    }, {});
  
    console.log("Molecule Lookup:", moleculeLookup);
  
    const addNodeIfNeeded = (nodeData, prevNodes) => {
      const existingNodeIds = new Set(prevNodes.map(({ id }) => id));
      return existingNodeIds.has(nodeData.id) ? prevNodes : [...prevNodes, nodeData];
    };
  
    const result = edgesFromFile.reduce((acc, { from, to }) => {
      const nodeFrom = moleculeLookup[from];
      const nodeTo = moleculeLookup[to];
  
      if (!nodeFrom || !nodeTo) {
        throw new Error(`Data is not complete for edge from ${from} to ${to}`);
      }
  
      const fromNode = {
        id: from,
        label: nodeFrom.formula,
        type: nodeFrom.type,
        smiles: nodeFrom.smiles,
        rxnID: nodeFrom.rxnID,
      };
  
      const toNode = {
        id: to,
        label: nodeTo.formula,
        type: nodeTo.type,
        smiles: nodeTo.smiles,
        rxnID: nodeTo.rxnID,
      };
  
      acc.nodeMap = { ...acc.nodeMap, [from]: fromNode, [to]: toNode };
  
      acc.nodes = addNodeIfNeeded(fromNode, acc.nodes);
      acc.nodes = addNodeIfNeeded(toNode, acc.nodes);
  
      const edgeKey = `${from}-${to}`;
      if (!acc.edges.some((edge) => `${edge.from}-${edge.to}` === edgeKey)) {
        acc.edges = [...acc.edges, { id: acc.edges.length + 1, from, to }];
      }
  
      return acc;
    }, { nodes: [], edges: [], nodeMap: {} });
  
    setNodes((prevNodes) => [...prevNodes, ...result.nodes]);
    setEdges((prevEdges) => [...prevEdges, ...result.edges]);
  
    return result.nodeMap;
  }
  