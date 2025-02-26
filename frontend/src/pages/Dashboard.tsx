import UploadForm from "../components/UploadForm";
import ChatBot from "../components/ChatBot/Chatbot";

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            <h1>PharmaMitra - Pharmacist's Assistant</h1>
            <UploadForm />
            <ChatBot />
        </div>
    );
};

export default Dashboard;
