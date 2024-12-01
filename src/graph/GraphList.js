import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/crn.jpeg";
import CardItem from "../utils/CardItems.js";
import "../style/GraphList.css";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import { getAllFileData, deleteGraphById } from "../api/api.js";


const GraphList = () => {
  const [cardsData, setCardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reactionData = await getAllFileData();
        console.log("API Response:", reactionData);

        const generatedCards = reactionData.map((item, index) =>
          generateCardData(item, index)
        );

        setCardsData(generatedCards);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch graph data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateCardData = (item, index) => {
    const [{ id, fileName, data }] = item;

    try {
      const parsedData = JSON.parse(data);
      const { edges = [], extractedData = [], filenameData = fileName } = parsedData;

      console.log("Filename:", filenameData);
      console.log("Edges:", edges);
      console.log("Extracted Data:", extractedData);

      return {
        id, 
        title: `${filenameData}`,
        imageSrc: Logo,
        onClick: () => handleCardClick(edges, extractedData),
        onDeleteClick: () => handleDeleteCard(id, index), 
      };
    } catch (error) {
      console.error(`Error parsing data for item ${index + 1}:`, error);
      return {
        id,
        title: `Graph ${index + 1} (${fileName})`,
        content: <p>Error loading data for this graph.</p>,
        imageSrc: Logo,
        onClick: null,
        onDeleteClick: () => handleDeleteCard(id, index),
      };
    }
  };

  const handleCardClick = (edgesFromFile, extractedData) => {
    navigate("/graph-page", { state: { edges: edgesFromFile, extractedData } });
  };

  const handleDeleteCard = async (id, index) => {
    try {
      await deleteGraphById(id); 
      console.log(`Graph with ID ${id} deleted successfully.`);
      const updatedCards = [...cardsData];
      updatedCards.splice(index, 1); 
      setCardsData(updatedCards); 
    } catch (err) {
      console.error(`Failed to delete graph with ID ${id}:`, err);
      setError("Failed to delete the graph.");
    }
  };

  return (
    <div>
      <Header />

      <div className="content">
        <h1>List of Graphs</h1>

        <div className="white-box">
          {loading ? (
            <p>Loading graphs...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : cardsData.length > 0 ? (
            cardsData.map((card, index) => (
              <CardItem
                key={index}
                card={card}
                onClick={card.onClick}
                onDeleteClick={card.onDeleteClick}
              />
            ))
          ) : (
            <p>No graphs available.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GraphList;
