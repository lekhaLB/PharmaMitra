import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Register from "../components/Register";
import Login from "../components/Login";

const LandingPage: React.FC = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        navigate("/dashboard"); // Redirect to Dashboard after login
    };

    return (
        <div className="landing-container">
            <h1>Welcome to PharmaMitra</h1>
            <div className="auth-card">
                {isRegistering ? (
                    <Register onSwitchToLogin={() => setIsRegistering(false)} />
                ) : (
                    <Login onSuccess={handleLoginSuccess} onSwitchToRegister={() => setIsRegistering(true)} />
                )}
            </div>
        </div>
    );
};

export default LandingPage;
