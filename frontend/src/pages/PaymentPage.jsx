import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CreditCard, CheckCircle2 } from 'lucide-react';

const PaymentPage = () => {
  const { passId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Amount from DB/User Selection (using fixed for now as per previous logic)
  const amount = 50.00;

  const handlePayment = async () => {
    setIsLoading(true);
    setError('');

    try {
      // 1-Click Fake Payment validation on the Backend
      await api.post('/pass/pay', { passId, amount });
      
      setIsSuccess(true);
      setTimeout(() => navigate('/pass'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment.');
    } finally {
      setIsLoading(false);
    }
  };


  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)] animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-center">Payment Successful!</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Your payment of ${amount.toFixed(2)} was received. Your digital bus pass is now **Activated**!
        </p>
        <div className="animate-pulse flex gap-2 items-center text-sm font-medium text-primary">
          Opening your digital pass...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Complete Payment</h1>
        <p className="text-muted-foreground mt-1">Review items and process your secure payment.</p>
      </header>

      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      <div className="glass-card p-8 rounded-3xl shadow-sm border border-border">
        {/* Order Summary */}
        <div className="bg-muted p-6 rounded-2xl mb-8">
          <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Order Summary</h3>
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium">Bus Pass Application</span>
            <span className="font-medium">${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground mb-6">
            <span>Processing Fee</span>
            <span>$0.00</span>
          </div>
          <div className="border-t border-border pt-4 flex justify-between items-center">
            <span className="font-bold text-lg">Total Due</span>
            <span className="font-bold text-2xl text-primary">${amount.toFixed(2)}</span>
          </div>
        </div>

        {/* 1-Tap Fake Payment Button */}
        <div className="space-y-5">
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className={`w-full py-4 mt-4 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg hover:shadow-primary/25 transition-all text-lg flex items-center justify-center gap-2
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 active:translate-y-0'}`}
          >
            {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>}
            {isLoading ? 'Processing...' : `Pay $${amount.toFixed(2)} with 1-Tap Pay`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
