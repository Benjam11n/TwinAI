'use client';

import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="flex min-h-screen">
      <Sidebar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex-1 overflow-auto">{children}</div>
    </main>
  );
}
