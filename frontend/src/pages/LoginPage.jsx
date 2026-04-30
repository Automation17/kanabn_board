import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const endPoint = isRegister
            ? `${import.meta.env.VITE_API_URL}/auth/register`
            : `${import.meta.env.VITE_API_URL}/auth/login`;

        try {
            const response = await fetch(endPoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong.");
            }

            login(data, data.token);
            navigate("/board");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">

                {/* Brand */}
                <div className="auth-brand">
                    <span className="auth-brand-icon">📋</span>
                    <h1 className="auth-brand-name">Kanban Board</h1>
                </div>

                <p className="auth-subtitle">
                    {isRegister ? "Create your account" : "Welcome back!"}
                </p>

                {/* Error */}
                {error && (
                    <div className="auth-error">{error}</div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="auth-form">
                    {isRegister && (
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="name">Name</label>
                            <input
                                id="name"
                                className="auth-input"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                            />
                        </div>
                    )}

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            className="auth-input"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            className="auth-input"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-submit"
                    >
                        {loading ? "Please wait…" : isRegister ? "Register" : "Login"}
                    </button>
                </form>

                {/* Toggle */}
                <p className="auth-toggle">
                    {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        className="auth-toggle-btn"
                        onClick={() => { setIsRegister(!isRegister); setError(null); }}
                    >
                        {isRegister ? "Login" : "Register"}
                    </button>
                </p>

            </div>
        </div>
    );
}