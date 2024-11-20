import { loadReactionsFromFile } from "./loadReactions";
import { validateReactionData } from "./validateReactions";
import { createEdges } from "./createEdges";

export async function addReaction(uploadedFile, setNodes, setEdges) {
  console.log("Adding reaction and edges for formula pathway:", uploadedFile);

  try {
    const reactionData = await loadReactionsFromFile(uploadedFile);
    validateReactionData(reactionData);

    const { edges: fileEdges, extractedData } = reactionData;
    createEdges(fileEdges, extractedData, setNodes, setEdges);
  } catch (error) {
    throw new Error(`Failed to process reaction data: ${error.message}`);
  }
}
