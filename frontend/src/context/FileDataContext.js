import React, { createContext, useState, useEffect } from "react";

export const PickleContext = createContext();

export const PickleProvider = ({ children }) => {
  const [pickleData, setPickleData] = useState(() => {
    const storedData = localStorage.getItem("pickleData");
    return storedData ? JSON.parse(storedData) : null;
  });

  const [freeEnergyData, setFreeEnergyData] = useState(() => {
    const storedData = localStorage.getItem("freeEnergyData");
    return storedData ? JSON.parse(storedData) : null;
  });

  const updatePickleData = (data) => {
    setPickleData(data);
    localStorage.setItem("pickleData", JSON.stringify(data));
  };

  const updateFreeEnergyData = (data) => {
    setFreeEnergyData(data);
    localStorage.setItem("freeEnergyData", JSON.stringify(data));
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("pickleData");
      localStorage.removeItem("freeEnergyData");
    };
  }, []);

  return (
    <PickleContext.Provider
      value={{
        pickleData,
        freeEnergyData,
        updatePickleData,
        updateFreeEnergyData,
      }}
    >
      {children}
    </PickleContext.Provider>
  );
};

export default PickleProvider;
