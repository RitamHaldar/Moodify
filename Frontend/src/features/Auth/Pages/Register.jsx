import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import '../Styles/Register.scss'
import { useAuth } from '../Hooks/useAuth'
import { User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react'

const Register = () => {
    const { handleRegister } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
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
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!")
            return
        }
        await handleRegister(formData.username, formData.email, formData.password);
        navigate("/");
    }

    return (
        <div className="register-page">
            <div className="aurora-bg">
                <div className="aurora aurora-1"></div>
                <div className="aurora aurora-2"></div>
                <div className="aurora aurora-3"></div>
                <div className="noise-overlay"></div>
            </div>

            <div className="register-container fade-in-up">
                <div className="register-header">
                    <h1 className="logo-text">
                        Mood<span className="gradient-text gradient-animated">Sync</span>
                    </h1>
                    <p className="subtitle">Start your personalized sonic journey</p>
                </div>

                <div className="register-card outline-glass-heavy">
                    <div className="card-header">
                        <h2>Create Account</h2>
                        <p>Join the future of emotion-driven music</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-group">
                            <label>Username</label>
                            <div className="input-group">
                                <User size={18} className="input-icon" />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Your username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

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
                            <label>Password</label>
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

                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="input-group">
                                <ShieldCheck size={18} className="input-icon" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="register-submit-btn">
                            <span>Register Now</span>
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="card-footer">
                        <p>Already have an account? <Link to="/login" className="gradient-text">Sign in instead</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
