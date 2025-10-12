# Estado Global de Autenticación con Zustand

Este documento explica cómo usar el estado global de autenticación implementado con Zustand en la aplicación.

## Características Principales

-   ✅ **Persistencia**: Los datos se guardan en localStorage automáticamente
-   ✅ **Sincronización con Firebase**: Se mantiene sincronizado con Firebase Auth
-   ✅ **Tipado completo**: TypeScript con todas las interfaces definidas
-   ✅ **Estados de carga**: Manejo de loading, error y estados de autenticación
-   ✅ **Hooks especializados**: Hooks para diferentes casos de uso
-   ✅ **Integración con API**: Sincronización automática con tu API backend

## Hooks Disponibles

### 1. `useAuth()` - Estado del usuario

```tsx
import { useAuth } from '@/zustand/authStore'

function MyComponent() {
    const {
        user, // Datos del usuario desde la API
        firebaseUser, // Usuario de Firebase
        token, // Token de autenticación
        isAuthenticated, // Boolean si está autenticado
        loading, // Estado de carga
        error, // Mensaje de error
        status, // Estado actual: 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error'
        profileComplete, // Si el perfil está completo
    } = useAuth()

    if (loading) return <div>Cargando...</div>
    if (error) return <div>Error: {error}</div>
    if (!isAuthenticated) return <div>No autenticado</div>

    return <div>Hola {user?.name}!</div>
}
```

### 2. `useAuthActions()` - Acciones de autenticación

```tsx
import { useAuthActions } from '@/zustand/authStore'

function LoginButton() {
    const {
        login, // Función para hacer login
        logout, // Función para hacer logout
        updateProfile, // Actualizar perfil del usuario
        clearError, // Limpiar errores
        refreshToken, // Refrescar token
        setLoading, // Establecer estado de carga
        setError, // Establecer error
    } = useAuthActions()

    const handleLogout = () => {
        logout()
    }

    const handleUpdateProfile = () => {
        updateProfile({ name: 'Nuevo nombre' })
    }

    return (
        <div>
            <button onClick={handleLogout}>Cerrar Sesión</button>
            <button onClick={handleUpdateProfile}>Actualizar Perfil</button>
        </div>
    )
}
```

### 3. `useIsOwner()` - Verificar si es propietario

```tsx
import { useIsOwner } from '@/zustand/authStore'

function OwnerOnlyComponent() {
    const isOwner = useIsOwner()

    if (!isOwner) {
        return <div>No tienes permisos para ver esto</div>
    }

    return <div>Contenido solo para propietarios</div>
}
```

### 4. `useIsServiceProvider()` - Verificar si es proveedor de servicios

```tsx
import { useIsServiceProvider } from '@/zustand/authStore'

function ServiceProviderComponent() {
    const isServiceProvider = useIsServiceProvider()

    if (!isServiceProvider) {
        return <div>No tienes permisos para ver esto</div>
    }

    return <div>Panel de proveedor de servicios</div>
}
```

### 5. `useEntityType()` - Obtener tipo de entidad

```tsx
import { useEntityType } from '@/zustand/authStore'

function ConditionalComponent() {
    const entityType = useEntityType()

    switch (entityType) {
        case 'owner':
            return <div>Panel de propietario</div>
        case 'service':
            return <div>Panel de servicios</div>
        default:
            return <div>Panel general</div>
    }
}
```

### 6. `useAuthSync()` - Sincronización con Firebase

```tsx
import { useAuthSync } from '@/hooks/useAuthSync'

function App() {
    const { handleLogout } = useAuthSync()

    // La sincronización se hace automáticamente
    // Solo necesitas usar handleLogout si quieres cerrar sesión

    return <div>Mi App</div>
}
```

## Integración con Componentes

### En el Layout Principal

```tsx
// app/layout.tsx
import { AuthProvider } from '@/context/Auth/AuthContext'

export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    )
}
```

### En Componentes de Páginas

```tsx
// app/dashboard/page.tsx
'use client'

import { useAuth, useAuthActions } from '@/zustand/authStore'

export default function Dashboard() {
    const { user, isAuthenticated, loading } = useAuth()
    const { logout } = useAuthActions()

    if (loading) return <div>Cargando...</div>
    if (!isAuthenticated) return <div>No autorizado</div>

    return (
        <div>
            <h1>Dashboard de {user?.name}</h1>
            <button onClick={logout}>Cerrar Sesión</button>
        </div>
    )
}
```

## Estructura de Datos

### AuthUser (Usuario desde la API)

```typescript
interface AuthUser {
    id: number
    email: string
    name: string
    entityType: EntityTypeDTO[] // Array de tipos de entidad
    profile: ProfileDTO | null // Perfil del usuario
    profile_complete: boolean // Si el perfil está completo
}
```

### Estados de Autenticación

```typescript
type AuthStatus =
    | 'idle'
    | 'loading'
    | 'authenticated'
    | 'unauthenticated'
    | 'error'
```

## Persistencia

Los siguientes datos se guardan automáticamente en localStorage:

-   `user`: Datos del usuario
-   `token`: Token de autenticación
-   `isAuthenticated`: Estado de autenticación
-   `profileComplete`: Si el perfil está completo

Los estados temporales como `loading`, `error`, etc. no se persisten.

## Migración desde el Contexto Anterior

Si tenías código usando el contexto anterior:

```tsx
// Antes
import { useAuthContext } from '@/context/Auth/AuthContext'
const { user, token, loading } = useAuthContext()

// Ahora
import { useAuth } from '@/zustand/authStore'
const { user, token, loading } = useAuth()
```

## Mejores Prácticas

1. **Usa los hooks específicos**: En lugar de `useAuthStore` directamente, usa `useAuth()` o `useAuthActions()`
2. **Maneja los estados de carga**: Siempre verifica `loading` antes de mostrar contenido
3. **Maneja errores**: Usa `error` para mostrar mensajes de error al usuario
4. **Verifica autenticación**: Usa `isAuthenticated` para proteger rutas
5. **Usa los hooks de tipo de usuario**: `useIsOwner()`, `useIsServiceProvider()` para lógica condicional

## Troubleshooting

### El estado no se actualiza

-   Verifica que estés usando los hooks correctos
-   Asegúrate de que el `AuthProvider` esté envolviendo tu aplicación

### Los datos no se persisten

-   Verifica que localStorage esté disponible
-   Revisa la consola por errores de serialización

### Firebase no se sincroniza

-   Verifica que `useAuthSync()` esté siendo llamado en el `AuthProvider`
-   Asegúrate de que Firebase esté configurado correctamente
