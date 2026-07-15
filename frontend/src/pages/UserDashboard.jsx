import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { CreditCard, FileCheck, MapPin, Clock } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [passData, setPassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPassStatus = async () => {
      try {
        const response = await api.get(`/pass/status/${user._id}`);
        setPassData(response.data);
      } catch (err) {
        // 404 means no pass exists, which is fine
        if (err.response?.status !== 404) {
          setError('Failed to fetch pass status');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchPassStatus();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-500/15 text-green-700 border-green-500/30';
      case 'payment_pending': return 'bg-blue-500/15 text-blue-700 border-blue-500/30';
      case 'approved': return 'bg-green-500/15 text-green-700 border-green-500/30';
      case 'pending': return 'bg-yellow-500/15 text-yellow-700 border-yellow-500/30';
      case 'rejected': return 'bg-red-500/15 text-red-700 border-red-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user?.name}</p>
      </header>

      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group border-2 border-transparent hover:border-primary/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
          <FileCheck className="text-primary mb-4 drop-shadow-sm" size={28} />
          <h3 className="font-bold text-lg">Apply for Pass</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Start a new bus pass application instantly.</p>
          <Link to="/apply" className="text-sm font-bold text-primary hover:text-primary/80 hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-all">
            Start Application &rarr;
          </Link>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group border-2 border-transparent hover:border-primary/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
          <CreditCard className="text-blue-500 mb-4 drop-shadow-sm" size={28} />
          <h3 className="font-bold text-lg">Payments</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Manage transactions and renew your active pass.</p>
          <Link to="/renew" className="text-sm font-bold text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-all">
            View Renewals &rarr;
          </Link>
        </div>
      </div>

      {/* Main Status Section */}
      <h2 className="text-xl font-bold mb-4">Current Pass Status</h2>
      {passData ? (
        <div className="glass-card p-8 rounded-3xl border border-border shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border pb-6 mb-6">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Pass ID</p>
              <p className="text-primary font-mono text-lg">{passData.passId}</p>
            </div>
            <div className={`px-4 py-1.5 rounded-full border text-sm font-semibold capitalize flex items-center gap-2 ${getStatusColor(passData.status)}`}>
              <span className="w-2 h-2 rounded-full bg-current"></span>
              {passData.status.replace('_', ' ')}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <FileCheck size={16} />
                <p className="text-xs font-semibold uppercase tracking-wider">Type</p>
              </div>
              <p className="font-medium text-lg">{passData.passType ? passData.passType.toUpperCase() : 'GENERAL'}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock size={16} />
                <p className="text-xs font-semibold uppercase tracking-wider">Duration</p>
              </div>
              <p className="font-medium text-lg">{passData.duration}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Valid From</p>
              <p className="font-medium">{passData.issueDate ? new Date(passData.issueDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Expires On</p>
              <p className="font-medium">{passData.expiryDate ? new Date(passData.expiryDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>

          {passData.status === 'active' && (
            <div className="mt-8 flex justify-end">
              <Link to="/pass" className="px-6 py-3 bg-foreground text-background font-medium rounded-xl hover:scale-105 active:scale-95 transition-transform">
                View Smart Card
              </Link>
            </div>
          )}
          {passData.status === 'payment_pending' && (
             <div className="mt-8 flex justify-end">
             <Link to={`/payment/${passData._id}`} className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 shadow-lg shadow-primary/20">
               <CreditCard size={18} />
               Complete Payment
             </Link>
           </div>
          )}
        </div>
      ) : (
        <div className="glass-card p-12 rounded-3xl border border-dashed border-border/50 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <FileCheck className="text-muted-foreground" size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">No Active Passes</h3>
          <p className="text-muted-foreground max-w-md mb-6">You don't have any pending or active bus passes. Apply for one now to get started.</p>
          <Link to="/apply" className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl shadow-lg hover:shadow-primary/25 transition-all">
            Apply Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
