import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Calendar, History, ArrowRight } from 'lucide-react';

const RenewPassPage = () => {
  const { user } = useContext(AuthContext);
  const [passData, setPassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState('1 month');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPassStatus = async () => {
      try {
        const response = await api.get(`/pass/status/${user._id}`);
        setPassData(response.data);
      } catch (err) {
        console.error('Failed to fetch pass data', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchPassStatus();
  }, [user]);

  const handleRenew = async (e) => {
    e.preventDefault();
    if (!passData) return;
    
    setIsSubmitting(true);
    try {
      await api.post('/pass/renew', { passId: passData._id, duration });
      // Redirect to payment block immediately after triggering renew
      navigate(`/payment/${passData._id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to process renewal request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!passData || (passData.status === 'pending')) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center">
        <div className="bg-muted p-10 rounded-3xl border border-border">
          <History className="mx-auto text-muted-foreground mb-4" size={48} />
          <h2 className="text-2xl font-bold mb-2">No Active Pass to Renew</h2>
          <p className="text-muted-foreground mb-6">You need an approved, active, or expired pass to request a renewal.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl shadow-sm"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isExpired = new Date(passData.expiryDate) < new Date();

  return (
    <div className="max-w-2xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 block">
        <h1 className="text-3xl font-bold tracking-tight">Renew Your Pass</h1>
        <p className="text-muted-foreground mt-1">Extend the duration of your current digital bus pass.</p>
      </header>

      <div className="glass-card p-6 md:p-8 rounded-3xl shadow-sm border border-border">
        
        {/* Pass Info summary block */}
        <div className={`p-5 rounded-2xl border mb-8 flex justify-between items-center ${isExpired ? 'bg-destructive/5 border-destructive/20 text-destructive' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
           <div>
             <h3 className="font-semibold">{isExpired ? 'Pass Expired!' : 'Pass is Active'}</h3>
             <p className="text-sm opacity-80 mt-1">Current Expiration: {new Date(passData.expiryDate).toLocaleDateString()}</p>
           </div>
           {isExpired && (
             <div className="px-3 py-1 rounded border border-destructive bg-destructive/10 text-xs font-bold uppercase">
               Expired
             </div>
           )}
        </div>

        <form onSubmit={handleRenew}>
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
              <Calendar size={18} /> Select Extension Duration
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['1 month', '3 months', '6 months', '1 year'].map((dur) => (
                <label 
                  key={dur}
                  className={`border rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center transition-all ${
                    duration === dur 
                      ? 'border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary' 
                      : 'border-border hover:border-muted-foreground/50 bg-background text-foreground'
                  }`}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={dur}
                    checked={duration === dur}
                    onChange={(e) => setDuration(e.target.value)}
                    className="sr-only"
                  />
                  <span className="font-bold text-lg block">{dur.split(' ')[0]}</span>
                  <span className="text-sm opacity-70">{dur.split(' ')[1]}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-muted p-5 rounded-xl border border-border mb-8">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Renewal Terms</h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              By renewing, you are extending the validity of your current 
              <strong className="mx-1">{passData.passType.toUpperCase()}</strong> bus pass 
              by {duration}. The renewal will take effect immediately upon successful payment.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full md:w-auto px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg hover:shadow-primary/25 transition-all outline-none flex items-center justify-center gap-2
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-0'}`}
            >
              {isSubmitting ? 'Processing...' : 'Proceed to Checkout'}
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default RenewPassPage;
