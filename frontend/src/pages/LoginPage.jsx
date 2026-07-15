import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', formData);
      login(response.data);
      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 blur-[100px] rounded-full -z-10"></div>

      {/* Go Back Button */}
      <div className="absolute top-8 left-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 px-4 py-2 bg-background/50 hover:bg-background border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all backdrop-blur-md shadow-sm"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Go Back</span>
        </button>
      </div>

      <div className="w-full max-w-md p-8 glass-card rounded-2xl z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Bus size={28} />
            </div>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
          <p className="text-muted-foreground">Sign in to manage your bus pass</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium" htmlFor="password">Password</label>
              <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-medium shadow-lg hover:shadow-primary/25 transition-all
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-0'}`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Apply today
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
