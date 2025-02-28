import React, { useState } from 'react';
import { Calendar as CalendarIcon, Search } from 'lucide-react';
import { CalendarView } from '@/components/dashboard/calendar-view';
import { Separator } from '@/components/ui/separator';

const patients = [
  'John Doe',
  'Jane Smith',
  'Michael Johnson',
  'Emily Davis',
  'Daniel Martinez',
  'Sophia Brown',
];

export default function Sidebar({ searchQuery, setSearchQuery }) {
  const filteredPatients = patients.filter((patient) =>
    patient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="hidden w-64 flex-col border-r bg-white dark:bg-gray-800 md:flex">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold">Mental Health Twin</h2>
      </div>
      <div className="flex flex-1 flex-col space-y-4 p-4">

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 size-5" />
          <input
            type="text"
            placeholder="Search Patients..."
            className="w-full rounded-lg border px-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-gray-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Patient List */}
        <div className="space-y-2 max-h-60 overflow-auto">
          {filteredPatients.map((patient, index) => (
            <div
              key={index}
              className="cursor-pointer rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              {patient}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
