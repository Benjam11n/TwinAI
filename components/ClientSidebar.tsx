'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { IPatientDoc } from '@/database/patient.model';

interface ClientSidebarProps {
  patients: IPatientDoc[];
}

export default function ClientSidebar({ patients }: ClientSidebarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="hidden w-64 flex-col md:flex">
      <div className="flex flex-1 flex-col space-y-4 p-4">
        <div
          onClick={() => router.push(ROUTES.DASHBOARD)}
          className="cursor-pointer rounded-lg px-3 py-2 text-gray-900 hover:bg-primary/20 dark:text-gray-100 dark:hover:bg-primary/60"
        >
          Dashboard
        </div>
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 size-5 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Patients..."
            className="w-full rounded-lg border px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-gray-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Patient List */}
        <div className="max-h-[560px] space-y-2 overflow-auto">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <div
                key={patient._id as string}
                onClick={() =>
                  router.push(ROUTES.PATIENT(patient._id as string))
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
  );
}
