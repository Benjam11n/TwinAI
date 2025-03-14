'use client';

import { useSidebarStore } from '@/store/sidebar-store';
import { Menu } from 'lucide-react';

export function SidebarButton() {
  const toggle = useSidebarStore((state) => state.toggle);

  return (
    <button
      className="rounded-full p-2 text-foreground hover:bg-primary/10 md:hidden"
      onClick={toggle}
      aria-label="Toggle sidebar"
    >
      <Menu size={24} />
    </button>
  );
}
