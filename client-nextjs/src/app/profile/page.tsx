'use client';

import MainLayout from '@/components/layout/MainLayout';
import { useWallet } from '@/contexts/WalletContext';
import { useState } from 'react';
import { User, Mail, Calendar, Edit, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { account, isConnected } = useWallet();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    email: 'user@example.com',
    name: 'John Doe',
    joinDate: '2024-01-15',
    totalTrades: 156,
    winRate: 68.5,
    totalProfit: 2450.75
  });

  const [editForm, setEditForm] = useState({
    email: profile.email,
    name: profile.name
  });

  const handleEdit = () => {
    setEditForm({
      email: profile.email,
      name: profile.name
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(prev => ({
        ...prev,
        email: editForm.email,
        name: editForm.name
      }));
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditForm({
      email: profile.email,
      name: profile.name
    });
    setIsEditing(false);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">Profile</h1>
              <p className="text-gray-400">Manage your account information</p>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Edit size={18} />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Save size={18} />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Personal Information</h2>
            
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <User size={20} className="text-gray-400" />
                    <span className="text-white">{profile.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <Mail size={20} className="text-gray-400" />
                    <span className="text-white">{profile.email}</span>
                  </div>
                )}
              </div>

              {/* Wallet Address */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Wallet Address
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-white font-mono">
                    {isConnected ? account : 'Not connected'}
                  </span>
                </div>
              </div>

              {/* Join Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Member Since
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <Calendar size={20} className="text-gray-400" />
                  <span className="text-white">
                    {new Date(profile.joinDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-6">
            {/* Trading Stats */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Trading Statistics</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Trades</span>
                  <span className="text-white font-semibold">{profile.totalTrades}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="text-green-400 font-semibold">{profile.winRate}%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Profit</span>
                  <span className="text-green-400 font-semibold">
                    ${profile.totalProfit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Account Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Email Verified</span>
                  <span className="text-green-400">✓</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Wallet Connected</span>
                  <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                    {isConnected ? '✓' : '✗'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">KYC Status</span>
                  <span className="text-yellow-400">Pending</span>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Security</h3>
              
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                  Change Password
                </button>
                
                <button className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                  Enable 2FA
                </button>
                
                <button className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors">
                  Login History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
