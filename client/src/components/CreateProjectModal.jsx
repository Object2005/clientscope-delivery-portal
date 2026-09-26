import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export const CreateProjectModal = ({ isOpen, onClose, onCreateProject }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    clientCountry: 'United States',
    budget: '',
    deadline: '',
  });

  const [milestones, setMilestones] = useState([
    { title: 'Phase 1: Architecture & UI Prototype', amount: 3000, deadline: '2026-10-15', status: 'pending' },
    { title: 'Phase 2: Core Backend Microservices & DB', amount: 5000, deadline: '2026-11-20', status: 'pending' },
  ]);

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      { title: '', amount: 0, deadline: '', status: 'pending' },
    ]);
  };

  const handleRemoveMilestone = (index) => {
    setMilestones(milestones.filter((_, idx) => idx !== index));
  };

  const handleMilestoneChange = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.clientName || !formData.budget) {
      alert('Please fill in project title, client, and budget');
      return;
    }

    onCreateProject({
      ...formData,
      milestones,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white">Create New Client Project</h3>
            <p className="text-xs text-slate-400 mt-1">Define project scope, budget, and delivery milestones</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AI-Powered Healthcare CRM"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Scope Description
            </label>
            <textarea
              rows="2"
              placeholder="Summarize deliverables and core technologies..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Client Enterprise Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Zurich Logistics GmbH"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Client Country
              </label>
              <input
                type="text"
                placeholder="e.g. Switzerland / US"
                value={formData.clientCountry}
                onChange={(e) => setFormData({ ...formData, clientCountry: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Total Budget (USD $) *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 15000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Target Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Dynamic Milestones Section */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Milestones & Deliverable Sprints
              </span>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="inline-flex items-center text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Milestone
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {milestones.map((m, idx) => (
                <div key={idx} className="flex items-center space-x-2 bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
                  <input
                    type="text"
                    placeholder={`Milestone ${idx + 1} Name`}
                    value={m.title}
                    onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Amount $"
                    value={m.amount}
                    onChange={(e) => handleMilestoneChange(idx, 'amount', e.target.value)}
                    className="w-24 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono"
                    required
                  />
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              Create Project
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
