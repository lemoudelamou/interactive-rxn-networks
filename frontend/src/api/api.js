import ErrorMessages from "../constants/ErrorMessages";

const API_BASE_URL = "http://localhost:5000";

export const uploadPickleFile = async (pickleFileFirst, pickleFileSecond) => {
  const formData = new FormData();
  
  formData.append("file_1", pickleFileFirst);
  formData.append("file_2", pickleFileSecond);

  try {
    const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (uploadResponse.ok) {
      return await uploadResponse.json();
    } else {
      const errorData = await uploadResponse.json();
      throw new Error(errorData.error || ErrorMessages.UPLOAD_FILES_ERROR);
    }
  } catch (error) {
    throw new Error(ErrorMessages.UPLOAD_FILES_ERROR);
  }
};



export const deleteGraph = async (graphId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete/${graphId}`, {
      method: "DELETE",
    });

    const responseData = await response.json();

    if (response.ok) {
      return responseData;
    } else {
      throw new Error(responseData.error || ErrorMessages.ERROR_DELETING_GRAPH);
    }
  } catch (error) {
    throw new Error(ErrorMessages.ERROR_DELETING_GRAPH);
  }
};

export const getAllData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_all_data`, {
      method: "GET",
    });

    const responseData = await response.json();

    if (response.ok) {
      return responseData;
    } else {
      throw new Error(responseData.error || ErrorMessages.ERROR_FETCHING_DATA);
    }
  } catch (error) {
    throw new Error(ErrorMessages.ERROR_FETCHING_DATA);
  }
};

export const getDataById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_data_id/${id}`, {
      method: "GET",
    });

    const responseData = await response.json();

    if (response.ok) {
      return responseData;
    } else {
      throw new Error(responseData.error || ErrorMessages.ERROR_FETCHING_DATA);
    }
  } catch (error) {
    throw new Error(ErrorMessages.ERROR_FETCHING_DATA);
  }
};

export const saveGraphData = async (nodes, edges, name, pickle_data, free_energy) => {
  try {
    const response = await fetch(`${API_BASE_URL}/save-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name || "default_graph",
        nodes,
        edges,
        pickle_data,
        free_energy,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || ErrorMessages.DATA_SAVE_ERROR);
    }

    const result = await response.json();
    return result.message;
  } catch (error) {
    throw new Error(ErrorMessages.DATA_SAVE_ERROR);
  }
};

