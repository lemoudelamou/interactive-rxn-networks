import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/crn.jpeg";
import CardItem from "../chart-card/CardItems.js";
import "../style/GraphList.css";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import { getAllData, deleteGraph } from "../api/api.js";
import ErrorMessages from "../constants/ErrorMessages"; 

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
        const reactionData = await getAllData();

        if (Array.isArray(reactionData.graphs)) {
          const generatedCards = reactionData.graphs.map((item) => generateCardData(item));
          setCardsData(generatedCards);
        } else {
          throw new Error(ErrorMessages.DATA_UNEXPECTED_FORMAT);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(ErrorMessages.FETCH_DATA_FAILED);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const generateCardData = useCallback(
    (item) => {
      const { id, name, dot_data_1, pickle_data_1, free_energy } = item;

      let parsedData = {};
      let parsedPickleData = {};
      let parsedFreeEnergyData = {};

      try {
        if (typeof dot_data_1 === "string") {
          parsedData = JSON.parse(dot_data_1);
          parsedPickleData = JSON.parse(pickle_data_1);
          parsedFreeEnergyData = JSON.parse(free_energy);
        } else if (
          typeof dot_data_1 === "object" &&
          dot_data_1 !== null &&
          typeof pickle_data_1 === "object" &&
          pickle_data_1 !== null &&
          typeof free_energy === "object" &&
          free_energy !== null
        ) {
          parsedData = dot_data_1;
          parsedPickleData = pickle_data_1;
          parsedFreeEnergyData = free_energy;
        } else {
          throw new Error(ErrorMessages.DATA_UNEXPECTED_FORMAT);
        }

        const { edges = [], extractedData = [] } = parsedData;
        const { data } = parsedPickleData;
        const { freeEnergy } = parsedFreeEnergyData;

        return {
          id,
          title: name,
          imageSrc: Logo,
          onClick: () =>
            navigate("/graph-page", { state: { edges, extractedData, data, id, freeEnergy } }),
          onDeleteClick: () => handleDeleteCard(id),
        };
      } catch (error) {
        console.error(`Error parsing data for item ${id}:`, error);

        return {
          id,
          title: `Graph (${name || "Unknown"})`,
          content: <p>{ErrorMessages.DATA_UNEXPECTED_FORMAT}</p>,
          imageSrc: Logo,
          onClick: null,
          onDeleteClick: () => handleDeleteCard(id),
        };
      }
    },
    [navigate]
  );

  const handleDeleteCard = async (id) => {
    try {
      await deleteGraph(id);
      setCardsData((prevCards) => prevCards.filter((card) => card.id !== id));
    } catch (err) {
      console.error(`Failed to delete graph with ID ${id}:`, err);
      setError(ErrorMessages.DELETE_GRAPH_FAILED);
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
            cardsData.map((card) => (
              <CardItem
                key={card.id}
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
