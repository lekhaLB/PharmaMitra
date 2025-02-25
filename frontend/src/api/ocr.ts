import axios from "axios";

export interface Medicine {
    name: string;
    dosage: string;
    price: number;
}

export const uploadImage = async (file: File): Promise<Medicine[]> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post<{ medicines: Medicine[] }>(
        "http://127.0.0.1:8000/api/process-image/",
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );

    return response.data.medicines;
};
