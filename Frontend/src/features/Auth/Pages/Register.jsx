import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../Hooks/useAuth'
import { User, Mail, Lock, ShieldCheck, ArrowRight, Music2 } from 'lucide-react'

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
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 font-['Inter'] antialiased text-[#1A163A] overflow-hidden relative">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/30 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="w-full max-w-[460px] z-10">
                <div className="text-center mb-8 animate-[slideDown_0.8s_ease-out]">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-[#3B82F6] rounded-[18px] text-white shadow-xl shadow-blue-100 mb-6 animate-[float_4s_ease-in-out_infinite]">
                        <Music2 size={28} strokeWidth={3} />
                    </div>
                    <h1 className="text-[32px] font-black tracking-tighter mb-2">
                        Create Account
                    </h1>
                    <p className="text-[14px] font-medium text-slate-400">Join the future of emotion-driven music</p>
                </div>

                <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white animate-[slideUp_0.8s_ease-out_both] delay-100">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Username</label>
                            <div className="relative group">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#3B82F6] transition-colors" />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Your username"
                                    className="w-full h-[54px] bg-slate-50/50 border border-slate-100 rounded-[18px] pl-12 pr-4 text-[14px] font-semibold outline-none focus:border-[#3B82F6]/30 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#3B82F6] transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@example.com"
                                    className="w-full h-[54px] bg-slate-50/50 border border-slate-100 rounded-[18px] pl-12 pr-4 text-[14px] font-semibold outline-none focus:border-[#3B82F6]/30 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#3B82F6] transition-colors" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full h-[54px] bg-slate-50/50 border border-slate-100 rounded-[18px] pl-12 pr-4 text-[14px] font-semibold outline-none focus:border-[#3B82F6]/30 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Confirm</label>
                            <div className="relative group">
                                <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#3B82F6] transition-colors" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    className="w-full h-[54px] bg-slate-50/50 border border-slate-100 rounded-[18px] pl-12 pr-4 text-[14px] font-semibold outline-none focus:border-[#3B82F6]/30 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full h-[56px] md:col-span-2 bg-gradient-to-tr from-[#1E1B4B] to-[#4338CA] text-white rounded-[18px] font-black text-[15px] shadow-lg shadow-indigo-100 hover:shadow-xl hover:shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group mt-4"
                        >
                            <span>Register Now</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-50 text-center text-[13px] font-semibold text-slate-400">
                        Already have an account? <Link to="/login" className="text-[#3B82F6] hover:underline underline-offset-4 decoration-2">Sign in instead</Link>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slideDown {
                    from { transform: translateY(-30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}} />
        </div>
    )
}

export default Register
