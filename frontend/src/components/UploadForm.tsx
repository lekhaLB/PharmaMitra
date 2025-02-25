import { useState } from "react";

const UploadForm = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("image", file); // "image" must match Django backend

        try {
            const response = await fetch("http://127.0.0.1:8000/api/process-image/", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response from backend:", data);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default UploadForm;
