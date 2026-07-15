import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  Users, CreditCard, FileText, CheckCircle, XCircle, 
  BarChart3, TrendingUp, AlertCircle, Eye
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const AdminDashboard = ({ view = 'analytics' }) => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for document modal
  const [selectedDocs, setSelectedDocs] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, appsRes] = await Promise.all([
          api.get('/admin/analytics'),
          api.get('/admin/applications')
        ]);
        
        setStats(analyticsRes.data);
        setApplications(appsRes.data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  // Protect route
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  const handleViewDocuments = async (userId) => {
    try {
      const res = await api.get(`/admin/documents/${userId}`);
      setSelectedDocs(res.data);
      setIsModalOpen(true);
    } catch (err) {
      alert('Failed to fetch documents');
    }
  };

  const handleAction = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this application?`)) return;
    
    setVerifyingId(id);
    try {
      await api.put(`/admin/${action}/${id}`);
      // Optimistic update
      setApplications(applications.map(app => 
        app._id === id 
          ? { ...app, status: action === 'approve' ? 'payment_pending' : 'rejected' } 
          : app
      ));
      
      // Update stats optimistically
      setStats(prev => ({
        ...prev,
        pendingPassesCount: prev.pendingPassesCount - 1
      }));
      
    } catch (err) {
      alert(`Failed to ${action} application`);
    } finally {
      setVerifyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const pendingApps = applications.filter(app => app.status === 'pending');

  const renderAnalytics = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-primary shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground font-medium text-xs mb-1 uppercase tracking-wider">Total Active Passes</p>
              <h3 className="text-3xl font-bold">{stats?.activePassesCount || 0}</h3>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-amber-500 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground font-medium text-xs mb-1 uppercase tracking-wider">Pending Verifications</p>
              <h3 className="text-3xl font-bold">{stats?.pendingPassesCount || 0}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <FileText size={22} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-emerald-500 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground font-medium text-xs mb-1 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-3xl font-bold">₹{stats?.totalRevenue?.toLocaleString() || 0}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <CreditCard size={22} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-purple-500 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground font-medium text-xs mb-1 uppercase tracking-wider">System Health</p>
              <h3 className="text-2xl font-bold text-emerald-500 mt-1">Operational</h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
              <BarChart3 size={22} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-border/50 shadow-sm overflow-hidden min-w-0">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <TrendingUp size={18} />
            </div>
            <h3 className="text-lg font-bold">Revenue Trend (6 Months)</h3>
          </div>
          <div className="h-72 w-full min-w-0">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={stats?.monthlyRevenue || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'var(--primary)', opacity: 0.05 }}
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    borderColor: 'var(--border)', 
                    borderRadius: '12px', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    border: '1px solid var(--border)'
                  }}
                  itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col min-w-0">
          <h3 className="text-lg font-bold mb-8">Active Passes by Type</h3>
          <div className="flex-1 flex items-center justify-center relative min-h-[250px] w-full min-w-0">
            {(stats?.passTypeData && stats.passTypeData.length > 0) ? (
              <ResponsiveContainer width="99%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.passTypeData}
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {stats.passTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
                <div className="text-center">
                  <BarChart3 size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-muted-foreground text-sm">No active passes.</p>
                </div>
            )}
            
            {/* Legend for Pie */}
            <div className="absolute bottom-2 w-full flex flex-wrap justify-center gap-4 text-xs font-medium">
              {stats?.passTypeData?.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
          <FileText size={18} />
        </div>
        Verification Queue
        <span className="ml-2 bg-amber-500/10 text-amber-500 text-xs px-2.5 py-1 rounded-full font-bold">{pendingApps.length} Pending</span>
      </h2>
      
      <div className="glass-card rounded-3xl overflow-hidden border border-border/50 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 text-muted-foreground text-[10px] uppercase tracking-[2px] font-bold">
              <tr>
                <th className="px-6 py-5">Applicant</th>
                <th className="px-6 py-5">Pass Type</th>
                <th className="px-6 py-5">Duration</th>
                <th className="px-6 py-5">Submitted</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {pendingApps.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-muted-foreground">
                    <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="opacity-40 text-emerald-500" size={32} />
                    </div>
                    <p className="font-bold text-lg text-foreground mb-1">Queue is Empty!</p>
                    <p className="text-sm">Great job! There are no pending applications left to review.</p>
                  </td>
                </tr>
              ) : (
                pendingApps.map((app) => (
                  <tr key={app._id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/20 to-blue-500/20 flex items-center justify-center text-primary font-bold text-xs">
                          {app.userId?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{app.userId?.name || 'Unknown User'}</p>
                          <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors">{app.userId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 bg-muted rounded-full text-xs font-bold capitalize">{app.passType}</span>
                    </td>
                    <td className="px-6 py-5 font-medium text-sm">{app.duration}</td>
                    <td className="px-6 py-5 text-xs text-muted-foreground font-medium">
                      {new Date(app.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => handleViewDocuments(app.userId?._id)}
                          className="p-2 text-blue-500 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 rounded-xl transition-all"
                          title="View Documents"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleAction(app._id, 'approve')}
                          disabled={verifyingId === app._id}
                          className="p-2 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl transition-all disabled:opacity-50"
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleAction(app._id, 'reject')}
                          disabled={verifyingId === app._id}
                          className="p-2 text-destructive bg-destructive/5 hover:bg-destructive/10 border border-destructive/20 rounded-xl transition-all disabled:opacity-50"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <header className="mb-10 animate-in slide-in-from-top-4 duration-500">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          {view === 'analytics' ? 'Dashboard Analytics' : 'Pass Verifications'}
        </h1>
        <p className="text-muted-foreground mt-2 font-medium">
          {view === 'analytics' 
            ? 'Comprehensive overview of transport system performance' 
            : 'Manage and verify pending bus pass applications.'}
        </p>
      </header>

      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 p-4 mb-8 rounded-2xl flex items-center gap-3 animate-in zoom-in duration-300">
          <AlertCircle size={20} />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {view === 'analytics' ? renderAnalytics() : renderRequests()}

      {/* Document Viewer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-4xl rounded-[32px] shadow-2xl border border-border/50 overflow-hidden flex flex-col max-h-[90vh] scale-in-center">
            <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-black text-xl">Applicant Evidence</h3>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-0.5">Verification Required</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-muted hover:bg-muted-foreground/10 rounded-full transition-all text-muted-foreground hover:text-foreground"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
              {!selectedDocs || selectedDocs.length === 0 ? (
                <div className="text-center py-20">
                   <AlertCircle size={48} className="mx-auto mb-4 opacity-10" />
                   <p className="text-muted-foreground font-medium">No verification documents were provided for this user.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {selectedDocs.map((doc, idx) => (
                    <div key={idx} className="glass-card border border-border/50 rounded-2xl overflow-hidden group shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                      <div className="p-4 border-b border-border/50 font-bold text-xs flex justify-between items-center group-hover:bg-primary group-hover:text-white transition-colors">
                        {doc.documentType.toUpperCase()}
                        <span className={`text-[9px] px-2.5 py-1 rounded-full uppercase tracking-tighter ${
                          doc.verificationStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-500 group-hover:bg-white/20 group-hover:text-white' : 'bg-amber-500/20 text-amber-500 group-hover:bg-white/20 group-hover:text-white'
                        }`}>
                          {doc.verificationStatus}
                        </span>
                      </div>
                      <div className="aspect-[4/3] bg-muted/10 relative cursor-pointer overflow-hidden flex items-center justify-center p-2"
                           onClick={() => window.open(`http://localhost:5000${doc.fileURL}`, '_blank')}>
                        {doc.fileURL.endsWith('.pdf') ? (
                          <div className="flex flex-col items-center gap-3">
                            <FileText size={56} className="text-primary group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold text-muted-foreground">CLICK TO VIEW PDF</span>
                          </div>
                        ) : (
                          <img 
                            src={`http://localhost:5000${doc.fileURL}`} 
                            alt={doc.documentType} 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                          />
                        )}
                        <div className="hidden absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/20">
                           <AlertCircle size={32} className="text-destructive/50" />
                           <span className="text-[10px] font-bold text-muted-foreground px-4 text-center">FILE FAILED TO LOAD</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
