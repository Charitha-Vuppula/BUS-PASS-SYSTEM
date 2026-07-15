import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { UploadCloud, File, AlertCircle, MapPin } from 'lucide-react';

const ApplyPassPage = () => {
  const [formData, setFormData] = useState({ 
    duration: '1 month',
    passType: 'general'
  });
  const [files, setFiles] = useState({
    photo: null,
    govtId: null,
    studentId: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingPass, setExistingPass] = useState(false);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user already has a pending or active pass
    const checkStatus = async () => {
      try {
        const response = await api.get(`/pass/status/${user._id}`);
        if (response.data && (response.data.status === 'pending' || response.data.status === 'approved')) {
          setExistingPass(true);
        }
      } catch (err) {
        // Assume 404 means no pass, which is fine to apply
      }
    };
    checkStatus();
  }, [user._id]);

  const handleFileChange = (e, type) => {
    if (e.target.files[0]) {
      setFiles({ ...files, [type]: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.photo || !files.govtId) {
      return setError('Please upload both your Photo and Government ID.');
    }
    if (formData.passType === 'student' && !files.studentId) {
      return setError('Please upload your Student ID.');
    }

    setIsLoading(true);
    setError('');

    const form = new FormData();
    form.append('duration', formData.duration);
    form.append('passType', formData.passType);
    
    // Append files individually so backend can receive them
    form.append('photo', files.photo);
    form.append('govtId', files.govtId);
    if (files.studentId) {
      form.append('studentId', files.studentId);
    }

    try {
      const response = await api.post('/pass/apply', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const passId = response.data.pass._id;
      
      // Navigate to User Dashboard instead of Payment directly, since Admin must verify first
      navigate(`/dashboard`);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  if (existingPass) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-6 rounded-2xl flex items-start gap-4">
          <AlertCircle className="shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-lg mb-1">Application Not Allowed</h3>
            <p>You already have a pending or active bus pass. Please check your Dashboard or renew your existing pass.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Apply for Bus Pass</h1>
        <p className="text-muted-foreground mt-1">Fill out the details below to request a new digital pass.</p>
      </header>

      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 rounded-3xl shadow-sm border border-border">
        
        <div className="space-y-6">
          {/* Pass Type Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2">Pass Category</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {['general', 'student', 'elder', 'disabled'].map((type) => (
                <label 
                  key={type}
                  className={`border rounded-xl p-4 cursor-pointer text-center transition-all ${
                    formData.passType === type 
                      ? 'border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary' 
                      : 'border-border hover:border-muted-foreground/50 text-foreground bg-background'
                  }`}
                >
                  <input
                    type="radio"
                    name="passType"
                    value={type}
                    checked={formData.passType === type}
                    onChange={(e) => setFormData({ ...formData, passType: e.target.value })}
                    className="sr-only"
                  />
                  <span className="font-medium capitalize block">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Duration Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2">Duration</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['1 month', '3 months', '6 months', '1 year'].map((dur) => (
                <label 
                  key={dur}
                  className={`border rounded-xl p-4 cursor-pointer text-center transition-all ${
                    formData.duration === dur 
                      ? 'border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary' 
                      : 'border-border hover:border-muted-foreground/50 text-foreground bg-background'
                  }`}
                >
                  <input
                    type="radio"
                    name="duration"
                    value={dur}
                    checked={formData.duration === dur}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="sr-only"
                  />
                  <span className="font-medium block">{dur.split(' ')[0]}</span>
                  <span className="text-xs opacity-70">{dur.split(' ')[1]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Document Uploads */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b border-border pb-2">Required Documents</h3>
            
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2">Passport Size Photo <span className="text-destructive">*</span></label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 hover:bg-muted/50 transition-colors">
                <input
                  type="file"
                  id="photo"
                  onChange={(e) => handleFileChange(e, 'photo')}
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                />
                <label htmlFor="photo" className="flex flex-col items-center justify-center cursor-pointer">
                  {!files.photo ? (
                    <>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                        <UploadCloud size={24} />
                      </div>
                      <p className="font-medium text-sm mb-1">Upload recent photo</p>
                      <p className="text-xs text-muted-foreground">JPG/PNG (max. 2MB)</p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-3">
                        <File size={24} />
                      </div>
                      <p className="font-medium text-emerald-600 dark:text-emerald-400 text-sm mb-1">{files.photo.name}</p>
                      <p className="text-xs text-muted-foreground">{(files.photo.size / 1024 / 1024).toFixed(2)} MB • Click to replace</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Govt ID */}
            <div>
              <label className="block text-sm font-semibold mb-2">Government ID Proof <span className="text-destructive">*</span></label>
              <div className="border-2 border-dashed border-border rounded-xl p-6 hover:bg-muted/50 transition-colors">
                <input
                  type="file"
                  id="govtId"
                  onChange={(e) => handleFileChange(e, 'govtId')}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                />
                <label htmlFor="govtId" className="flex flex-col items-center justify-center cursor-pointer">
                  {!files.govtId ? (
                    <>
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                        <UploadCloud size={24} />
                      </div>
                      <p className="font-medium text-sm mb-1">Upload Aadhaar, Voter ID, or License</p>
                      <p className="text-xs text-muted-foreground">PDF/JPG/PNG (max. 5MB)</p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-3">
                        <File size={24} />
                      </div>
                      <p className="font-medium text-emerald-600 dark:text-emerald-400 text-sm mb-1">{files.govtId.name}</p>
                      <p className="text-xs text-muted-foreground">{(files.govtId.size / 1024 / 1024).toFixed(2)} MB • Click to replace</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Student ID (Conditional) */}
            {formData.passType === 'student' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-semibold mb-2">Student ID Card <span className="text-destructive">*</span></label>
                <div className="border-2 border-dashed border-primary/50 bg-primary/5 rounded-xl p-6 hover:bg-primary/10 transition-colors">
                  <input
                    type="file"
                    id="studentId"
                    onChange={(e) => handleFileChange(e, 'studentId')}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                  />
                  <label htmlFor="studentId" className="flex flex-col items-center justify-center cursor-pointer">
                    {!files.studentId ? (
                      <>
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-3">
                          <UploadCloud size={24} />
                        </div>
                        <p className="font-medium text-sm mb-1 text-primary">Upload Valid Student ID</p>
                        <p className="text-xs text-primary/70">PDF/JPG/PNG (max. 5MB)</p>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-3">
                          <File size={24} />
                        </div>
                        <p className="font-medium text-emerald-600 dark:text-emerald-400 text-sm mb-1">{files.studentId.name}</p>
                        <p className="text-xs text-muted-foreground">{(files.studentId.size / 1024 / 1024).toFixed(2)} MB • Click to replace</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-xl font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2
              ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
          >
            {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ApplyPassPage;
