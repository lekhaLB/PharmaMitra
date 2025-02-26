import { useState } from "react";

interface LoginProps {
    onSuccess: () => void;
    onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess, onSwitchToRegister }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("user_id", data.user_id);
                alert("Login successful!");
                onSuccess();
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="auth-form">
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <p>
                Don't have an account? <button onClick={onSwitchToRegister}>Register</button>
            </p>
        </div>
    );
};

export default Login;

