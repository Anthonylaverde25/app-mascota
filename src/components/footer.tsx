'use client';

import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Twitter, Instagram, Facebook } from 'lucide-react';

const socialLinks = [
  { icon: Twitter, href: '#', name: 'Twitter' },
  { icon: Instagram, href: '#', name: 'Instagram' },
  { icon: Facebook, href: '#', name: 'Facebook' },
];

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Logo />
              <span className="font-bold text-lg font-headline">PawsHealth</span>
            </Link>
            <p className="text-sm text-muted-foreground">Cuidando a quienes más quieres.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:col-span-3 gap-8">
            <div>
              <h4 className="font-semibold mb-3">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Características</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Precios</Link></li>
                <li><Link href="/community" className="text-muted-foreground hover:text-foreground">Comunidad</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Compañía</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Sobre Nosotros</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Prensa</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Términos de Servicio</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">Política de Privacidad</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} PawsHealth. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            {socialLinks.map(social => (
              <Button key={social.name} variant="ghost" size="icon" asChild>
                <Link href={social.href}>
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

    