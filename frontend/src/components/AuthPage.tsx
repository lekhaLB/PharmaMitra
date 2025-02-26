import { useState } from 'react';
import { AlertCircle, CheckCircle, User, Lock, Mail, ArrowRight } from 'lucide-react';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: null, message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (isLogin) {
            if (!formData.username || !formData.password) {
                setStatus({
                    type: 'error',
                    message: 'Please fill in all fields.'
                });
                return false;
            }
        } else {
            if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
                setStatus({
                    type: 'error',
                    message: 'Please fill in all fields.'
                });
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setStatus({
                    type: 'error',
                    message: 'Passwords do not match.'
                });
                return false;
            }
            if (!/\S+@\S+\.\S+/.test(formData.email)) {
                setStatus({
                    type: 'error',
                    message: 'Please enter a valid email address.'
                });
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const endpoint = isLogin ? 'login' : 'register';
            const payload = isLogin
                ? { username: formData.username, password: formData.password }
                : { username: formData.username, email: formData.email, password: formData.password };

            const response = await fetch(`http://127.0.0.1:8000/api/${endpoint}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({
                    type: 'success',
                    message: isLogin ? 'Login successful!' : 'Registration successful! Please log in.'
                });

                if (isLogin) {
                    localStorage.setItem('user_id', data.user_id);
                    // Redirect would happen here in a real app
                } else {
                    // Reset form and switch to login after successful registration
                    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
                    setTimeout(() => setIsLogin(true), 2000);
                }
            } else {
                setStatus({
                    type: 'error',
                    message: data.error || 'An error occurred. Please try again.'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus({
                type: 'error',
                message: 'Connection error. Please check your internet connection.'
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setStatus({ type: null, message: '' });
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            {/* Left panel - Hidden on mobile */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 justify-center items-center text-white p-8">
                <div className="max-w-md">
                    <div className="flex items-center gap-2 mb-6">
                        <svg viewBox="0 0 24 24" width="42" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 12L12 16L20 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 16L12 20L20 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h1 className="text-3xl font-bold">PharmaMitra</h1>
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">Your AI Pharmacist Assistant</h2>
                    <p className="mb-4 text-blue-100">Empowering pharmacists with cutting-edge AI technology to enhance patient care, streamline workflows, and make informed decisions.</p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                            <CheckCircle className="text-blue-200" size={20} />
                            <span>Medication interaction checking</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="text-blue-200" size={20} />
                            <span>Personalized dosage recommendations</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="text-blue-200" size={20} />
                            <span>Instant clinical reference</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle className="text-blue-200" size={20} />
                            <span>Patient education resources</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right panel - Form */}
            <div className="w-full md:w-1/2 flex justify-center items-center p-4 md:p-8">
                <div className="w-full max-w-md">
                    {/* Logo - Visible only on mobile */}
                    <div className="flex md:hidden items-center gap-2 mb-8 justify-center">
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L4 8L12 12L20 8L12 4Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 12L12 16L20 12" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 16L12 20L20 16" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h1 className="text-2xl font-bold text-blue-600">PharmaMitra</h1>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                            {isLogin ? 'Sign In to PharmaMitra' : 'Create Your Account'}
                        </h2>

                        {/* Status message */}
                        {status.type && (
                            <div className={`mb-4 p-3 rounded-md flex items-start gap-2 ${status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                                }`}>
                                {status.type === 'error' ?
                                    <AlertCircle size={20} className="mt-0.5" /> :
                                    <CheckCircle size={20} className="mt-0.5" />
                                }
                                <p>{status.message}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your username"
                                    />
                                </div>
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your password"
                                    />
                                </div>
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Confirm your password"
                                        />
                                    </div>
                                </div>
                            )}

                            {isLogin && (
                                <div className="flex items-center justify-end">
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                                        Forgot password?
                                    </a>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    type="button"
                                    onClick={toggleForm}
                                    className="ml-1 font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                                >
                                    {isLogin ? 'Sign up now' : 'Sign in'}
                                </button>
                            </p>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} PharmaMitra. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;