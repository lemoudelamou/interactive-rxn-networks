import React, { useState } from "react";
import { reactionManager } from "../reactions/ReactionManager";
import "../style/FileUpload.css";
import { saveFileData } from "../api/api";
import { loadReactionsFromFile } from "../reactions/loadReactions";

const FileUpload = ({ setNodes, setEdges }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [renamedFileName, setRenamedFileName] = useState("");
  const [isGraphReady, setIsGraphReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false); 
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.name.endsWith(".dot")) {
        setSelectedFile(file);
        setRenamedFileName(file.name.replace(".dot", "")); 
        setIsGraphReady(false);
        setErrorMessage("");
      } else {
        setSelectedFile(null);
        setRenamedFileName("");
        setErrorMessage("Invalid file type. Please upload a .dot file.");
      }
    } else {
      setSelectedFile(null);
      setRenamedFileName("");
      setErrorMessage("Please select a file.");
    }
  };

  const handleShowGraph = async () => {
    if (selectedFile) {
      setIsLoading(true);
      setNodes([]);
      setEdges([]);

      try {
        await reactionManager.addReaction(selectedFile, setNodes, setEdges);

        setTimeout(() => {
          setIsLoading(false);
          setIsGraphReady(true);
        }, 200);
      } catch (error) {
        setTimeout(() => {
          console.error(error);
          setIsLoading(false);
          setErrorMessage(error.message);
        }, 200);
      }
    }
  };

  const handleSaveData = async () => {
    try {
      const reactionData = await loadReactionsFromFile(selectedFile);
      const finalFileName = renamedFileName || localStorage.getItem("uploadedFileName");
      const reactionDataString = JSON.stringify(reactionData);

      await saveFileData(finalFileName, reactionDataString);

      setSuccessMessage("Data saved successfully!");
      setIsRenameModalOpen(false); 

      setTimeout(() => {
        setSuccessMessage("");
      }, 10000);
    } catch (error) {
      setErrorMessage("Error saving data.");

      setTimeout(() => {
        setErrorMessage("");
      }, 10000);
    }
  };

  const handleRenameSubmit = () => {
    setIsRenameModalOpen(false); 
    handleSaveData(); 
  };

  return (
    <div className="container_upload">
      <h3>Upload a .dot File</h3>
      <div className="upload-box">
        <input type="file" onChange={handleFileChange} />
        <button
          className="process-file-button"
          onClick={handleShowGraph}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? "Processing..." : "Show Graph"}
        </button>
        <button
          className="process-file-button"
          onClick={() => setIsRenameModalOpen(true)} 
          disabled={!selectedFile}
        >
          Save
        </button>
      </div>

      {isLoading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}

      
      {isRenameModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h4>Choose title for the graph</h4>
            <input
              type="text"
              value={renamedFileName}
              onChange={(e) => setRenamedFileName(e.target.value)}
              placeholder="Enter new file name"
            />
            <div className="modal-buttons">
              <button onClick={handleRenameSubmit}>Save</button>
              <button onClick={() => setIsRenameModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
