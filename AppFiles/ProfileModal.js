// ProfileModal.js - Profile Component
import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Edit2, Trash2, Plus, Heart, Package, Home, Building } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose, user, authService, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: ''
  });

  // Address form state
  const [addressForm, setAddressForm] = useState({
    type: 'Home',
    address: '',
    landmark: '',
    pincode: ''
  });
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleClose = () => {
    setActiveTab('profile');
    setEditing(false);
    setShowAddressForm(false);
    setEditingAddress(null);
    setError('');
    onClose();
  };

  const handleUpdateProfile = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await authService.updateProfile(profileForm);
      if (response.success) {
        onUpdateUser(response.user);
        setEditing(false);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await authService.addAddress(addressForm);
      if (response.success) {
        onUpdateUser({ ...user, addresses: [...user.addresses, response.address] });
        setAddressForm({ type: 'Home', address: '', landmark: '', pincode: '' });
        setShowAddressForm(false);
      } else {
        setError(response.message || 'Failed to add address');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await authService.updateAddress(editingAddress.id, addressForm);
      if (response.success) {
        const updatedAddresses = user.addresses.map(addr => 
          addr.id === editingAddress.id ? response.address : addr
        );
        onUpdateUser({ ...user, addresses: updatedAddresses });
        setEditingAddress(null);
        setAddressForm({ type: 'Home', address: '', landmark: '', pincode: '' });
      } else {
        setError(response.message || 'Failed to update address');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    setLoading(true);

    try {
      const response = await authService.deleteAddress(addressId);
      if (response.success) {
        const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
        onUpdateUser({ ...user, addresses: updatedAddresses });
      }
    } catch (error) {
      setError('Failed to delete address');
    } finally {
      setLoading(false);
    }
  };

  const startEditingAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      type: address.type,
      address: address.address,
      landmark: address.landmark,
      pincode: address.pincode
    });
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'addresses', name: 'Addresses', icon: MapPin },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'favorites', name: 'Favorites', icon: Heart }
  ];

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full max-w-md mx-auto rounded-t-2xl max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Profile</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-2 text-sm font-medium flex items-center justify-center ${
                  activeTab === tab.id
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-1" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] p-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="text-center pb-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">{user.name || 'Complete your profile'}</h3>
                <p className="text-gray-500 text-sm">+91 {user.phone}</p>
              </div>

              {!editing ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Name</p>
                        <p className="text-gray-600">{user.name || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-gray-600">{user.email || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-gray-600">+91 {user.phone}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditing(true)}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Saved Addresses</h3>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center text-green-600 hover:text-green-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add New
                </button>
              </div>

              {user.addresses.map((address) => {
                const IconComponent = address.type === 'Home' ? Home : Building;
                return (
                  <div key={address.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <IconComponent className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-medium text-sm">{address.type}</span>
                            {address.isDefault && (
                              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                          <p className="text-xs text-gray-500">{address.landmark}</p>
                          <p className="text-xs text-gray-500">PIN: {address.pincode}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditingAddress(address)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {user.addresses.length === 0 && (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No addresses saved</p>
                </div>
              )}

              {/* Address Form */}
              {(showAddressForm || editingAddress) && (
                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-medium">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={addressForm.type}
                      onChange={(e) => setAddressForm({...addressForm, type: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={addressForm.address}
                      onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter full address"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
                    <input
                      type="text"
                      value={addressForm.landmark}
                      onChange={(e) => setAddressForm({...addressForm, landmark: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Nearby landmark"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input
                      type="text"
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="6-digit pincode"
                      maxLength={6}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      {loading ? 'Saving...' : (editingAddress ? 'Update' : 'Save')}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingAddress(null);
                        setAddressForm({ type: 'Home', address: '', landmark: '', pincode: '' });
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Order History</h3>
              
              {user.orderHistory && user.orderHistory.length > 0 ? (
                user.orderHistory.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{order.id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                    <div className="text-sm text-gray-600 mb-2">
                      {order.items.map((item, index) => (
                        <div key={index}>
                          {item.name} x {item.quantity}
                        </div>
                      ))}
                    </div>
                    <p className="font-medium">₹{order.total}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No orders yet</p>
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Favorite Items</h3>
              
              {user.favorites && user.favorites.length > 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-red-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    You have {user.favorites.length} favorite items
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No favorites yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
