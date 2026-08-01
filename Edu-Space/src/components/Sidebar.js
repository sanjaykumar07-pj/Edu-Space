"use client";

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const roleConfigs = {
    admin: {
      title: 'Edu-Space Admin',
      icon: 'admin_panel_settings',
      modeLabel: 'ADMIN MODE',
      items: [
        { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
        { name: 'Manage Teachers', path: '/admin/manage-teachers', icon: 'group' },
        { name: 'Manage Students', path: '/admin/manage-students', icon: 'school' },
        { name: 'Manage Admins', path: '/admin/manage-admins', icon: 'admin_panel_settings' },
        { name: 'Manage Classes', path: '/admin/manage-classes', icon: 'class' },
        { name: 'Attendance Overview', path: '/admin/attendance', icon: 'event_available' },
        { name: 'Academic Analytics', path: '/admin/analytics', icon: 'analytics' },
        { name: 'All Events', path: '/admin/events', icon: 'event' },
        { name: 'All Meetings', path: '/admin/meetings', icon: 'video_camera_front' },
        { name: 'Reports', path: '/admin/reports', icon: 'assessment' },
        { name: 'Settings', path: '/admin/settings', icon: 'settings' },
      ],
    },
    teacher: {
      title: 'Edu-Space Teacher',
      icon: 'co_present',
      modeLabel: 'TEACHER MODE',
      items: [
        { name: 'Dashboard', path: '/teacher', icon: 'dashboard' },
        { name: 'My Classes', path: '/teacher/classes', icon: 'class' },
        { name: 'Create Quiz', path: '/teacher/create-quiz', icon: 'quiz' },
        { name: 'Live Session', path: '/teacher/live-session', icon: 'live_tv' },
        { name: 'Attendance', path: '/teacher/attendance', icon: 'event_available' },
        { name: 'Student Analytics', path: '/teacher/analytics', icon: 'analytics' },
        { name: 'Approve Projects', path: '/teacher/approve-projects', icon: 'approval' },
        { name: 'Leaderboard', path: '/teacher/leaderboard', icon: 'leaderboard' },
        { name: 'Events', path: '/teacher/events', icon: 'event' },
      ],
    },
    student: {
      title: 'Edu-Space Student',
      icon: 'school',
      modeLabel: 'STUDENT MODE',
      items: [
        { name: 'Dashboard', path: '/student', icon: 'dashboard' },
        { name: 'My Projects', path: '/student/projects', icon: 'code' },
        { name: 'Meetings', path: '/student/meetings', icon: 'video_camera_front' },
        { name: 'Attendance', path: '/student/attendance', icon: 'event_available' },
        { name: 'Performance', path: '/student/performance', icon: 'analytics' },
        { name: 'Leaderboard', path: '/student/leaderboard', icon: 'leaderboard' },
        { name: 'Events', path: '/student/events', icon: 'event' },
      ],
    },
  };

  const config = roleConfigs[user.role];

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-surface-container-lowest text-on-surface z-50 flex flex-col shadow-2xl border-r border-surface-container">
      <div className="h-[64px] px-6 flex items-center gap-3 shrink-0 border-b border-surface-container">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuChneJwOhhP0NDgKMg1HHwb7EQWPxHka2xdxO1CnQRDBE6qak6sNwfmN8LO2kU9dMrwtNap0_5TA9n8d-2nKGH81OR5WW5A8dhiwOPXWQatqaD49tDd5bVVoF55RED_NofchdHVknJWZ2MU58D08teycbsnGkTaY6CE2Zc_eWzCzhhgDaYCHKiZC3djngZQndIKg_3B8TZdDfN32GDVgvdFqOuB7IKPeSMjXHh-7UfCleam-YikBLCSRg" alt="Edu-Space Logo" className="w-8 h-8 object-contain" />
        <span className="font-headline-sm text-on-surface tracking-tight truncate">Edu-Space</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {config.items.map((item) => {
          const isActive = pathname === item.path || (item.path !== `/${user.role}` && pathname.startsWith(item.path));
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary-fixed text-on-primary-fixed font-bold' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined mr-3 text-xl">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
        
        <button 
          onClick={logout}
          className="w-full flex items-center px-4 py-3 rounded-xl text-error hover:bg-error-container hover:text-on-error-container transition-all mt-8"
        >
          <span className="material-symbols-outlined mr-3 text-xl">logout</span>
          Logout
        </button>
      </nav>

      <div className="p-6 mt-auto border-t border-surface-container">
        <div className="bg-primary-fixed text-on-primary-fixed text-center py-2 rounded-full text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">shield</span>
          {config.modeLabel}
        </div>
      </div>
    </aside>
  );
}
