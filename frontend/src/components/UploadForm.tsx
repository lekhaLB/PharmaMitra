import { useState } from "react";

const UploadForm: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [medicines, setMedicines] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedFile) {
            console.error("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/process-image/", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log("Response from backend:", data);

            if (!data.extracted_text || !Array.isArray(data.extracted_text)) {
                console.error("Invalid extracted_text format:", data.extracted_text);
                return;
            }

            // Filter out null values and split by newline
            const medicinesArray = data.extracted_text.filter(Boolean)
                .map(item => item.split("\n")).flat().map(line => line.split(" ")[0]);

            console.log("Medicines Array:", medicinesArray);
            setMedicines(medicinesArray);


        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };


    return (
        <div className="upload-form">
            <h2>Upload Prescription Image</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>

            {medicines.length > 0 && (
                <div>
                    <h3>Extracted Medicines</h3>
                    <ul>
                        {medicines.map((medicine, index) => (
                            <li key={index}>{medicine}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UploadForm;



// import { useState } from "react";

// const UploadForm: React.FC = () => {
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [medicines, setMedicines] = useState<string[]>([]);

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files.length > 0) {
//             setSelectedFile(event.target.files[0]);
//         }
//     };

//     const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();

//         if (!selectedFile) {
//             console.error("No file selected");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("image", selectedFile);

//         try {
//             const response = await fetch("http://127.0.0.1:8000/api/process-image/", {
//                 method: "POST",
//                 body: formData,
//             });

//             const data = await response.json();
//             console.log("Response from backend:", data);

//             if (!data.extracted_text || !Array.isArray(data.extracted_text)) {
//                 console.error("Invalid extracted_text format:", data.extracted_text);
//                 return;
//             }

//             // Filter out null values and split by newline instead of ","
//             const medicinesArray = data.extracted_text.filter(Boolean).map(item => item.split("\n")).flat();
//             console.log("Medicines Array:", medicinesArray);
//             setMedicines(medicinesArray);

//         } catch (error) {
//             console.error("Error uploading image:", error);
//         }
//     };

//     return (
//         <div className="upload-form">
//             <h2>Upload Prescription Image</h2>
//             <form onSubmit={handleSubmit}>
//                 <input type="file" accept="image/*" onChange={handleFileChange} />
//                 <button type="submit">Upload</button>
//             </form>

//             {medicines.length > 0 && (
//                 <div>
//                     <h3>Extracted Medicines</h3>
//                     <ul>
//                         {medicines.map((medicine, index) => (
//                             <li key={index}>{medicine}</li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UploadForm;




// import { useState } from "react";

// const UploadForm = () => {
//     const [file, setFile] = useState<File | null>(null);

//     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files.length > 0) {
//             setFile(event.target.files[0]);
//         }
//     };

//     const handleUpload = async () => {
//         if (!file) {
//             alert("Please select a file first.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("image", file); // "image" must match Django backend

//         try {
//             const response = await fetch("http://127.0.0.1:8000/api/process-image/", {
//                 method: "POST",
//                 body: formData,
//             });

//             if (!response.ok) {
//                 throw new Error(`Error: ${response.status}`);
//             }

//             const data = await response.json();
//             console.log("Response from backend:", data);
//         } catch (error) {
//             console.error("Upload failed:", error);
//         }
//     };

//     return (
//         <div>
//             <input type="file" onChange={handleFileChange} accept="image/*" />
//             <button onClick={handleUpload}>Upload</button>
//         </div>
//     );
// };

// export default UploadForm;

