import './App.css';
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import FileUpload from './utils/FileUpload.js';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import { saveGraphData } from './api/api.js';
import { PickleContext } from './context/FileDataContext.js';
import TitleModal from './modals/SaveModal.js';

function App() {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [graphTitle, setGraphTitle] = useState('MyGraph');
  const { pickleData, freeEnergyData } = useContext(PickleContext);

  const handleSave = async (title) => {
    setIsSaving(true);
    setMessage('');
    setGraphTitle(title);

    try {
      const responseMessage = await saveGraphData(nodes, edges, title, pickleData, freeEnergyData);
      setMessage(`Success: ${responseMessage}`);
    } catch (error) {
      console.error("Error saving graph:", error.message);
      setMessage(`Error: Failed to save graph. ${error.message}`);
    } finally {
      setIsSaving(false);
      setIsModalOpen(false);
    }
  };

  const handleViewGraph = () => {
    navigate('/graph-page', {
      state: {
        edges,
        extractedData: nodes,
        data: pickleData?.data || [],
        freeEnergy: freeEnergyData,
      },
    });
  };

  useEffect(() => {
    const rateControlData = pickleData?.data?.rate_control || [];
    const processedRateControlData = rateControlData.map((item) => {
      const compound = Object.keys(item)[0];
      const properties = Object.entries(item[compound]).map(([label, details]) => ({
        label,
        value: details.value,
      }));
      return { compound, properties };
    });
    setTableData(processedRateControlData);
  }, [pickleData]);

  return (
    <div className="App">
      <Header />
      <div>
        <FileUpload setNodes={setNodes} setEdges={setEdges} />
      </div>

      <div className="message">
        <button className="button-style" onClick={() => setIsModalOpen(true)} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save To List"}
        </button>
        <button className="button-style" onClick={handleViewGraph}>
          View Graph
        </button>
        {message && (
          <p className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </p>
        )}
      </div>

     

      <TitleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <Footer />
    </div>
  );
}

export default App;
