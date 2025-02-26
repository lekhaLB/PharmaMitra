import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Register from "../components/Register";
import Login from "../components/Login";



const LandingPage: React.FC = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleRegSuccess = () => {
        navigate("/login"); // Redirect to Dashboard after login/register
    };

    const handleLoginSuccess = () => {
        navigate("/dashboard"); // Redirect to Dashboard after login/register
    };

    return (
        <div className="landing-container">
            <h1>Welcome to PharmaMitra</h1>
            <div className="auth-card">
                {isRegistering ? (
                    <>
                        <Register onSuccess={handleRegSuccess} />
                        <p>
                            Already have an account?{" "}
                            <button onClick={() => setIsRegistering(false)}>Login</button>
                        </p>
                    </>
                ) : (
                    <>
                        <Login onSuccess={handleLoginSuccess} />
                        <p>
                            New here?{" "}
                            <button onClick={() => setIsRegistering(true)}>Register</button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default LandingPage;
