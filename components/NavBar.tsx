'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { ROUTES } from '@/constants/routes';
import { Logo } from './Logo';
import { useEffect, useState } from 'react';

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
      className={`absolute top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-background/80' : 'bg-transparent'
      }`}
    >
      <nav className="container flex h-16 items-center px-4">
        <div className="flex gap-6 lg:gap-10">
          <Link
            href={ROUTES.HOME}
            prefetch
            className="flex items-center space-x-2"
          >
            <Logo className="size-10" />
            <span className="inline-block text-2xl font-bold">Macadamia</span>
          </Link>
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
}
