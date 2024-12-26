import React, { useEffect, useState, useContext, useCallback } from "react";
import "../style/DataVizualisation.css";
import Chart from "../chart-card/Chart";
import { getDataById } from "../api/api.js";
import { PickleContext } from "../context/FileDataContext";

const DataVizualisation = ({ isOpen, onClose, id }) => {
  const [TOFChartData, setTOFChartData] = useState(null);
  const [rateControlChartData, setRateControlChartData] = useState([]);
  const [freeEnergyChartData, setFreeEnergyChartData] = useState(null);
  const [activeChart, setActiveChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { pickleData, freeEnergyData } = useContext(PickleContext);

  const processTOFData = useCallback((TOFDict) => {
    const labels = Object.keys(TOFDict);
    const values = Object.values(TOFDict);

    return {
      labels,
      datasets: [
        {
          label: "TOF Values",
          data: values,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, []);

  const processRateControlData = useCallback((rateControl) => {
    return rateControl.map((item) => {
      const compound = Object.keys(item)[0];
      const properties = item[compound];

      const labels = [];
      const values = [];

      Object.entries(properties).forEach(([key, propertyValue]) => {
        if (key !== "smiles") {
          labels.push(key);
          values.push(propertyValue.value);
        }
      });

      return {
        compound,
        chartData: {
          labels,
          datasets: [
            {
              label: `${compound}`,
              data: values,
              backgroundColor: "rgba(153, 102, 255, 0.6)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 2,
            },
          ],
        },
      };
    });
  }, []);

  const processFreeEnergyData = useCallback((freeEnergy) => {
    return {
      labels: freeEnergy.labels,
      datasets: [
        {
          label: freeEnergy.model_label || "Free Energy Pathway (Line)",
          data: freeEnergy.states,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          fill: false,
          type: "line",
          pointStyle: "circle",
          pointRadius: 4,
          pointBackgroundColor: "rgba(75, 192, 192, 1)",
          borderDash: [5, 5],
        },
      ],
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = id ? await getDataById(id) : null;
        const graphData = response?.graph;

        if (graphData) {
          setTOFChartData(processTOFData(graphData.pickle_data_1?.data?.TOF_dict || {}));
          setRateControlChartData(processRateControlData(graphData.pickle_data_1?.data?.rate_control || []));
          setFreeEnergyChartData(processFreeEnergyData(graphData.free_energy?.[0] || {}));
        } else if (pickleData && freeEnergyData) {
          setTOFChartData(processTOFData(pickleData.data.TOF_dict));
          setRateControlChartData(processRateControlData(pickleData.data.rate_control));
          setFreeEnergyChartData(processFreeEnergyData(freeEnergyData[0]));
        } else {
          throw new Error("Data unavailable.");
        }
      } catch (error) {
        setError("Failed to load data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, pickleData, freeEnergyData, processTOFData, processRateControlData, processFreeEnergyData]);

  const handleShowChart = useCallback((chartType) => {
    setActiveChart(chartType);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h3>Charts</h3>

        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <div>
              <button className="button-style" onClick={() => handleShowChart("RateControl")}>
                Rate Control
              </button>
              <button className="button-style" onClick={() => handleShowChart("TOF")}>
                TOF
              </button>
              <button className="button-style" onClick={() => handleShowChart("FreeEnergy")}>
                Free Energy
              </button>
            </div>

            {activeChart === "RateControl" && (
              rateControlChartData.length > 0 ? (
                rateControlChartData.map(({ compound, chartData }) => (
                  <div key={compound}>
                    <h4>{compound} Rate Control</h4>
                    <Chart chartData={chartData} isLineChart={true} />
                  </div>
                ))
              ) : (
                <p>No Rate Control data available.</p>
              )
            )}
            {activeChart === "TOF" && (
              TOFChartData ? (
                <>
                  <h4>TOF</h4>
                  <Chart chartData={TOFChartData} logScale={true} isLineChart={true} />
                </>
              ) : (
                <p>No TOF data available.</p>
              )
            )}
            {activeChart === "FreeEnergy" && (
              freeEnergyChartData ? (
                <>
                  <h4>Free Energy Pathway</h4>
                  <Chart chartData={freeEnergyChartData} isLineChart={true} />
                </>
              ) : (
                <p>No Free Energy data available.</p>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DataVizualisation;
