import React, { useState, useEffect } from 'react';
import { X, Building2, Globe2, Mail, Phone, Plus } from 'lucide-react';
import { api } from '../utils/api';

export const ClientModal = ({ isOpen, onClose }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    country: 'United States',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/clients');
      if (res.success && res.data) {
        setClients(res.data);
      }
    } catch (err) {
      console.error('Failed to load clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/clients', newClient);
      if (res.success && res.data) {
        setClients([res.data, ...clients]);
        setShowAddForm(false);
        setNewClient({ name: '', company: '', country: 'United States', email: '', phone: '' });
      }
    } catch (err) {
      alert(err.message || 'Error creating client');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white">Enterprise Clients Directory</h3>
            <p className="text-xs text-slate-400 mt-1">International accounts managed by 75WAY</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Accounts ({clients.length})
            </span>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              <Plus className="w-4 h-4 mr-1" />
              {showAddForm ? 'Cancel Form' : 'Register New Client'}
            </button>
          </div>

          {/* Add Client Form */}
          {showAddForm && (
            <form onSubmit={handleCreateClient} className="mb-6 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Primary Contact Name *"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Enterprise / Company Name *"
                  value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="email"
                  required
                  placeholder="Official Email Address *"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Country (e.g. United Kingdom)"
                  value={newClient.country}
                  onChange={(e) => setNewClient({ ...newClient, country: e.target.value })}
                  className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg"
              >
                Save Client to Database
              </button>
            </form>
          )}

          {/* Clients List */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {clients.map((c) => (
              <div
                key={c._id}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-white">{c.company}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {c.country}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1.5 text-xs text-slate-400">
                    <span>Contact: <strong className="text-slate-300">{c.name}</strong></span>
                    <span className="flex items-center"><Mail className="w-3 h-3 mr-1" /> {c.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
