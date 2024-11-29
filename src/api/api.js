import axios from 'axios';


const API_BASE_URL = 'http://localhost:8081/api';


export const saveFileData = async (fileName, data) => {
    try {
        // Prepare form data
        const formData = new FormData();
        formData.append('fileName', fileName);
        formData.append('data', data); 
        const response = await axios.post(`${API_BASE_URL}/files`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.log('Error saving data to the database', error);
        throw error;
    }
};


export const getFileData = async () => {
    try {

        const response = await axios.get(`${API_BASE_URL}/files/graph.dot`);
        console.log(' display files data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error retrieving file data:', error);
        throw error;
    }
};


export const getFileDataById = async () => {
    try {

        const response = await axios.get(`${API_BASE_URL}/files/id/20`);
        console.log(' display files data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error retrieving file data:', error);
        throw error;
    }
};



export const getAllFileData = async () => {
    try {
        // Assuming your API endpoint for all files data is '/files/data'
        const response = await axios.get(`${API_BASE_URL}/files/data`);
        console.log('Display all files data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error retrieving all file data:', error);
        throw error;
    }
};


export const deleteGraphById = async (id) => {

    try {
        const response = await axios.delete(`${API_BASE_URL}/files/${id}`);
        console.log('Delete success:', response.data);

        return true;
    } catch (error) {
        console.error('Error deleting graph:', error);
        return false;
    }
};