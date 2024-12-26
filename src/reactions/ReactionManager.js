import { loadReactionsFromFile } from "./loadReactions";
import { validateReactionData } from "./validateReactions";
import { addReaction } from "./addReaction";

class ReactionManager {
  async loadReactionsFromFile(...args) {
    return loadReactionsFromFile(...args);
  }

  validateReactionData(...args) {
    return validateReactionData(...args);
  }


  async addReaction(...args) {
    return addReaction(...args);
  }
}

export const reactionManager = new ReactionManager();
