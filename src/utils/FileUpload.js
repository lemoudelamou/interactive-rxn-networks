import React, { useState } from 'react';
import { reactionManager } from '../reactions/ReactionManager'; 
import '../style/FileUpload.css';
import { saveFileData } from '../api/api';
import { loadReactionsFromFile } from "../reactions/loadReactions";

const FileUpload = ({ setNodes, setEdges }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isGraphReady, setIsGraphReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 

  const handleFileChange = (event) => {
    const file = event.target.files[0];
  
    const handleValidFile = (file) => ({
      selectedFile: file,
      isGraphReady: false,
      errorMessage: ""
    });
  
    const handleInvalidFile = () => ({
      selectedFile: null,
      errorMessage: "Invalid file type. Please upload a .dot file."
    });
  
    const result = file
      ? file.name.endsWith('.dot')
        ? handleValidFile(file)
        : handleInvalidFile()
      : handleInvalidFile(); 
  
    setSelectedFile(result.selectedFile);
    setIsGraphReady(result.isGraphReady);
    setErrorMessage(result.errorMessage);
  };

  const handleShowGraph = async () => {
    const processFile = async (file) => {
      setIsLoading(true);
      setNodes([]);
      setEdges([]);
  
      try {
        await reactionManager.addReaction(file, setNodes, setEdges);

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
    };
  
    selectedFile && processFile(selectedFile);
  };

  const handleSaveData = async () => {
    try {
      const reactionData = await loadReactionsFromFile(selectedFile);
      const savedFileName = localStorage.getItem("uploadedFileName");
      const reactionDataString = JSON.stringify(reactionData);

      await saveFileData(savedFileName, reactionDataString);

      setSuccessMessage("Data saved successfully!");

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
          onClick={handleSaveData} 
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

      {/* Show success message */}
      {successMessage && (
        <div className="success-message">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
