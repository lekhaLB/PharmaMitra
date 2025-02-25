import React from "react";
import UploadForm from "./components/UploadForm";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">PharmaMitra - Prescription Assistant</h1>
      <UploadForm />
    </div>
  );
};

export default App;
