import React, { useState, useEffect, useContext, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Nfc, Clock, MapPin, Bus, Verified, Shield, Download } from 'lucide-react';
import { toPng } from 'html-to-image';

const DigitalPassPage = () => {
  const { user } = useContext(AuthContext);
  const [passData, setPassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

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

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setDownloading(true);
    try {
      // Small delay to ensure any hover animations settle
      await new Promise(resolve => setTimeout(resolve, 500));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 4, // Ultra high resolution
        backgroundColor: '#010810',
        style: {
          transform: 'none',
          perspective: 'none',
          // Explicitly kill any potential artifacts
          outline: 'none',
          border: 'none',
          boxShadow: 'none'
        },
        // Filter out unnecessary elements
        filter: (node) => {
          return node?.id !== 'download-btn';
        }
      });

      const link = document.createElement('a');
      link.download = `SmartPass-${passData.passId || 'Digital'}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Capture failed. Please try again or take a manual screenshot.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Cannot display if no active pass
  if (!passData || passData.status !== 'active') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-6">
          <Clock size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Active Pass Found</h2>
        <p className="text-muted-foreground max-w-sm mb-6">
          Your pass application might still be pending approval or payment. Please check your dashboard for the current status.
        </p>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-start py-8 px-4 bg-background overflow-y-auto animate-in fade-in duration-700">
      
      <div className="text-center mb-8 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-500">
          Smart Transit System
        </h1>
        <p className="text-sm text-muted-foreground mt-1 uppercase tracking-widest opacity-70">NFC-Enabled Pass</p>
      </div>

      {/* The Holographic Card - Adjusted for Visibility */}
      <div 
        ref={cardRef}
        data-card-container="true"
        className="relative w-full max-w-2xl aspect-[1.6/1] shrink-0 rounded-[24px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] group perspective-2000"
      >
        
        {/* Base Gradient Background */}
        <div className="absolute inset-0 bg-[#010810] transition-all duration-700 bg-[radial-gradient(circle_at_70%_20%,_#0a2e3d_0%,_transparent_50%),_radial-gradient(circle_at_20%_80%,_#0a2318_0%,_transparent_50%)]"></div>
        
        {/* Circuitry Pattern Background */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none stroke-cyan-500/30" viewBox="0 0 400 240">
           <path d="M0,50 L40,50 L60,70 L140,70 M120,10 L120,50 L100,70" fill="none" strokeWidth="0.5" />
           <path d="M300,240 L300,180 L340,140 L400,140" fill="none" strokeWidth="0.5" />
           <path d="M400,30 L350,30 L330,50 L250,50" fill="none" strokeWidth="0.5" />
        </svg>

        {/* Global Rainbow Light Sweep */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-1000 pointer-events-none overflow-hidden">
          <div className="absolute top-0 -left-[100%] w-[300%] h-full bg-gradient-to-r from-transparent via-cyan-300/10 via-purple-300/10 via-emerald-300/10 to-transparent skew-x-[-35deg] animate-rainbow-shine"></div>
        </div>

        <div className="relative h-full flex flex-col p-8 z-10 text-white select-none">
          
          {/* TOP SECTION */}
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-3xl sm:text-4xl font-black tracking-[4px] bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white transition-all duration-1000 uppercase italic">
              DIGITAL BUS PASS
            </h2>
            
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/30 to-blue-500/30 border border-white/10 flex items-center justify-center backdrop-blur-md">
               <Bus size={20} className="text-cyan-300" />
            </div>
          </div>

          <div className="flex-1 flex items-center justify-between">
             
             {/* LEFT Center: Chip Box */}
             <div className="relative scale-90 sm:scale-100 origin-left">
                <div className="absolute -inset-12 rounded-full bg-gradient-to-tr from-cyan-500 via-purple-500 to-emerald-500 opacity-20 blur-[25px] animate-pulse"></div>
                <div className="absolute -inset-10 rounded-full border-[8px] border-transparent bg-gradient-to-tr from-cyan-400 via-purple-400 to-emerald-400 opacity-25 blur-[1px]"></div>
                
                <div className="relative z-20 w-20 h-16 rounded-xl bg-gradient-to-br from-zinc-300 via-white to-zinc-400 p-[1px] shadow-2xl flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 flex flex-col justify-around py-3">
                      <div className="w-full h-[1px] bg-black/10"></div>
                      <div className="w-full h-[1px] bg-black/10"></div>
                   </div>
                   <div className="w-16 h-12 bg-gradient-to-br from-zinc-100 to-zinc-200 rounded-lg flex items-center justify-center">
                       <Nfc size={32} className="text-zinc-500/50" />
                   </div>
                </div>
             </div>

             {/* RIGHT Center: Wide Bus Silhouette */}
             <div className="relative w-48 sm:w-64 h-24 opacity-60 group-hover:opacity-90 transition-all duration-700">
                <svg viewBox="0 0 240 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                   <path 
                     d="M20,40 L200,40 C215,40 225,50 225,65 L225,85 L20,85 Z" 
                     fill="none" 
                     stroke="url(#pass-rainbow)" 
                     strokeWidth="3" 
                   />
                   <rect x="50" y="45" width="40" height="25" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
                   <rect x="100" y="45" width="40" height="25" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.2" />
                   <circle cx="50" cy="85" r="7" fill="none" stroke="url(#pass-rainbow)" strokeWidth="2" />
                   <circle cx="170" cy="85" r="7" fill="none" stroke="url(#pass-rainbow)" strokeWidth="2" />
                   <defs>
                     <linearGradient id="pass-rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
                       <stop offset="0%" stopColor="#22d3ee" />
                       <stop offset="50%" stopColor="#a855f7" />
                       <stop offset="100%" stopColor="#10b981" />
                     </linearGradient>
                   </defs>
                </svg>
             </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="mt-auto flex justify-between items-end gap-4 overflow-hidden">
            <div className="space-y-2 min-w-0">
               <div className="space-y-0.5">
                  <p className="text-[10px] font-bold tracking-[2px] text-cyan-400 opacity-80 uppercase">Card No:</p>
                  <p className="text-lg sm:text-xl font-mono text-white tracking-[2px] truncate">{passData.passId}</p>
               </div>
               <div className="space-y-0.5">
                  <p className="text-[10px] font-bold tracking-[2px] text-emerald-400 opacity-80 uppercase">Valid Until:</p>
                  <p className="text-base sm:text-lg font-mono text-zinc-100">{new Date(passData.expiryDate).toLocaleDateString('en-GB', { month: '2-digit', year: 'numeric' })}</p>
               </div>
               
               <div className="pt-1">
                  <div className="inline-flex items-center gap-2 px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 rounded">
                     <Bus size={12} className="text-emerald-400" />
                     <span className="text-[9px] font-black tracking-[2px] text-emerald-500 uppercase">{passData.passType} ACCESS</span>
                  </div>
               </div>
            </div>

            <div className="text-right flex flex-col items-end gap-0.5 min-w-0">
               <p className="text-[9px] text-zinc-500 font-bold tracking-[3px] uppercase">Passenger</p>
               <h3 className="text-xl sm:text-2xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-l from-white to-zinc-500 truncate w-full">
                  {user.name.toUpperCase()}
               </h3>
               <div className="w-24 h-[1px] bg-gradient-to-l from-cyan-400 to-transparent"></div>
            </div>
          </div>

        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes rainbow-shine {
            from { transform: translateX(-100%) skewX(-35deg); filter: hue-rotate(0deg); }
            to { transform: translateX(200%) skewX(-35deg); filter: hue-rotate(360deg); }
          }
          .animate-rainbow-shine { animation: rainbow-shine 6s ease-in-out infinite; }
          .perspective-2000 { perspective: 2000px; }
        `}} />
      </div>

      <div className="mt-8 flex flex-col items-center gap-6 shrink-0">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-primary shadow-xl backdrop-blur-md">
                <Nfc size={28} />
            </div>
            
            <button 
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all group"
            >
              {downloading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              ) : (
                <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
              )}
              {downloading ? 'Generating...' : 'Download Pass'}
            </button>
         </div>
         
         <p className="text-[10px] font-black tracking-[4px] text-muted-foreground uppercase opacity-60">
            Hold Near Terminal or Download for Offline Use
         </p>
      </div>

    </div>
  );
};

export default DigitalPassPage;
