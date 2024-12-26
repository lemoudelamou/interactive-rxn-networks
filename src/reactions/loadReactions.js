export async function loadReactionsFromFile(uploadedFile, pickleData) {

  try {
    const data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(uploadedFile);
    });


    const moleculePattern = /(\d+) \[\s*type=(molecule)\s*ID=(\d+)\s*smiles\s*=\s*"?([^"\s]+)"?\s*formula="?([^ ]+)"?\s*RXNID="?([^ ]*)"?\s*(?:level\s*=\s*(\d+))?\s*\];/g;
    const reactionPattern = /(\d+) \[\s*type=(reaction)\s*ID=None\s*smiles\s*=\s*"?([^"\s]+)"?\s*formula="?([^"]+)"?\s*RXNID="?([^ ]*)"?\s*(?:level\s*=\s*(\d+))?\s*\];/g;
    const edgePattern = /(\d+) -> (\d+);/g;

    const extractMatches = (pattern, mapper) => {
      return [...data.matchAll(pattern)].map(mapper);
    };

    const normalizeFormula = (formula) => formula.replace(/[\n\s]+$/, "").trim();

    const extractedMolecules = extractMatches(moleculePattern, (match) => {
      const [, id, type, moleculeID, smiles, formula, rxnID, level] = match;
      return {
        id: `${id}`,
        type,
        moleculeID,
        smiles,
        formula: normalizeFormula(formula),
        rxnID,
        level: level || null,
      };
    });

    const extractedReactions = extractMatches(reactionPattern, (match) => {
      const [, id, type, smiles, formula, rxnID, level] = match;
      return {
        id: `${id}`,
        type,
        moleculeID: null,
        smiles,
        formula: normalizeFormula(formula),
        rxnID,
        level: level || null,
      };
    });

    const enrichedData = [...extractedMolecules, ...extractedReactions];

    if (pickleData.data) {
      const removeUnderscoreProperties = (data) => {
        if (data && typeof data === "object") {
          const filteredObject = {};
          for (const key in data) {
            if (data.hasOwnProperty(key) && !key.startsWith("_")) {
              filteredObject[key] = data[key];
            }
          }
          return filteredObject;
        }
        return {};
      };

      const cleanedPickleData = removeUnderscoreProperties(pickleData?.data);
      const normalizedRateControlData = cleanedPickleData?.rate_control || [];
      const normalizedTOFData = cleanedPickleData?.TOF || [];
      const normalizedCoverageData = cleanedPickleData?.coverage || [];


      console.log("Enriching extracted data with pickle data...");
      enrichedData.forEach((node) => {
        const rateControlMatch = normalizedRateControlData.find((item) => item[`${node.formula}_g`]);
        if (rateControlMatch) {
          const value = rateControlMatch[`${node.formula}_g`];
          node.rateControl = typeof value === 'object' ? JSON.stringify(value) : value;
          console.log(`Rate control data found for formula "${node.formula}_g": ${node.rateControl}`);
        }
      
        const TOFMatch = normalizedTOFData.find((item) => item[`${node.formula}_g`]);
        if (TOFMatch) {
          const value = TOFMatch[`${node.formula}_g`];
          node.TOF = typeof value === 'object' ? JSON.stringify(value) : value;
          console.log(`TOF data found for formula "${node.formula}_g": ${node.TOF}`);
        }
      
        const coverageMatch = normalizedCoverageData.find((item) => item[`${node.formula}_g`]);
        if (coverageMatch) {
          const value = coverageMatch[`${node.formula}_g`];
          node.coverage = typeof value === 'object' ? JSON.stringify(value) : value;
          console.log(`Coverage data found for formula "${node.formula}_g": ${node.coverage}`);
        }
      });


      
    } else {
      console.log("Pickle data is missing or incomplete. Skipping enrichment.");
    }

   


    console.log("Extracting edges...");
    const nodeIDMap = new Map(enrichedData.map((node) => [node.id, node]));
    const edges = extractMatches(edgePattern, (match, index) => {
      const [, from, to] = match;
      const fromNode = nodeIDMap.get(`${from}`);
      const toNode = nodeIDMap.get(`${to}`);
      if (!fromNode || !toNode) {
        console.error(`Incomplete edge data: from ${from} to ${to}`);
        throw new Error(`Incomplete edge data: from ${from} to ${to}`);
      }
      return { id: index, from: fromNode.id, to: toNode.id };
    });



    return {
      extractedData: enrichedData,
      edges,
    };
  } catch (error) {
    console.error("Error loading reaction data:", error);
    return null;
  }
}
