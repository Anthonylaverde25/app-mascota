#!/bin/bash

# Script para configurar las variables de entorno

echo "🔧 Configurando variables de entorno..."

# Crear archivo .env.local si no existe
if [ ! -f .env.local ]; then
    echo "📝 Creando archivo .env.local..."
    cat > .env.local << EOF
# Variables de entorno para desarrollo local

# API Backend URLs
# URL privada para el servidor (middleware, server-side)
API_BASE_URL_PRIVATE=http://localhost:8000/api

# URL pública para el cliente (browser)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

# Environment
NODE_ENV=development
EOF
    echo "✅ Archivo .env.local creado exitosamente"
else
    echo "⚠️  El archivo .env.local ya existe"
fi

# Crear archivo .env.example
if [ ! -f .env.example ]; then
    echo "📝 Creando archivo .env.example..."
    cat > .env.example << EOF
# Variables de entorno para la aplicación

# API Backend URLs
# URL privada para el servidor (middleware, server-side)
API_BASE_URL_PRIVATE=http://localhost:8000/api

# URL pública para el cliente (browser)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api

# Firebase Configuration (opcional)
# NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
# NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Environment
NODE_ENV=development
EOF
    echo "✅ Archivo .env.example creado exitosamente"
else
    echo "⚠️  El archivo .env.example ya existe"
fi

echo "🎉 Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Verifica que tu API esté corriendo en http://localhost:8000/api"
echo "2. Si tu API corre en otro puerto, edita .env.local"
echo "3. Reinicia tu servidor de desarrollo: npm run dev"
echo ""
echo "🔍 Para verificar que todo funciona:"
echo "- Ve a http://localhost:3000/login"
echo "- Deberías poder acceder sin el error 'API url is not defined'"
