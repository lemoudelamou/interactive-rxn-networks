// https://dev.to/demola12/optimizing-event-handlers-in-react-using-usecallback-5hc3#:~:text=React's%20useCallback%20hook%20is%20a,creation%20of%20functions%20during%20renders.

import React, { useState, useEffect, useCallback } from "react";
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
      setLoading(true);
      setError(null);
      try {
        const reactionData = await getAllFileData();
        console.log("API Response:", reactionData);

        const generatedCards = reactionData.map((generateCardData));

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

  const generateCardData = useCallback((item) => {
    const [{ id, fileName, data }] = item;

    try {
      const parsedData = JSON.parse(data);
      const { edges = [], extractedData = [] } = parsedData;

      console.log("Filename:", fileName);
      console.log("Edges:", edges);
      console.log("Extracted Data:", extractedData);

      return {
        id, 
        title: fileName,
        imageSrc: Logo,
        onClick: () => navigate("/graph-page", { state: { edges, extractedData } }),
        onDeleteClick: () => handleDeleteCard(id), 
      };
    } catch (error) {
      console.error(`Error parsing data for item ${id}:`, error);
      return {
        id,
        title: `Graph (${fileName || "Unknown"})`,
        content: <p>Error loading data for this graph.</p>,
        imageSrc: Logo,
        onClick: null,
        onDeleteClick: () => handleDeleteCard(id),
      };
    }
  }, [navigate]);


  const handleDeleteCard = async (id) => {
    try {
      await deleteGraphById(id); 
      console.log(`Graph with ID ${id} deleted successfully.`); 
      setCardsData((prevCards) => prevCards.filter((card) => card.id !== id));

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
