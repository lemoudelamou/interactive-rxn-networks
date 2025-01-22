import React, { useState, useContext, useEffect } from "react";
import { PickleContext } from "../context/FileDataContext";
import { handleShowGraph, readJsonFile } from "./GraphUtils";
import { uploadPickleFile } from "../api/api";
import "../style/FileUpload.css";
import ErrorMessages from "../constants/ErrorMessages"; 
import SuccessMessages from "../constants/SuccessMessages"; 

const FileUpload = ({ setNodes, setEdges }) => {
  const { pickleData, updatePickleData, freeEnergyData, updateFreeEnergyData } = useContext(PickleContext);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFilesSecond, setSelectedFilesSecond] = useState([]);
  const [selectedPickleFileFirst, setSelectedPickleFileFirst] = useState(null);
  const [selectedPickleFileSecond, setSelectedPickleFileSecond] = useState(null);
  const [selectedJsonFile, setSelectedJsonFile] = useState(null);
  const [isGraphReady, setIsGraphReady] = useState(false);
  const [isLoadingPickle, setIsLoadingPickle] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  useEffect(() => {
    if (pickleData && selectedFiles.length > 0) {
      handleShowGraph(
        pickleData,
        selectedFiles,
        selectedFilesSecond,
        setNodes,
        setEdges,
        false, 
        setMessage 
      )
        .then(() => setIsGraphReady(true))
        .catch((error) => setErrorMessage(error.message));
    } else if (selectedFiles.length > 0) {
      setIsGraphReady(false);
    }
  }, [pickleData, selectedFiles, selectedFilesSecond, setNodes, setEdges]);
  

  const isValidFile = (file, extensions) =>
    extensions.some((ext) => file?.name.endsWith(ext));

  const handleFileChange = (event, fileType) => {
    const files = Array.from(event.target.files);
    const file = files[0];

    switch (fileType) {
      case "jsonFile":
        if (isValidFile(file, [".json"])) {
          setSelectedJsonFile(file);
          setErrorMessage("");
        } else {
          setSelectedJsonFile(null);
          setErrorMessage(ErrorMessages.INVALID_FILE_JSON);
        }
        break;
      case "first":
      case "second":
        if (files.every((f) => isValidFile(f, [".dot"]))) {
          fileType === "first" ? setSelectedFiles(files) : setSelectedFilesSecond(files);
          setErrorMessage("");
        } else {
          setErrorMessage(ErrorMessages.INVALID_FILE_DOT);
        }
        break;
      case "pickleFirst":
      case "pickleSecond":
        if (isValidFile(file, [".pickle", ".pkl"])) {
          fileType === "pickleFirst" ? setSelectedPickleFileFirst(file) : setSelectedPickleFileSecond(file);
          setErrorMessage("");
        } else {
          setErrorMessage(ErrorMessages.INVALID_FILE_PICKLE);
        }
        break;
      default:
        setErrorMessage(ErrorMessages.UNSUPPORTED_FILE_TYPE);
    }
  };

  const handleLoadAllFiles = async () => {
    if (
      !selectedPickleFileFirst ||
      !selectedPickleFileSecond ||
      !selectedJsonFile ||
      selectedFiles.length === 0 ||
      selectedFilesSecond.length === 0
    ) {
      setErrorMessage(ErrorMessages.MISSING_REQUIRED_FILES);
      return;
    }

    setIsLoadingPickle(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const pickleDataResponse = await uploadPickleFile(selectedPickleFileFirst, selectedPickleFileSecond);
      updatePickleData(pickleDataResponse);

      const jsonData = await readJsonFile(selectedJsonFile);
      updateFreeEnergyData(jsonData);

      setSuccessMessage(SuccessMessages.FILES_PROCESSED);
    } catch (error) {
      setErrorMessage(`${ErrorMessages.UPLOAD_FILES_ERROR}: ${error.message}`);
    } finally {
      setIsLoadingPickle(false);
    }
  };

  return (
    <div className="container_upload">
      <h1>Upload Graph Data</h1>
      <div className="upload-wrapper">
        <div className="upload-box">
          <h3>Graph (.dot)</h3>
          <input type="file" onChange={(e) => handleFileChange(e, "first")} />
        </div>

        <div className="upload-box">
          <h3>Subnetwork (.dot)</h3>
          <input type="file" onChange={(e) => handleFileChange(e, "second")} />
        </div>

        <div className="upload-box">
          <h3>Subnet attributes (.pkl)</h3>
          <input type="file" onChange={(e) => handleFileChange(e, "pickleFirst")} />
        </div>

        <div className="upload-box">
          <h3>Species name (.pkl)</h3>
          <input type="file" onChange={(e) => handleFileChange(e, "pickleSecond")} />
        </div>

        <div className="upload-box">
          <h3>Energy data (.json)</h3>
          <input type="file" onChange={(e) => handleFileChange(e, "jsonFile")} />
        </div>

        <button
          className="button-style"
          onClick={handleLoadAllFiles}
          disabled={isLoadingPickle}
        >
          {isLoadingPickle ? "Processing..." : "Load All Files"}
        </button>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default FileUpload;