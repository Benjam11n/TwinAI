'use client';

import { useSidebarStore } from '@/store/sidebar-store';
import { Menu, X } from 'lucide-react';

export function SidebarButton() {
  const { isOpen, toggle } = useSidebarStore();

  return (
    <button
      className="rounded-full p-2 text-foreground hover:bg-primary/10 md:hidden"
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
}
