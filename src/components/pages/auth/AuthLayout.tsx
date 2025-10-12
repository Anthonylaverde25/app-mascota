import { Logo } from '@/components/logo'
import Link from 'next/link'

interface AuthLayoutProps {
    title: string
    subtitle: string
    children: React.ReactNode
    footerText: string
    footerLinkText: string
    footerLinkHref: string
}

export function AuthLayout({
    title,
    subtitle,
    children,
    footerText,
    footerLinkText,
    footerLinkHref,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <Logo className="mx-auto h-8 w-8" />
                    <h1 className="text-2xl font-semibold tracking-tight font-headline">
                        {title}
                    </h1>

                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>

                {children}

                <p className="px-8 text-center text-sm text-muted-foreground">
                    {footerText}{' '}
                    <Link
                        href={footerLinkHref}
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        {footerLinkText}
                    </Link>
                </p>
            </div>
        </div>
    )
}
