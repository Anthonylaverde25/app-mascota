import { PawPrint } from 'lucide-react';

export function Logo(props: React.ComponentProps<'svg'>) {
  return (
    <PawPrint
      className="h-6 w-6 text-primary"
      {...props}
    />
  );
}
