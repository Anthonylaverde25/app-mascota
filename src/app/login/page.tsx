'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';

const formSchema = z.object({
  email: z.string().email('Por favor, introduce un correo electrónico válido.'),
  password: z.string().min(1, 'La contraseña es requerida.'),
});

function GoogleIcon(props: React.ComponentProps<'svg'>) {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.67-4.66 1.67-3.86 0-6.99-3.16-6.99-7.02s3.13-7.02 6.99-7.02c2.2 0 3.28.85 4.05 1.58l2.54-2.54C18.27 1.84 15.84 1 12.48 1 7.22 1 3.22 4.9 3.22 10.01s4 9.01 9.26 9.01c2.76 0 4.95-1.03 6.59-2.62 1.7-1.63 2.25-3.88 2.25-6.25 0-.6-.05-1.12-.15-1.63H12.48z"
          fill="currentColor"
        />
      </svg>
    );
}

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setGoogleIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (!auth) throw new Error('Servicio de autenticación no disponible');
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: '¡Bienvenido de nuevo!',
        description: 'Has iniciado sesión correctamente.',
      });
      router.push('/');
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast({
        variant: 'destructive',
        title: 'Error al iniciar sesión',
        description: 'Credenciales incorrectas o ha ocurrido un error. Por favor, inténtalo de nuevo.',
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleIsSubmitting(true);
    try {
        if (!auth) throw new Error('Servicio de autenticación no disponible');
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        toast({
            title: '¡Bienvenido!',
            description: 'Has iniciado sesión con Google correctamente.',
        });
        router.push('/');
    } catch (error: any) {
        console.error("Error with Google sign in:", error);
        toast({
            variant: 'destructive',
            title: 'Error de Google',
            description: 'No se pudo iniciar sesión con Google. Inténtalo de nuevo.',
        });
    } finally {
        setGoogleIsSubmitting(false);
    }
  }

  if (isUserLoading || user) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
       <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
            <Logo className="mx-auto h-8 w-8" />
            <h1 className="text-2xl font-semibold tracking-tight font-headline">
                ¡Bienvenido de Nuevo!
            </h1>
            <p className="text-sm text-muted-foreground">
                Inicia sesión para gestionar la salud de tus mascotas.
            </p>
        </div>
        <div className="grid gap-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="sr-only">Correo Electrónico</FormLabel>
                        <FormControl>
                            <Input placeholder="nombre@ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="sr-only">Contraseña</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="Contraseña" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting || isGoogleSubmitting}>
                        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </Button>
                </form>
            </Form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        O continuar con
                    </span>
                </div>
            </div>
            <Button variant="outline" type="button" onClick={handleGoogleSignIn} disabled={isSubmitting || isGoogleSubmitting}>
                {isGoogleSubmitting ? 'Cargando...' : <><GoogleIcon className="mr-2 h-4 w-4" /> Google</>}
            </Button>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                Regístrate
            </Link>
        </p>
       </div>
    </div>
  );
}
