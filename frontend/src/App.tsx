import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Dashboard";
import Login from "./pages/Dashboard";
import "./app.css";
import { LogIn } from "lucide-react";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;



// import React from "react";
// import "./app.css";

// import Register from "./components/Register";
// import Login from "./components/Login";
// import UploadForm from "./components/UploadForm";
// import OrdersTable from "./components/OrdersTable";
// import Chatbot from "./components/ChatBot/ChatBot";


// const App: React.FC = () => {
//   return (
//     <div>
//       <h1>Welcome to PharmaMitra</h1>
//       <Register />
//       <Login />
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
//         <h1 className="text-3xl font-bold mb-6">PharmaMitra - Prescription Assistant</h1>
//         <UploadForm />
//       </div>
//       <div className="md:col-span-1">
//         <Chatbot />
//       </div>
//     </div>


//   );
// };

// export default App;
