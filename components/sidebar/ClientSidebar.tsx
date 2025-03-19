'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Search } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { IPatientDoc } from '@/database/patient.model';
import { useSidebarStore } from '@/store/sidebar-store';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ClientSidebarProps {
  patients: IPatientDoc[];
}

export default function ClientSidebar({
  patients,
}: Readonly<ClientSidebarProps>) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { isOpen, close } = useSidebarStore();

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, close]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    const handleRouteChange = () => {
      if (isOpen) {
        close();
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [isOpen, close]);

  return (
    <>
      {/* Overlay when mobile menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={close}
          aria-label="Close mobile menu"
        />
      )}

      {/* Sidebar */}
      <div
        id="mobile-sidebar"
        ref={sidebarRef}
        className={`
          fixed top-0 z-30 h-full w-64 bg-background pt-16 shadow-lg transition-transform duration-300 ease-in-out md:static
          md:translate-x-0 md:pt-0 md:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex h-full flex-col space-y-4 p-4">
          <Button
            variant="ghost"
            onClick={() => router.push(ROUTES.DASHBOARD)}
            className="flex cursor-pointer flex-row items-center gap-x-2 rounded-lg px-3 py-2 text-gray-900 hover:bg-primary/20 dark:text-gray-100 dark:hover:bg-primary/60"
          >
            <Home size={18} />
            Dashboard
          </Button>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 size-5 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Search Patients..."
              className="w-full rounded-lg border px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-700 dark:text-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Patient List */}
          <div className="max-h-[calc(100vh-180px)] space-y-2 overflow-auto">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div
                  key={patient._id as string}
                  onClick={() =>
                    router.push(ROUTES.PATIENT_DASHBOARD(patient._id as string))
                  }
                  className="cursor-pointer rounded-lg px-3 py-2 text-gray-900 hover:bg-primary/20 dark:text-gray-100 dark:hover:bg-primary/60"
                >
                  {patient.name}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500">No patients found</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
