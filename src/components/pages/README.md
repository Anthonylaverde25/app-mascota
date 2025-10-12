# Componentes de Páginas

Esta carpeta contiene todos los componentes específicos de páginas, organizados por funcionalidad. Esta estructura sigue las mejores prácticas de Next.js donde los componentes de páginas se mantienen fuera de la carpeta `app/`.

## Estructura de Carpetas

```
src/components/pages/
├── auth/                    # Componentes de autenticación
│   ├── AuthLayout.tsx      # Layout común para login/signup
│   ├── LoginForm.tsx       # Formulario de login
│   ├── SignupForm.tsx      # Formulario de registro
│   ├── GoogleIcon.tsx      # Icono de Google
│   ├── EntityTypeSelector.tsx # Selector de tipo de entidad
│   └── index.ts            # Exportaciones
├── home/                   # Componentes de la página principal
│   ├── HeroSection.tsx     # Sección hero con búsqueda
│   ├── FeaturesSection.tsx # Sección de características
│   ├── TestimonialsSection.tsx # Sección de testimonios
│   ├── LoadingSkeleton.tsx # Skeleton de carga
│   └── index.ts            # Exportaciones
├── pets/                   # Componentes de mascotas
│   ├── PetCard.tsx         # Tarjeta individual de mascota
│   ├── PetsGrid.tsx        # Grid de mascotas
│   ├── PetsHeader.tsx      # Header de la página de mascotas
│   ├── PetsLoadingSkeleton.tsx # Skeleton de carga
│   └── index.ts            # Exportaciones
└── community/              # Componentes de comunidad (futuro)
```

## Principios de Organización

### 1. **Separación por Funcionalidad**

Cada carpeta agrupa componentes relacionados con una funcionalidad específica:

-   `auth/` - Todo lo relacionado con autenticación
-   `home/` - Componentes de la página principal
-   `pets/` - Componentes relacionados con mascotas
-   `community/` - Componentes de la comunidad

### 2. **Componentes Reutilizables**

Los componentes están diseñados para ser reutilizables y modulares:

-   `AuthLayout` - Layout común para login y signup
-   `PetCard` - Tarjeta reutilizable para mostrar mascotas
-   `LoadingSkeleton` - Skeletons de carga reutilizables

### 3. **Archivos de Índice**

Cada carpeta tiene un `index.ts` que exporta todos los componentes, facilitando las importaciones:

```typescript
// En lugar de:
import { LoginForm } from '@/components/pages/auth/LoginForm'
import { AuthLayout } from '@/components/pages/auth/AuthLayout'

// Puedes hacer:
import { LoginForm, AuthLayout } from '@/components/pages/auth'
```

## Uso en las Páginas

### Página de Login

```typescript
// app/login/page.tsx
import { AuthLayout, LoginForm } from '@/components/pages/auth'

export default function LoginPage() {
    return (
        <AuthLayout
            title="¡Bienvenido de Nuevo!"
            subtitle="Inicia sesión para gestionar la salud de tus mascotas."
            footerText="¿No tienes una cuenta?"
            footerLinkText="Regístrate"
            footerLinkHref="/signup"
        >
            <LoginForm />
        </AuthLayout>
    )
}
```

### Página Principal

```typescript
// app/page.tsx
import {
    HeroSection,
    FeaturesSection,
    TestimonialsSection,
    LoadingSkeleton,
} from '@/components/pages/home'

export default function Home() {
    if (isUserLoading) {
        return <LoadingSkeleton />
    }

    return (
        <>
            <HeroSection />
            <FeaturesSection />
            <TestimonialsSection />
        </>
    )
}
```

### Página de Mascotas

```typescript
// app/pets/page.tsx
import {
    PetsHeader,
    PetsGrid,
    PetsLoadingSkeleton,
} from '@/components/pages/pets'

export default function MyPetsPage() {
    if (isUserLoading || !user) {
        return <PetsLoadingSkeleton />
    }

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <PetsHeader onAddPet={handleAddPet} />
            <PetsGrid pets={pets} />
        </div>
    )
}
```

## Beneficios de esta Estructura

### 1. **Mantenibilidad**

-   Código más fácil de mantener y actualizar
-   Componentes pequeños y enfocados en una responsabilidad
-   Fácil localización de funcionalidades específicas

### 2. **Reutilización**

-   Componentes reutilizables en diferentes páginas
-   Lógica compartida encapsulada en componentes
-   Reducción de duplicación de código

### 3. **Escalabilidad**

-   Fácil agregar nuevos componentes
-   Estructura clara para nuevos desarrolladores
-   Separación clara de responsabilidades

### 4. **Testing**

-   Componentes más fáciles de testear individualmente
-   Lógica aislada y enfocada
-   Mejor cobertura de tests

## Convenciones de Nomenclatura

### Archivos de Componentes

-   **PascalCase**: `LoginForm.tsx`, `PetCard.tsx`
-   **Descriptivo**: El nombre debe describir claramente la funcionalidad
-   **Específico**: Evitar nombres genéricos como `Component.tsx`

### Props de Componentes

-   **Interfaces claras**: Definir interfaces para las props
-   **Props opcionales**: Usar `?` para props opcionales
-   **Callbacks**: Usar nombres descriptivos como `onAddPet`, `onSuccess`

### Hooks Personalizados

-   **Prefijo `use`**: `useAuth`, `usePets`
-   **Descriptivo**: El nombre debe indicar qué hace el hook
-   **Retorno consistente**: Estructura de retorno predecible

## Migración desde Código Monolítico

### Antes (Código Monolítico)

```typescript
// app/login/page.tsx - 267 líneas
export default function LoginPage() {
    // Todo el código mezclado:
    // - Lógica de formulario
    // - Manejo de estado
    // - UI completa
    // - Validaciones
    // - etc.
}
```

### Después (Componentizado)

```typescript
// app/login/page.tsx - 37 líneas
export default function LoginPage() {
    // Solo lógica de página
    // Componentes reutilizables
    // Código limpio y enfocado
}
```

## Próximos Pasos

1. **Agregar más componentes**: Continuar componentizando otras páginas
2. **Testing**: Agregar tests unitarios para cada componente
3. **Storybook**: Crear stories para documentar componentes
4. **Optimización**: Implementar lazy loading para componentes pesados
5. **Accesibilidad**: Mejorar la accesibilidad de los componentes

## Mejores Prácticas

1. **Un componente, una responsabilidad**: Cada componente debe tener una función específica
2. **Props tipadas**: Siempre usar TypeScript para las props
3. **Composición sobre herencia**: Preferir composición de componentes
4. **Nombres descriptivos**: Usar nombres que expliquen claramente la funcionalidad
5. **Documentación**: Comentar componentes complejos
6. **Consistencia**: Mantener patrones consistentes en toda la aplicación
