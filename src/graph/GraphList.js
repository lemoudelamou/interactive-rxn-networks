import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo-Haber.png";
import CardItem from "../utils/CardItems.js";
import "../style/GraphList.css";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import { getAllFileData } from "../api/api.js";

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
    const [{id ,fileName, data}] = item;


    try {
      const parsedData = JSON.parse(data);
      const { edges = [], extractedData = [], filenameData = fileName } = parsedData;

      console.log("Filename:", filenameData);
      console.log("Edges:", edges);
      console.log("Extracted Data:", extractedData);

      return {
        title: `Graph ${index + 1} (${filenameData})`,
        imageSrc: Logo,
        onClick: () => handleCardClick(edges, extractedData),
      };
    } catch (error) {
      console.error(`Error parsing data for item ${index + 1}:`, error);
      return {
        title: `Graph ${index + 1} (${fileName})`,
        content: <p>Error loading data for this graph.</p>,
        imageSrc: Logo,
        onClick: null, 
      };
    }
  };

  const handleCardClick = (edgesFromFile, extractedData) => {
    navigate("/graph-page", { state: { edges: edgesFromFile, extractedData } });
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
              <CardItem key={index} card={card} onClick={card.onClick} />
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
