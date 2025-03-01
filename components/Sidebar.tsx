import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { patients } from '@/data/data';
import { ROUTES } from '@/constants/routes';

interface SidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Sidebar({ searchQuery, setSearchQuery }: SidebarProps) {
  const router = useRouter();

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
        <div className="max-h-96 space-y-2 overflow-auto">
          {filteredPatients.map((patient, index) => (
            <div
              key={index}
              onClick={() =>
                router.push(`/${encodeURIComponent(patient.name)}`)
              }
              className="cursor-pointer rounded-lg px-3 py-2 text-gray-900 hover:bg-primary/20 dark:text-gray-100 dark:hover:bg-primary/60"
            >
              {patient.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
