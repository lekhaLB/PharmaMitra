import React, { useState } from "react";
import { uploadImage, Medicine } from "../api/ocr";

const UploadForm: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        const meds = await uploadImage(file);
        setMedicines(meds);
        setLoading(false);
    };

    return (
        <div className="container">
            <h2>Upload Prescription</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!file || loading}>
                {loading ? "Processing..." : "Upload & Extract"}
            </button>

            {medicines.length > 0 && (
                <div>
                    <h3>Matched Medicines:</h3>
                    <ul>
                        {medicines.map((med, index) => (
                            <li key={index}>
                                {med.name} - {med.dosage} (₹{med.price})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UploadForm;
