'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MapPin, Stethoscope, Footprints, Store, Search, ChevronDown } from 'lucide-react';
import { useUser } from '@/firebase';
import { getCommunityMembers, type CommunityMember } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

const categoryMap = {
  Veterinario: { icon: Stethoscope, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
  Paseador: { icon: Footprints, color: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
  Tienda: { icon: Store, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' },
};

export default function CommunityPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const allMembers = getCommunityMembers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Veterinario', 'Paseador', 'Tienda']);
  const [filteredMembers, setFilteredMembers] = useState<CommunityMember[]>(allMembers);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    const results = allMembers.filter(member =>
      (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       member.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategories.length === 0 || selectedCategories.includes(member.category))
    );
    setFilteredMembers(results);
  }, [searchTerm, selectedCategories, allMembers]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <Skeleton className="h-10 w-1/2" />
          <div className="flex gap-2 w-full md:w-auto">
            <Skeleton className="h-10 flex-grow" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-headline font-bold mb-2">Comunidad PawsHealth</h1>
        <p className="text-lg text-muted-foreground">
          Encuentra los mejores profesionales y servicios para tu mascota.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full md:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nombre o servicio..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              Categorías
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {Object.keys(categoryMap).map(category => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => handleCategoryChange(category)}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const categoryInfo = categoryMap[member.category as keyof typeof categoryMap];
          const Icon = categoryInfo?.icon || Stethoscope;
          
          return (
            <Card key={member.id} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image
                  src={member.image.imageUrl}
                  alt={member.image.description}
                  data-ai-hint={member.image.imageHint}
                  fill
                  className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
                <div className={`absolute top-3 right-3 p-2 rounded-full ${categoryInfo.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2">{member.category}</Badge>
                <h3 className="text-xl font-headline font-bold">{member.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{member.description}</p>
                <div className="flex items-center text-sm text-muted-foreground mt-3">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{member.location}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {filteredMembers.length === 0 && (
         <div className="text-center py-20 border-2 border-dashed rounded-lg col-span-full">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No se encontraron resultados para tu búsqueda.</p>
         </div>
      )}
    </div>
  );
}
