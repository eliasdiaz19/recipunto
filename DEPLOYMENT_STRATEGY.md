# Estrategia de Despliegue - Recipunto

## 🎯 **Resumen de la Estrategia**

Hemos configurado el proyecto para manejar tanto la landing page como la aplicación completa en un solo repositorio, con redirecciones inteligentes basadas en el estado de autenticación del usuario.

## 📁 **Estructura de Rutas**

```
/ (landing page) → Para usuarios no autenticados
├── /app → Aplicación completa (usuarios autenticados)
├── /login → Página de inicio de sesión
├── /register → Página de registro
├── /admin → Panel de administración
└── /marketing → Landing page alternativa (opcional)
```

## 🔧 **Configuración Implementada**

### 1. **Middleware de Next.js** (`middleware.ts`)
- Redirige usuarios autenticados desde `/` a `/app`
- Protege rutas de la aplicación (`/app/*`, `/admin/*`)
- Redirige usuarios no autenticados a `/login` cuando intentan acceder a rutas protegidas

### 2. **Variables de Entorno** (`env.example`)
- Configuración para diferentes ambientes
- URLs de la aplicación y subdominios
- Configuración de formularios y analytics

### 3. **Configuración de Vercel** (`vercel.json`)
- Headers de seguridad
- Redirecciones
- Configuración de funciones

## 🚀 **Flujo de Usuario**

### **Usuario Nuevo (No Autenticado)**
1. Visita `/` → Ve la landing page
2. Puede hacer clic en "Iniciar Sesión" → Va a `/login`
3. Se registra → Va a `/app`

### **Usuario Autenticado**
1. Visita `/` → Redirigido automáticamente a `/app`
2. Puede navegar libremente por la aplicación
3. Si va a `/login` o `/register` → Redirigido a `/app`

## 📊 **Transición Futura**

### **Fase 1: Landing Page (Actual)**
- ✅ Landing page en `/`
- ✅ Formulario de captura de emails
- ✅ Botón "Iniciar Sesión" en header
- ✅ Middleware configurado

### **Fase 2: App Beta**
- 🔄 Cambiar `NEXT_PUBLIC_APP_MODE=full` en variables de entorno
- 🔄 Implementar dashboard en `/app`
- 🔄 Integrar autenticación con Supabase
- 🔄 Activar redirecciones automáticas

### **Fase 3: App Completa**
- 🔄 Optimizar según métricas de conversión
- 🔄 A/B testing de landing page
- 🔄 Analytics avanzados

## 🛠️ **Comandos de Despliegue**

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Deploy a Vercel
vercel --prod
```

## 🔐 **Configuración de Dominios**

### **Desarrollo**
- `localhost:3000` → Landing page
- `localhost:3000/app` → Aplicación (requiere auth)

### **Producción**
- `recipunto.com` → Landing page
- `recipunto.com/app` → Aplicación (requiere auth)
- `app.recipunto.com` → Aplicación (opcional, subdominio)

## 📝 **Notas Importantes**

1. **Middleware**: Se ejecuta en cada request, verifica cookies de autenticación
2. **Cookies**: Usa `sb-access-token` o `supabase-auth-token` para verificar autenticación
3. **Rutas Protegidas**: `/app/*`, `/profile/*`, `/notifications/*`, `/admin/*`
4. **Rutas Públicas**: `/`, `/login`, `/register`, `/marketing`

## 🎨 **Personalización**

### **Cambiar Comportamiento del Middleware**
Edita `middleware.ts` para modificar:
- Rutas protegidas
- Lógica de redirección
- Verificación de autenticación

### **Cambiar Variables de Entorno**
Edita `.env.local` para configurar:
- URLs de la aplicación
- Modo de la aplicación (landing/full)
- Endpoints de formularios

## 🚨 **Troubleshooting**

### **Problema**: Usuario autenticado ve landing page
**Solución**: Verificar que las cookies de autenticación estén configuradas correctamente

### **Problema**: Usuario no autenticado puede acceder a `/app`
**Solución**: Verificar que el middleware esté funcionando y las rutas estén en `protectedRoutes`

### **Problema**: Redirecciones infinitas
**Solución**: Verificar la lógica del middleware y las rutas configuradas

## 📞 **Soporte**

Para cualquier duda sobre la implementación:
1. Revisar los comentarios en `middleware.ts`
2. Verificar la configuración de variables de entorno
3. Comprobar los logs de Vercel en caso de problemas de despliegue
