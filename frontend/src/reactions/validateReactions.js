export function validateReactionData(reactionData) {
    if (!reactionData) {
      console.warn("No reactions data available.");
      throw new Error("No reactions data available.");
    }
    return reactionData;
  }
  