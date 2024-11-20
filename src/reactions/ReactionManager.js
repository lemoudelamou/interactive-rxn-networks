import { loadReactionsFromFile } from "./loadReactions";
import { validateReactionData } from "./validateReactions";
import { createEdges } from "./createEdges";
import { addReaction } from "./addReaction";

class ReactionManager {
  async loadReactionsFromFile(...args) {
    return loadReactionsFromFile(...args);
  }

  validateReactionData(...args) {
    return validateReactionData(...args);
  }

  createEdges(...args) {
    return createEdges(...args);
  }

  async addReaction(...args) {
    return addReaction(...args);
  }
}

export const reactionManager = new ReactionManager();
