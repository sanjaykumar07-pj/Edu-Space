"use client";

import { useAuth } from '@/contexts/AuthContext';
import ContributionGrid from '@/components/ContributionGrid';
import EmptyState from '@/components/EmptyState';
import { useState, useEffect } from 'react';
import { useReward } from '@/contexts/RewardContext';
import { REWARDS } from '@/lib/rewardLogic';

export default function MyProjects() {
  const { user } = useAuth();
  const { awardXP } = useReward();
  const [projects, setProjects] = useState([]);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');

  const fetchProjects = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProjects(data.filter(p => p.studentId === user.id));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title && description && link && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            link,
            studentId: user.id
          })
        });

        if (res.ok) {
          setTitle('');
          setDescription('');
          setLink('');
          awardXP(REWARDS.PROJECT_SUBMITTED.amount, REWARDS.PROJECT_SUBMITTED.reason);
          await fetchProjects();
        } else {
          alert('Failed to submit project');
        }
      } catch (error) {
        console.error('Error submitting project:', error);
        alert('An error occurred');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async (projectId) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const res = await fetch(`/api/projects?id=${projectId}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          fetchProjects(); // refresh the list
        } else {
          alert('Failed to delete project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('An error occurred');
      }
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-on-surface-variant font-body-sm uppercase tracking-wider mb-1">Total Projects</p>
            <h3 className="text-on-surface font-headline-xl">{projects.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
            <span className="material-symbols-outlined">folder_open</span>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-on-surface-variant font-body-sm uppercase tracking-wider mb-1">Approved</p>
            <h3 className="text-on-surface font-headline-xl">
              {projects.filter(p => p.status === 'approved').length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center">
            <span className="material-symbols-outlined">verified</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-on-surface-variant font-body-sm uppercase tracking-wider mb-1">Pending</p>
            <h3 className="text-on-surface font-headline-xl">
              {projects.filter(p => p.status === 'pending').length}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined">hourglass_empty</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Form */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm sticky top-[100px]">
            <h3 className="font-headline-sm text-on-surface mb-6">Push New Project</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">Project Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Physics Engine"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">Description</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-24 resize-none"
                  placeholder="Briefly describe your project..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1">Project Link (GitHub/Drive)</label>
                <input 
                  type="url"
                  value={link}
                  onChange={e => setLink(e.target.value)}
                  className="w-full bg-surface border border-surface-container-high rounded-xl px-4 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="https://..."
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md flex justify-center items-center gap-2 hover:bg-primary-container transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                ) : (
                  <span className="material-symbols-outlined text-sm">cloud_upload</span>
                )}
                {isSubmitting ? 'Submitting...' : 'Submit Project'}
              </button>
            </form>
          </div>
        </div>

        {/* Project List & Heatmap */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-4">Contribution History</h3>
            <ContributionGrid />
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm">
            <h3 className="font-headline-sm text-on-surface mb-6">Recent Commits</h3>
            
            {projects.length === 0 ? (
              <EmptyState 
                icon="folder_off" 
                title="No projects yet" 
                description="Submit your first project using the form to start earning XP." 
              />
            ) : (
              <div className="flex flex-col gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="border border-surface-container-high rounded-xl p-5 hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-headline-sm text-on-surface">{project.title}</h4>
                      {project.status === 'approved' ? (
                        <span className="bg-tertiary-container/20 text-tertiary text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span> Approved
                        </span>
                      ) : project.status === 'rejected' ? (
                        <span className="bg-error-container text-on-error-container text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">cancel</span> Needs Work
                        </span>
                      ) : (
                        <span className="bg-secondary-container/20 text-secondary text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span> Pending Review
                        </span>
                      )}
                    </div>
                    <p className="text-on-surface-variant text-sm mb-4">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <a href={project.link} target="_blank" rel="noreferrer" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">link</span> View Source
                        </a>
                        <button 
                          onClick={() => handleDelete(project.id)}
                          className="text-error text-sm font-semibold hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span> Delete
                        </button>
                      </div>
                      <span className="text-xs text-outline">
                        {new Date(project.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
