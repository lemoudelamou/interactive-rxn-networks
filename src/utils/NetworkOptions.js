export const networkOptions = {
  nodes: {
    font: { size: 14, color: '#ffffff' },
    size: 55,
    borderWidth: 2,
  },
  edges: {
    smooth: { type: 'continuous', forceDirection: 'none' },
    arrows: { to: { enabled: true, scaleFactor: 1.5 } },
    color: { inherit: false },
  },
  layout: {
    randomSeed: 1.5,
    improvedLayout: false, 
    
  },
  physics: {
    enabled: true,  
    solver: 'barnesHut',
    barnesHut: {
      gravitationalConstant: -4000,
      centralGravity: 0.5,
      springLength: 200,
      springConstant: 0.1,
    },
    repulsion: {
      centralGravity: 0.5,
      springLength: 550,
      springConstant: 0.1,
      nodeDistance: 250,
    },
  },
};
