'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { ROUTES } from '@/constants/routes';
import { Logo } from './Logo';
import { useEffect, useState } from 'react';
import { SidebarButton } from '../sidebar/SidebarButton';

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <nav className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarButton />

          <Link
            href={ROUTES.DASHBOARD}
            prefetch
            className="flex items-center space-x-2"
          >
            <Logo className="size-10" />
            <div>
              <span className="inline-block text-2xl font-bold text-lime-600">
                Twin
              </span>
              <span className="inline-block text-2xl font-bold text-stone-500">
                AI
              </span>
            </div>
          </Link>
        </div>

        <ThemeToggle />
      </nav>
    </header>
  );
}
