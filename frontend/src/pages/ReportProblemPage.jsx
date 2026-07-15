import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  AlertTriangle, 
  Send, 
  CheckCircle, 
  HelpCircle,
  FileText,
  LifeBuoy
} from 'lucide-react';

const ReportProblemPage = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    issueType: 'Technical Issue',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const issueTypes = [
    'Lost Pass',
    'QR Code Not Working',
    'Payment Failure',
    'Technical Issue',
    'Multi-ID Abuse Report',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/reports', {
        ...formData,
        userId: user._id
      });
      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Report Submitted!</h2>
        <p className="text-muted-foreground mb-8">Your ticket has been created. An administrator will review your issue and get back to you shortly.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/25 transition-all"
        >
          Create Another Report
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Report a Problem</h1>
        <p className="text-muted-foreground mt-1">Found an issue? Let us know and we'll fix it immediately.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl border border-border shadow-sm">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Issue Category</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {issueTypes.map((type) => (
                    <label 
                      key={type}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        formData.issueType === type 
                          ? 'bg-primary/5 border-primary text-primary shadow-sm' 
                          : 'bg-muted/30 border-border hover:border-muted-foreground/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="issueType"
                        value={type}
                        checked={formData.issueType === type}
                        onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        formData.issueType === type ? 'border-primary' : 'border-muted-foreground'
                      }`}>
                        {formData.issueType === type && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                      </div>
                      <span className="text-sm font-medium">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Please provide as much detail as possible..."
                  className="w-full px-4 py-3 rounded-2xl bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send size={20} />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-border">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <LifeBuoy className="text-primary" size={20} />
              Help Center
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <HelpCircle className="text-muted-foreground shrink-0" size={18} />
                <p className="text-muted-foreground">Lost passes can be deactivated and reissued for a small fee.</p>
              </div>
              <div className="flex gap-3">
                <AlertTriangle className="text-muted-foreground shrink-0" size={18} />
                <p className="text-muted-foreground">Reporting fraud helps us keep transit fares low for everyone.</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-border">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <FileText className="text-primary" size={20} />
              Recent Tickets
            </h3>
            <div className="text-center py-6">
              <p className="text-xs text-muted-foreground">You haven't submitted any reports yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportProblemPage;
