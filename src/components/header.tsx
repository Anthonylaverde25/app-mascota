'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, LogOut, User as UserIcon, Users } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { getAuth } from 'firebase/auth';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from './ui/skeleton';

const navLinks = [
  { href: '/', label: 'Mis Mascotas' },
  { href: '/community', label: 'Comunidad' },
  { href: '/notifications', label: 'Recordatorios' },
];

export function Header() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
    }
  };

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

  const renderAuthSection = () => {
    if (isUserLoading) {
      return <Skeleton className="h-10 w-10 rounded-full" />;
    }

    if (user) {
      return (
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'Usuario'} />
                  <AvatarFallback>
                    <UserIcon />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.displayName || 'Usuario'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    return (
      <div className="hidden sm:flex items-center gap-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Iniciar Sesión</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Registrarse</Link>
        </Button>
        <ThemeToggle />
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center px-4 sm:px-6">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
            <span className="hidden font-bold sm:inline-block font-headline">
              PawsHealth
            </span>
          </Link>
          {user && <nav className="flex items-center space-x-6">{renderNavLinks()}</nav>}
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center md:hidden">
            {user && (
                <Sheet>
                <SheetTrigger asChild>
                    <Button
                    variant="ghost"
                    className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
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
            )}
        </div>
        
        {/* Mobile Logo & Title */}
        <div className="flex flex-1 items-center justify-center md:hidden">
            <Link href="/" className="flex items-center space-x-2">
                <Logo />
                <span className="font-bold font-headline text-lg sm:text-xl">PawsHealth</span>
            </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-2">
            {renderAuthSection()}
             {/* Auth buttons for small screens */}
             {!user && !isUserLoading && (
                <div className="flex sm:hidden">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/login">Entrar</Link>
                    </Button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
}
