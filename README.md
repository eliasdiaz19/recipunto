# 🚀 Recipunto - Reciclaje Inteligente

Aplicación web para gestionar cajas de reciclaje de manera inteligente y eficiente, construida con Next.js, TypeScript y Tailwind CSS.

## ✨ Características

- 🗺️ **Mapa Interactivo**: Visualización de cajas de reciclaje con Leaflet
- 📱 **Diseño Responsive**: Optimizado para móviles y escritorio
- 🔐 **Autenticación**: Sistema de usuarios con Supabase
- 🚀 **PWA**: Instalable como aplicación nativa
- ⚡ **Offline First**: Funcionalidad sin conexión
- 🧪 **Testing Completo**: Jest, React Testing Library y Playwright
- 📚 **Storybook**: Documentación de componentes
- 🔄 **CI/CD**: Deployment automatizado con GitHub Actions

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Mapas**: Leaflet, React-Leaflet
- **Backend**: Supabase (Auth + Database)
- **Testing**: Jest, React Testing Library, Playwright
- **Documentación**: Storybook
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel, GitHub Pages

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/recipunto.git
   cd recipunto
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Editar `.env.local` con tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
   SUPABASE_SERVICE_ROLE_KEY=tu_clave_servicio
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🧪 Testing

### Testing Unitario

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests en CI
npm run test:ci
```

### Testing E2E con Playwright

```bash
# Instalar Playwright
npx playwright install

# Ejecutar tests E2E
npm run e2e

# Ejecutar tests E2E con UI
npm run e2e:ui

# Ejecutar tests E2E en modo debug
npm run e2e:debug
```

### Testing de Componentes

```bash
# Ejecutar Storybook
npm run storybook

# Build de Storybook
npm run storybook:build

# Deploy de Storybook a GitHub Pages
npm run storybook:deploy
```

## 📚 Storybook

Storybook proporciona documentación interactiva de todos los componentes:

```bash
# Iniciar Storybook
npm run storybook
```

Accede a `http://localhost:6006` para ver la documentación de componentes.

## 🔄 CI/CD Pipeline

### Workflows de GitHub Actions

- **CI Pipeline** (`ci.yml`): Testing, linting y building automático
- **Deployment** (`deploy.yml`): Deployment automático a diferentes entornos

### Entornos de Deployment

- **Staging**: Branch `develop` → Vercel Staging
- **Production**: Branch `main` → Vercel Production + GitHub Pages
- **Preview**: Manual trigger → Vercel Preview

### Secrets Requeridos

Configura estos secrets en tu repositorio de GitHub:

```env
VERCEL_TOKEN=tu_token_vercel
ORG_ID=tu_org_id_vercel
PROJECT_ID=tu_project_id_vercel
SLACK_WEBHOOK_URL=tu_webhook_slack
SNYK_TOKEN=tu_token_snyk
PRODUCTION_URL=tu_url_produccion
STAGING_URL=tu_url_staging
```

## 🚀 Deployment

### Deployment Automático

1. **Push a `develop`** → Deploy automático a Staging
2. **Push a `main`** → Deploy automático a Production
3. **Pull Request** → Deploy de preview automático

### Deployment Manual

```bash
# Deploy a staging
gh workflow run deploy.yml -f environment=staging

# Deploy a production
gh workflow run deploy.yml -f environment=production

# Deploy de preview
gh workflow run deploy.yml -f environment=preview
```

### Rollback

```bash
# Rollback manual
gh workflow run deploy.yml -f environment=rollback
```

## 📁 Estructura del Proyecto

```
recipunto/
├── src/
│   ├── app/                 # App Router de Next.js
│   ├── components/          # Componentes React
│   │   ├── UI/             # Componentes base reutilizables
│   │   ├── Map/            # Componentes del mapa
│   │   ├── Auth/           # Componentes de autenticación
│   │   ├── Box/            # Componentes de cajas
│   │   ├── BoxStatus/      # Componentes de estado
│   │   ├── ErrorBoundary/  # Manejo de errores
│   │   └── Suspense/       # Estados de carga
│   ├── hooks/              # Hooks personalizados
│   ├── lib/                # Utilidades y configuración
│   └── types/              # Tipos TypeScript
├── public/                  # Archivos estáticos
├── tests/                   # Tests E2E
├── .github/                 # GitHub Actions
├── .storybook/             # Configuración de Storybook
├── jest.config.js          # Configuración de Jest
├── playwright.config.ts    # Configuración de Playwright
└── package.json
```

## 🧩 Componentes Principales

### UI Components
- **Button**: Botón reutilizable con múltiples variantes
- **Input**: Campo de entrada con validación
- **Card**: Contenedor de contenido
- **Badge**: Etiquetas de estado
- **FormField**: Campo de formulario integrado

### Hooks Personalizados
- **useForm**: Manejo completo de formularios
- **useLoading**: Estados de carga
- **useValidation**: Validaciones personalizadas
- **useAsync**: Operaciones asíncronas
- **useMapOptimization**: Optimización de mapas
- **useServiceWorker**: Service Worker
- **useWebWorker**: Web Workers

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run start            # Servidor de producción

# Testing
npm test                 # Tests unitarios
npm run test:watch       # Tests en modo watch
npm run test:coverage    # Tests con coverage
npm run e2e              # Tests E2E

# Storybook
npm run storybook        # Iniciar Storybook
npm run storybook:build  # Build de Storybook

# Utilidades
npm run lint             # Linting
npm run type-check       # Verificación de tipos
```

## 📊 Métricas de Calidad

- **Coverage de Tests**: 70% mínimo
- **Linting**: ESLint configurado
- **Type Checking**: TypeScript estricto
- **Security**: Auditorías automáticas con Snyk
- **Performance**: Lighthouse CI integrado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Sigue las convenciones de código establecidas
- Asegúrate de que todos los tests pasen
- Actualiza la documentación según sea necesario
- Usa commits semánticos

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/recipunto/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tu-usuario/recipunto/discussions)
- **Documentación**: [Wiki del Proyecto](https://github.com/tu-usuario/recipunto/wiki)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el framework
- [Supabase](https://supabase.com/) por el backend
- [Tailwind CSS](https://tailwindcss.com/) por el styling
- [Leaflet](https://leafletjs.com/) por los mapas
- [Storybook](https://storybook.js.org/) por la documentación

---

**Recipunto** - Haciendo el reciclaje más inteligente y eficiente 🌱♻️
