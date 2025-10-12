# Solución: Error "API url is not defined" en Login/Register

## Problema

Al intentar acceder a las páginas de login o register, se mostraba el error:

```
API url is not defined
```

Este error ocurría porque el middleware estaba intentando verificar la disponibilidad de la API, pero no encontraba las variables de entorno necesarias.

## Causa Raíz

El middleware en `src/middleware.ts` y `src/app/middleware/apiCheck.ts` estaba buscando la variable de entorno `API_BASE_URL_PRIVATE`, pero esta no estaba definida en el proyecto.

## Solución Implementada

### 1. **Mejoras en el Middleware**

#### `src/app/middleware/apiCheck.ts`

-   ✅ **Fallback de URLs**: Ahora busca la URL en múltiples variables de entorno
-   ✅ **URL por defecto**: Usa `http://localhost:3001` como fallback para desarrollo
-   ✅ **Modo desarrollo**: Permite continuar aunque la API no esté disponible
-   ✅ **Timeout**: Agregado timeout de 5 segundos para evitar bloqueos
-   ✅ **Mejor logging**: Logs más informativos para debugging

```typescript
const API_BASE_URL =
    process.env.API_BASE_URL_PRIVATE ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://localhost:3001' // URL por defecto para desarrollo
```

#### `src/middleware.ts`

-   ✅ **Check condicional**: Solo verifica la API si está configurada o no estamos en desarrollo
-   ✅ **Modo desarrollo**: Permite saltarse el check en desarrollo

### 2. **Variables de Entorno**

#### Archivo `.env.local` creado:

```bash
# API Backend URLs
API_BASE_URL_PRIVATE=http://localhost:3001
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NODE_ENV=development
```

#### Archivo `.env.example` creado:

-   Template para otros desarrolladores
-   Documentación de todas las variables necesarias

### 3. **Script de Configuración**

#### `setup-env.sh`

-   ✅ **Configuración automática**: Crea los archivos de entorno necesarios
-   ✅ **Verificación**: Comprueba si los archivos ya existen
-   ✅ **Instrucciones**: Proporciona pasos claros para el usuario

## Cómo Usar

### Opción 1: Usar el Script (Recomendado)

```bash
./setup-env.sh
```

### Opción 2: Configuración Manual

1. Crear archivo `.env.local` en la raíz del proyecto
2. Agregar las variables de entorno necesarias
3. Reiniciar el servidor de desarrollo

### Opción 3: Solo para Desarrollo

Si no necesitas verificar la API en desarrollo, el middleware ahora permite continuar automáticamente.

## Configuración de la API

### Puerto por Defecto

-   **Desarrollo**: `http://localhost:8000` (Laravel API con prefijo `/api`)
-   **Producción**: Configurar según tu entorno

### Cambiar el Puerto

Si tu API corre en otro puerto, edita `.env.local`:

```bash
API_BASE_URL_PRIVATE=http://localhost:PUERTO_AQUI
NEXT_PUBLIC_API_BASE_URL=http://localhost:PUERTO_AQUI
```

**Nota**: Laravel automáticamente agrega el prefijo `/api` a las rutas definidas en `routes/api.php`

## Verificación

### 1. Verificar Variables de Entorno

```bash
# Verificar que el archivo existe
ls -la .env.local

# Ver el contenido
cat .env.local
```

### 2. Verificar la API

```bash
# Verificar que tu API responde
curl http://localhost:8000/api/health
```

### 3. Probar la Aplicación

1. Reiniciar el servidor: `npm run dev`
2. Ir a `http://localhost:3000/login`
3. Deberías poder acceder sin errores

## Logs de Debugging

El middleware ahora incluye logs informativos:

```bash
# En la consola del servidor verás:
Checking API at: http://localhost:8000
API health check passed

# O en modo desarrollo:
Development mode: allowing request to continue despite API unavailability
```

## Entornos

### Desarrollo

-   ✅ **Permisivo**: Permite continuar aunque la API no esté disponible
-   ✅ **Logs informativos**: Muestra warnings pero no bloquea
-   ✅ **URL por defecto**: Usa localhost:3001 si no está configurado

### Producción

-   ✅ **Estricto**: Verifica que la API esté disponible
-   ✅ **Error handling**: Retorna 503 si la API no responde
-   ✅ **Configuración requerida**: Requiere variables de entorno

## Troubleshooting

### Error: "API url is not defined"

1. ✅ **Verificar archivo .env.local**: Debe existir y tener las variables
2. ✅ **Reiniciar servidor**: `npm run dev`
3. ✅ **Verificar puerto**: Asegúrate de que tu API esté corriendo en el puerto correcto

### Error: "Service Unavailable"

1. ✅ **Verificar API**: Asegúrate de que tu API esté corriendo
2. ✅ **Verificar endpoint**: La API debe tener un endpoint `/health`
3. ✅ **Verificar puerto**: Confirma que el puerto en `.env.local` sea correcto

### La API no responde

1. ✅ **Verificar que esté corriendo**: `curl http://localhost:3001/health`
2. ✅ **Verificar logs**: Revisa los logs de tu API
3. ✅ **Modo desarrollo**: En desarrollo, la app continuará funcionando

## Beneficios de la Solución

1. **Robustez**: Maneja múltiples escenarios de configuración
2. **Flexibilidad**: Funciona con o sin API en desarrollo
3. **Debugging**: Logs claros para identificar problemas
4. **Configuración fácil**: Script automático de configuración
5. **Producción segura**: Verificación estricta en producción
6. **Fallbacks**: URLs por defecto para desarrollo

## Próximos Pasos

1. **Configurar API**: Asegúrate de que tu API esté corriendo
2. **Probar login/register**: Verifica que las páginas funcionen
3. **Configurar producción**: Ajustar variables para producción
4. **Monitorear logs**: Revisar logs para identificar problemas
