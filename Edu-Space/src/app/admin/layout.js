"use client";

import RoleGuard from '@/components/RoleGuard';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

export default function AdminLayout({ children }) {
  return (
    <RoleGuard allowedRole="admin">
      <div className="min-h-screen bg-background">
        <Sidebar />
        <div className="pl-[240px]">
          <Topbar />
          <main className="relative pt-[64px] min-h-screen">
            <div className="max-w-[1200px] mx-auto p-10 pb-12">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
