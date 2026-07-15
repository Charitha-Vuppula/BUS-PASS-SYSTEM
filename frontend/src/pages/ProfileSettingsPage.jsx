import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Camera, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Palette,
  Image as ImageIcon
} from 'lucide-react';

const ProfileSettingsPage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.photoURL ? `http://localhost:5000${user.photoURL}` : null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      if (profilePhoto) {
        data.append('photo', profilePhoto);
      }

      const response = await api.put('/user/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUser({ ...user, ...response.data });
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Update failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setStatus({ type: 'error', message: 'Passwords do not match' });
    }

    setIsLoading(true);
    try {
      await api.put('/user/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setStatus({ type: 'success', message: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Password update failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile information and security preferences.</p>
      </header>

      {status.message && (
        <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 animate-in slide-in-from-top-2 ${
          status.type === 'success' 
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
            : 'bg-destructive/10 text-destructive border-destructive/20'
        }`}>
          {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm font-medium">{status.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-border flex flex-col items-center text-center">
            <div className="relative group mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background bg-muted flex items-center justify-center shadow-inner relative">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={64} className="text-muted-foreground" />
                )}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" size={24} />
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full border-4 border-background flex items-center justify-center text-white">
                <Camera size={14} />
              </div>
            </div>
            <h2 className="font-bold text-xl">{user?.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest leading-none">
              {user?.role}
            </div>
          </div>
        </div>

        {/* Edit Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Info */}
          <div className="glass-card p-8 rounded-3xl border border-border">
            <div className="flex items-center gap-2 mb-6">
              <User className="text-primary" size={20} />
              <h3 className="text-lg font-bold">Personal Information</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-semibold ml-1">Address</label>
                   <input
                     type="text"
                     name="address"
                     value={formData.address}
                     onChange={handleChange}
                     className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                   />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={18} />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Security */}
          <div className="glass-card p-8 rounded-3xl border border-border">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="text-primary" size={20} />
              <h3 className="text-lg font-bold">Security & Password</h3>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
