import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './Auth.css';

const SignUpPage = ({ setIsLoggedIn }) => {
    const [credentials, setCredentials] = useState({ fullName: "", email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!credentials.fullName || !credentials.email || !credentials.password) {
            toast.error("All fields are required.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:3000/user/register", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const json = await response.json();

            if (json.statusCode === 200) {
                localStorage.setItem('token', json.access_token);
                setIsLoggedIn(true);
                toast.success(json.message || "Account created successfully!");
                navigate("/home");
            } else {
                toast.error(json.message || "Sign up failed. Please try again.");
            }
        } catch (error) {
            console.error("Sign up error:", error);
            toast.error("Sign up failed. Please try again later.");
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
                    <h1 className="auth-form-title">Sign Up</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="auth-input-container">
                            <label htmlFor="fullName" className="auth-input-label">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                id="fullName"
                                className="auth-input"
                                placeholder="Your full name"
                                value={credentials.fullName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="auth-input-container">
                            <label htmlFor="email" className="auth-input-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="auth-input"
                                placeholder="you@example.com"
                                value={credentials.email}
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
                            {isLoading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account?{" "}
                        <Link to="/login" className="auth-footer-link">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
