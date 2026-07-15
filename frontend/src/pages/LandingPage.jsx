import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bus, 
  ChevronDown, 
  ShieldCheck, 
  User, 
  ArrowRight, 
  Zap, 
  Shield, 
  CreditCard,
  Clock
} from 'lucide-react';

const LandingPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const loginOptions = [
    { 
      name: 'Passenger Login', 
      path: '/login', 
      icon: <User className="text-primary" size={18} />,
      desc: 'Apply for or manage your bus pass'
    },
    { 
      name: 'Admin Login', 
      path: '/admin/login', 
      icon: <ShieldCheck className="text-amber-500" size={18} />,
      desc: 'Verify applications & view analytics'
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b border-border/50 bg-white/70 dark:bg-black/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Bus size={22} />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              BusPass
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Login As
              <ChevronDown size={18} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full mt-3 right-0 w-64 glass-card rounded-2xl border border-border shadow-2xl p-2 animate-in fade-in slide-in-from-top-2">
                {loginOptions.map((option) => (
                  <button
                    key={option.path}
                    onClick={() => navigate(option.path)}
                    className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
                  >
                    <div className="mt-0.5 p-2 rounded-lg bg-background border border-border group-hover:bg-muted group-hover:scale-110 transition-all">
                      {option.icon}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{option.name}</p>
                      <p className="text-[11px] text-muted-foreground">{option.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <Zap size={14} />
              NFC Enabled Transit
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              The Future of <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Smart Transit</span> Is Here
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
              Apply for your digital bus pass in minutes. Securely manage, renew, and ride with ease using our advanced NFC and QR-coded smart card system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register" 
                className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/25 hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                Apply for Pass
                <ArrowRight size={20} />
              </Link>
              <button 
                className="px-8 py-4 rounded-2xl bg-muted text-foreground font-bold hover:bg-muted/80 transition-all flex items-center justify-center gap-2"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
             {/* Iridescent Futuristic Digital Pass */}
             <div className="relative z-10 w-full aspect-[1.6/1] rounded-[32px] bg-[#05111b] p-8 text-white shadow-2xl overflow-hidden border border-white/10 group hover:translate-y-[-4px] transition-transform duration-700">
                {/* Modern Gradient Sweep */}
                <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-emerald-500/20 via-teal-500/10 to-transparent pointer-events-none"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px]"></div>
                
                {/* Holographic Circuit Pattern (Abstract) */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 250">
                  <defs>
                    <linearGradient id="holo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff00ff" />
                      <stop offset="50%" stopColor="#00ffff" />
                      <stop offset="100%" stopColor="#ffff00" />
                    </linearGradient>
                  </defs>
                  <circle cx="80" cy="120" r="50" fill="none" stroke="url(#holo-grad)" strokeWidth="0.5" strokeDasharray="5,5" />
                  <path d="M130,120 L160,120 L170,110 L200,110" fill="none" stroke="white" strokeWidth="0.2" opacity="0.5" />
                  <path d="M130,130 L150,130 L160,140 L220,140" fill="none" stroke="white" strokeWidth="0.2" opacity="0.3" />
                </svg>

                {/* Card Content */}
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight leading-none mb-1">DIGITAL BUS PASS</h2>
                      <div className="h-0.5 w-12 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"></div>
                    </div>
                    {/* Abstract ID chip visual */}
                    <div className="w-12 h-14 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg p-1.5 border border-white/20 shadow-inner">
                        <div className="w-full h-full rounded bg-gradient-to-br from-gray-400 to-gray-600 grid grid-cols-3 gap-0.5 opacity-40">
                          {Array(9).fill(0).map((_, i) => <div key={i} className="bg-black/20"></div>)}
                        </div>
                    </div>
                  </div>

                  <div className="mt-auto flex justify-between items-end">
                    <div className="space-y-4">
                      {/* Realistic Labels */}
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-[2px] text-teal-400/80 mb-1">Passenger Identification</p>
                        <p className="text-xl font-bold tracking-wide">BP-9876-5432</p>
                      </div>
                      
                      <div className="flex gap-10">
                        <div>
                          <p className="text-[9px] uppercase font-bold tracking-[2px] text-white/40 mb-1">Valid Until</p>
                          <p className="text-sm font-mono tracking-widest">12 / 2025</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                           <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Status</span>
                        </div>
                      </div>

                      {/* Small holographic bus icon */}
                      <div className="pt-2">
                         <Bus size={20} className="text-emerald-400/60" />
                      </div>
                    </div>

                    {/* Large "Iridescent" Bus Visual */}
                    <div className="relative w-48 h-32 opacity-80 group-hover:opacity-100 transition-opacity">
                       <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 via-indigo-500/20 to-emerald-400/20 blur-2xl rounded-full"></div>
                       <div className="relative flex flex-col items-center justify-center h-full">
                          <Bus size={100} className="text-white/10 absolute rotate-[-15deg] scale-125" />
                          <div className="relative">
                            <Bus size={64} className="text-transparent stroke-white/40 stroke-1" />
                            {/* Holographic light sweep animation */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                          </div>
                          <div className="mt-4 flex items-center gap-1">
                             <div className="w-1 h-1 rounded-full bg-teal-400"></div>
                             <div className="w-16 h-[1px] bg-gradient-to-r from-teal-400 to-transparent"></div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
                
                {/* Chip circuit outline glow */}
                <div className="absolute top-8 right-8 w-12 h-14 rounded-lg border border-teal-400/30 opacity-0 group-hover:opacity-100 transition-opacity blur-[2px]"></div>
             </div>
             
             {/* Background elements */}
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[80px]"></div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-[80px]"></div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section id="features" className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose BusPass?</h2>
            <p className="text-muted-foreground">Modern solutions for a smoother daily commute.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Shield className="text-blue-500" />, title: "Secure Authentication", desc: "Dual verification using email and phone OTPs." },
              { icon: <CreditCard className="text-emerald-500" />, title: "Instant Smart Card", desc: "Get a premium digital pass instantly after approval." },
              { icon: <Zap className="text-amber-500" />, title: "NFC & QR Verification", desc: "Scan and ride with advanced verification tech." },
              { icon: <Clock className="text-purple-500" />, title: "Auto-Reminders", desc: "Never forget a renewal with automated notifications." },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-3xl border border-border hover:translate-y-[-5px] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6 shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-primary-10)_0%,_transparent_70%)] opacity-50 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-400/20 rounded-[40px] rotate-6 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-purple-400/20 to-emerald-400/20 rounded-[40px] -rotate-3 transition-transform hover:rotate-0 duration-700"></div>
                <div className="relative h-full glass-card rounded-[40px] border border-border/50 flex flex-col items-center justify-center p-12 text-center overflow-hidden">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-glow">
                    <ShieldCheck size={40} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Empowering cities with smart, secure, and seamless transit solutions that make public transportation more accessible for everyone.
                  </p>
                  
                  {/* Digital pulse line */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-shine"></div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <h3 className="text-primary font-bold uppercase tracking-[4px] text-sm mb-4">About the System</h3>
                <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-[1.1]">
                  Redefining the <br />
                  <span className="text-muted-foreground">Commute Experience</span>
                </h2>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                BusPass is a cloud-native, MERN-stack powered transit authority platform. We leverage bleeding-edge technologies like **NFC authentication**, **Automated Biometric Verification**, and **Instant Digital Issuance** to eliminate queues and paperwork.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-3xl font-black text-primary">10x</p>
                  <p className="text-sm font-bold opacity-60 uppercase tracking-widest">Faster Issuance</p>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-black text-primary">100%</p>
                  <p className="text-sm font-bold opacity-60 uppercase tracking-widest">Paperless</p>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-muted/50 border border-border">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-sm font-medium">System Online</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-muted/50 border border-border">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium">v2.0 Stable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Bus className="text-primary" size={24} />
              <span className="font-bold text-xl">BusPass</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 BusPass Smart Systems. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/about" className="hover:text-primary transition-colors text-sm font-medium">About</Link>
              <a href="#" className="hover:text-primary transition-colors text-sm font-medium">GitHub</a>
              <a href="#" className="hover:text-primary transition-colors text-sm font-medium">Support</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
