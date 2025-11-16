import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './Auth.css';

const LoginPage = ({ setIsLoggedIn }) => {
    const [credentials, setCredentials] = useState({ identifier: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const backend_url = import.meta.env.VITE_BACKEND_URL
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!credentials.identifier || !credentials.password) {
            toast.error("Email/Username and password are required.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${backend_url}/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            const json = await response.json();

            if (json.statusCode === 200) {
                localStorage.setItem("token", json.data.access_token);
                setIsLoggedIn(true);
                toast.success(json.message || "Logged in successfully!");
                navigate("/home");
            } else {
                toast.error(json.message || "Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Login failed. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container hero-bg">
            <ToastContainer position="top-right" autoClose={3000} />
            <header className="auth-header">
                <Link to="/">
                    <img src="src/assets/logo.png" alt="logo" className="auth-logo" />
                </Link>
            </header>

            <div className="auth-form-container">
                <div className="auth-form">
                    <h1 className="auth-form-title">Login</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="auth-input-container">
                            <label htmlFor="identifier" className="auth-input-label">Email or Username</label>
                            <input
                                type="text"
                                name="identifier"
                                id="identifier"
                                className="auth-input"
                                placeholder="Enter your email or username"
                                value={credentials.identifier}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="auth-input-container relative">
                            <label htmlFor="password" className="auth-input-label">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                className="auth-input pr-10"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account?{" "}
                        <Link to="/signup" className="auth-footer-link">Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
