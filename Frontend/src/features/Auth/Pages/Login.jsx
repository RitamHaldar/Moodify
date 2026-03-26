import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import '../Styles/Login.scss'
import { useAuth } from "../Hooks/useAuth"
import { Mail, Lock, ArrowRight } from 'lucide-react'

const Login = () => {
    const { handleLogin } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin(formData)
        navigate("/")
    }

    return (
        <div className="login-page">
            <div className="aurora-bg">
                <div className="aurora aurora-1"></div>
                <div className="aurora aurora-2"></div>
                <div className="aurora aurora-3"></div>
                <div className="noise-overlay"></div>
            </div>

            <div className="login-container fade-in-up">
                <div className="login-header">
                    <h1 className="logo-text">
                        Mood<span className="gradient-text gradient-animated">Sync</span>
                    </h1>
                    <p className="subtitle">Tune into your personal atmosphere</p>
                </div>

                <div className="login-card outline-glass-heavy">
                    <div className="card-header">
                        <h2>Welcome Back</h2>
                        <p>Enter your credentials to continue your journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-group">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="label-row">
                                <label>Password</label>
                            </div>
                            <div className="input-group">
                                <Lock size={18} className="input-icon" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="login-submit-btn">
                            <span>Sign In</span>
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="card-footer">
                        <p>Don't have an account? <Link to="/register" className="gradient-text">Create one now</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login

