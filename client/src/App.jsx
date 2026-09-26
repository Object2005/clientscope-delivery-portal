import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { ProjectCard } from './components/ProjectCard';
import { CreateProjectModal } from './components/CreateProjectModal';
import { ClientModal } from './components/ClientModal';
import { api } from './utils/api';
import { Search, Filter, RefreshCw, FolderPlus } from 'lucide-react';

export function App() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, statsRes] = await Promise.all([
        api.get(`/projects?status=${activeFilter}&search=${encodeURIComponent(searchQuery)}`),
        api.get('/projects/stats/summary')
      ]);

      if (projectsRes.success) setProjects(projectsRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleToggleMilestone = async (projectId, milestoneId, newStatus) => {
    try {
      // Optimistic update
      setProjects((prev) =>
        prev.map((proj) => {
          if (proj._id === projectId) {
            const updatedMilestones = proj.milestones.map((m) =>
              m.id === milestoneId ? { ...m, status: newStatus } : m
            );
            return { ...proj, milestones: updatedMilestones };
          }
          return proj;
        })
      );

      const res = await api.patch(`/projects/${projectId}/milestones/${milestoneId}`, {
        status: newStatus,
      });

      if (res.success && res.data) {
        // Refresh project and stats
        const updatedStats = await api.get('/projects/stats/summary');
        if (updatedStats.success) setStats(updatedStats.data);
      }
    } catch (err) {
      console.error('Failed to toggle milestone:', err);
      fetchData();
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const res = await api.post('/projects', projectData);
      if (res.success && res.data) {
        setProjects([res.data, ...projects]);
        const statsRes = await api.get('/projects/stats/summary');
        if (statsRes.success) setStats(statsRes.data);
      }
    } catch (err) {
      alert(err.message || 'Error creating project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
      const statsRes = await api.get('/projects/stats/summary');
      if (statsRes.success) setStats(statsRes.data);
    } catch (err) {
      alert(err.message || 'Error deleting project');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        onOpenCreateProject={() => setIsCreateModalOpen(true)}
        onOpenClientModal={() => setIsClientModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Delivery Operations
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time milestone progression, billing deliverables, and client sprint acceptance
            </p>
          </div>
          <button
            onClick={fetchData}
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all hover:bg-slate-700 active:scale-95 self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            Sync Dashboard
          </button>
        </div>

        {/* Executive Stats Overview */}
        <StatsOverview stats={stats} />

        {/* Search & Filter Toolbar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 mb-6 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Status Filter Tabs */}
          <div className="flex items-center space-x-1 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'in-progress', label: 'In Progress' },
              { id: 'in-review', label: 'Client Review' },
              { id: 'delivered', label: 'Delivered' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeFilter === tab.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by project or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </form>

        </div>

        {/* Projects List */}
        {loading && projects.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-3" />
            <p className="text-sm">Fetching delivery projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
            <FolderPlus className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">No projects found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              There are no projects matching the current filter criteria. Create a new project to get started.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-md"
            >
              + Create First Project
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onToggleMilestone={handleToggleMilestone}
                onDeleteProject={handleDeleteProject}
              />
            ))}
          </div>
        )}

      </main>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-400">
        <p>
          ClientScope • Enterprise IT Project & Milestone Delivery Portal • Built for 75WAY Campus Placement Drive 2027
        </p>
      </footer>
    </div>
  );
}
