import axios from "axios";

const API_URL = "http://localhost:8000/api/";

export const getMedications = async () => {
    const response = await axios.get(`${API_URL}medications/`);
    return response.data;
};

export const addMedication = async (medication: { name: string; type: string }) => {
    const response = await axios.post(`${API_URL}medications/add/`, medication);
    return response.data;
};
