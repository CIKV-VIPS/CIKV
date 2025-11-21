"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HiCalendar, HiPencilAlt, HiPhotograph, HiLogout } from 'react-icons/hi';
import Cookies from 'js-cookie';

const SidebarButton = ({ icon, label, isActive, onClick }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 p-3 rounded-lg font-semibold transition-colors ${
          isActive
            ? 'bg-amber-100 text-amber-900 shadow-inner'
            : 'text-amber-100 hover:bg-amber-800 hover:bg-opacity-20'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    </li>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    Cookies.remove('accessToken');
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#FFFBEB]">
      <nav className="w-64 bg-[#6D2828] text-amber-100 flex flex-col shadow-lg h-screen sticky top-0">
        <div className="p-6 text-center">
          <h1 className="text-3xl font-bold text-white font-serif">CIKV</h1>
          <span className="text-sm text-amber-200">Admin Dashboard</span>
        </div>
        
        <ul className="flex-grow space-y-2 px-4 overflow-y-auto">
          <Link href="/dashboard/events">
            <SidebarButton
              icon={<HiCalendar size={20} />}
              label="Manage Events"
              isActive={pathname.startsWith('/dashboard/events')}
              onClick={() => {}}
            />
          </Link>
          <Link href="/dashboard/blogs">
            <SidebarButton
              icon={<HiPencilAlt size={20} />}
              label="Manage Blogs"
              isActive={pathname.startsWith('/dashboard/blogs')}
              onClick={() => {}}
            />
          </Link>
          <Link href="/dashboard/gallery">
            <SidebarButton
              icon={<HiPhotograph size={20} />}
              label="Manage Gallery"
              isActive={pathname.startsWith('/dashboard/gallery')}
              onClick={() => {}}
            />
          </Link>
          <Link href="/dashboard/forms">
            <SidebarButton
              icon={<HiPencilAlt size={20} />}
              label="Manage Forms"
              isActive={pathname.startsWith('/dashboard/forms')}
              onClick={() => {}}
            />
          </Link>
        </ul>

        <div className="p-4 border-t border-amber-800">
          <SidebarButton
            icon={<HiLogout size={20} />}
            label="Logout"
            isActive={false}
            onClick={handleLogout}
          />
        </div>
      </nav>

      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        {children}
      </main>
    </div>
  );
}