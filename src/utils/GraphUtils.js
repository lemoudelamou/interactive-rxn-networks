import { reactionManager } from "../reactions/ReactionManager";
import { saveData } from "../api/api";
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

export const handleSaveData = async (
  selectedFiles,
  selectedFilesSecond,
  pickleData,
  isHighlighted,
  setMessage
) => {
  if (!selectedFiles.length || !selectedFilesSecond.length) {
    setMessage?.(ErrorMessages.NO_FILES_TO_SAVE);
    setTimeout(() => setMessage?.(""), 5000);
    return;
  }

  try {
    const [reactionsDataFirstFile, reactionsDataSecondFile] = await Promise.all([
      reactionManager.loadReactionsFromFile(selectedFiles[0], pickleData),
      reactionManager.loadReactionsFromFile(selectedFilesSecond[0], pickleData),
    ]);

    const mergedFirstData = mergeReactionData(reactionsDataFirstFile, isHighlighted);
    const mergedSecondData = mergeReactionData(reactionsDataSecondFile, isHighlighted);

    const formData = new FormData();
    formData.append("dot_file_1", JSON.stringify(mergedFirstData));
    formData.append("dot_file_1_filename", "test");
    formData.append("dot_file_2", JSON.stringify(mergedSecondData));
    formData.append("pickle_data", JSON.stringify(pickleData));

    await saveData(formData);
    setMessage(ErrorMessages.DATA_SAVE_SUCCESS);
    setTimeout(() => setMessage(""), 5000);
  } catch (error) {
    setMessage(`${ErrorMessages.DATA_SAVE_ERROR}: ${error.message}`);
    setTimeout(() => setMessage(""), 5000);
  }
};

const mergeReactionData = (reactionsData, isHighlighted) => {
  return {
    extractedData: reactionsData.extractedData.map((node) => ({
      ...node,
      isHighlighted,
    })),
    edges: reactionsData.edges.map((edge) => ({
      ...edge,
      isHighlighted,
    })),
  };
};
