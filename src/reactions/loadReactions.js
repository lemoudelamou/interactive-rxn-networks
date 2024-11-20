export async function loadReactionsFromFile(uploadedFile) {
    console.log("Loading reactions and edges from uploaded file:", uploadedFile.name);
  
    try {
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(uploadedFile);
      });
  
      const moleculePattern = /(\d+) \[\s*type=(molecule)\s*ID=(\d+)\s*smiles\s*=\s*"?([^"\s]+)"?\s*formula="?([^ ]+)"?\s*RXNID="?([^ ]*)"?\s*\];/g;
      const reactionPattern = /(\d+) \[\s*type=(reaction)\s*ID=None\s*smiles\s*=\s*"?([^"\s]+)"?\s*formula="?([^"]+)"?\s*RXNID="?([^ ]*)"?\s*];/g;
      const edgePattern = /(\d+) -> (\d+);/g;
  
      const extractMatches = (pattern, mapper) =>
        [...data.matchAll(pattern)].map(mapper);
  
      const extractedMolecules = extractMatches(moleculePattern, (match) => {
        const [, id, type, moleculeID, smiles, formula, rxnID] = match;
        return { id, type, moleculeID, smiles, formula, rxnID };
      });
  
      const extractedReactions = extractMatches(reactionPattern, (match) => {
        const [, id, type, smiles, formula, rxnID] = match;
        return { id, type, moleculeID: null, smiles, formula, rxnID };
      });
  
      const edges = extractMatches(edgePattern, (match, index) => {
        const [, from, to] = match;
        return { id: index, from: parseInt(from), to: parseInt(to) };
      });
  
      return { extractedData: [...extractedMolecules, ...extractedReactions], edges };
    } catch (error) {
      console.error("Error loading reaction data:", error);
      return null;
    }
  }
  