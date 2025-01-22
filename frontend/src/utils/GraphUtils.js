import { reactionManager } from "../reactions/ReactionManager";
import ErrorMessages from "../constants/ErrorMessages"; 

export const readJsonFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        resolve(jsonData);
      } catch {
        reject(new Error(ErrorMessages.INVALID_JSON_FORMAT));
      }
    };
    reader.onerror = () => reject(new Error(ErrorMessages.ERROR_READING_FILE));
    reader.readAsText(file);
  });
};

export const handleShowGraph = async (
  pickleData,
  selectedFiles,
  selectedFilesSecond,
  setNodes,
  setEdges,
  isHighlighted,
  setMessage
) => {
  if (!pickleData || selectedFiles.length === 0) {
    setMessage?.(ErrorMessages.NO_FILES_OR_DATA); 
    setTimeout(() => setMessage?.(""), 5000);
    return;
  }

  setNodes([]);
  setEdges([]);

  try {
    const processFiles = (files) =>
      files.map((file) =>
        reactionManager.addReaction(file, pickleData, setNodes, setEdges, isHighlighted)
      );

    await Promise.all([...processFiles(selectedFiles), ...processFiles(selectedFilesSecond)]);
    setMessage(ErrorMessages.SUCCESS_GRAPH);
    setTimeout(() => setMessage(""), 5000);
  } catch (error) {
    setMessage(`${ErrorMessages.GRAPH_ERROR}: ${error.message}`);
    setTimeout(() => setMessage(""), 5000);
  }
};


