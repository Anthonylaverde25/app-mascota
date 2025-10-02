'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';

const navLinks = [
  { href: '/', label: 'Mis Mascotas' },
  { href: '/calendar', label: 'Calendario' },
  { href: '/notifications', label: 'Recordatorios' },
];

export function Header() {
  const pathname = usePathname();

  const renderNavLinks = (isMobile = false) =>
    navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={cn(
          'transition-colors hover:text-foreground/80',
          pathname === link.href ? 'text-foreground' : 'text-foreground/60',
          isMobile ? 'text-lg' : 'text-sm font-medium'
        )}
      >
        {link.label}
      </Link>
    ));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center px-4 md:px-6">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
            <span className="hidden font-bold sm:inline-block font-headline">
              PawsHealth
            </span>
          </Link>
          <nav className="flex items-center space-x-6">{renderNavLinks()}</nav>
        </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link
              href="/"
              className="mb-8 flex items-center"
            >
              <Logo />
              <span className="ml-2 font-bold font-headline">PawsHealth</span>
            </Link>
            <div className="flex flex-col space-y-6 text-center">
              {renderNavLinks(true)}
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Mobile Logo */}
        <div className="flex flex-1 items-center justify-start md:hidden">
            <Link href="/" className="flex items-center space-x-2">
                <Logo />
            </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
            <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
