# Recipunto - Aplicación de Reciclaje Inteligente

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/elias-projects-1af29b7c/v0-recipunto-recycling-app)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## 🌟 Descripción

Recipunto es una aplicación web moderna para la gestión inteligente de cajas de reciclaje. La aplicación permite a los usuarios crear, gestionar y monitorear cajas de reciclaje en tiempo real, con un sistema avanzado de Local Storage que mejora significativamente la experiencia del usuario.

## ✨ Características Principales

### 🗺️ Gestión de Cajas de Reciclaje
- **Mapa Interactivo**: Visualización en tiempo real de cajas de reciclaje
- **CRUD Completo**: Crear, leer, actualizar y eliminar cajas
- **Tiempo Real**: Sincronización automática entre usuarios
- **Geolocalización**: Ubicación precisa de cada caja

### 💾 Sistema Avanzado de Local Storage
- **Persistencia Automática**: Los formularios se guardan automáticamente
- **Sincronización entre Pestañas**: Cambios instantáneos en todas las ventanas
- **Validación Inteligente**: Validación automática antes de guardar
- **Caché Optimizado**: Reduce llamadas innecesarias a la API
- **Eventos en Tiempo Real**: Escucha cambios instantáneamente

### 🎛️ Controles de UI Avanzados
- **Toggles Persistentes**: Configuraciones que se mantienen entre sesiones
- **Temas Dinámicos**: Modo claro/oscuro con persistencia
- **Vista Adaptativa**: Controles de visualización personalizables
- **Notificaciones**: Sistema de notificaciones en tiempo real

### ✅ Sistema de Tareas CRUD
- **Gestión Local**: Tareas que se guardan localmente
- **Categorización**: Organización por categorías y prioridades
- **Filtros Avanzados**: Búsqueda y filtrado inteligente
- **Estadísticas**: Métricas de productividad en tiempo real

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI, Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Mapas**: Leaflet
- **Estado**: Hooks personalizados con Local Storage
- **Validación**: Zod
- **Deployment**: Vercel

## 📁 Estructura del Proyecto

```
recipunto/
├── app/                    # Páginas de Next.js
├── components/             # Componentes reutilizables
│   ├── examples/          # Componentes de demostración
│   ├── boxes/             # Componentes de cajas de reciclaje
│   ├── map/               # Componentes del mapa
│   └── ui/                # Componentes base de UI
├── hooks/                 # Hooks personalizados
│   ├── useLocalStorage.ts     # Hook principal de Local Storage
│   ├── useFormPersistence.ts  # Persistencia de formularios
│   ├── useLocalTasks.ts       # Sistema CRUD de tareas
│   ├── useUIToggles.ts        # Toggles de interfaz
│   ├── useStorageEvents.ts    # Eventos de Local Storage
│   └── useSmartCache.ts       # Caché inteligente
├── lib/                   # Utilidades y servicios
├── docs/                  # Documentación
└── public/               # Archivos estáticos
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/recipunto.git
cd recipunto
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env.local
```

Editar `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

4. **Configurar la base de datos**
```bash
# Ejecutar scripts de configuración de Supabase
npm run setup:db
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📚 Documentación

### Guía de Local Storage
Para aprender a usar el sistema completo de Local Storage, consulta la [Guía de Local Storage](docs/LOCAL_STORAGE_GUIDE.md).

### Demo Interactivo
Visita `/demo-local-storage` para ver todos los hooks en acción con ejemplos interactivos.

### API Reference
- [Hooks de Local Storage](docs/hooks/useLocalStorage.md)
- [Formularios Persistentes](docs/hooks/useFormPersistence.md)
- [Sistema de Tareas](docs/hooks/useLocalTasks.md)
- [Toggles de UI](docs/hooks/useUIToggles.md)

## 🎯 Casos de Uso

### 1. Gestión de Cajas de Reciclaje
```typescript
import { useBoxes } from '@/hooks/useBoxes'

function BoxManager() {
  const { boxes, createBox, updateBox, deleteBox } = useBoxes()
  
  // Las operaciones se sincronizan automáticamente
  // Los datos se persisten en Local Storage
}
```

### 2. Formularios con Persistencia
```typescript
import { useBoxFormPersistence } from '@/hooks/useFormPersistence'

function BoxForm() {
  const { formData, updateField, isDirty } = useBoxFormPersistence()
  
  // El formulario se guarda automáticamente
  // Los datos no se pierden al recargar
}
```

### 3. Tareas Locales
```typescript
import { useRecyclingTasks } from '@/hooks/useLocalTasks'

function TaskManager() {
  const { tasks, createTask, toggleTask, stats } = useRecyclingTasks()
  
  // Sistema completo CRUD para tareas
  // Estadísticas en tiempo real
}
```

## 🔧 Configuración Avanzada

### Personalizar Local Storage
```typescript
const [data, setData] = useLocalStorage('key', defaultValue, {
  serialize: customSerialize,
  deserialize: customDeserialize,
  syncAcrossTabs: true
})
```

### Configurar Caché
```typescript
const cache = useSmartCache('data', {
  config: {
    ttl: 5 * 60 * 1000, // 5 minutos
    maxSize: 100,
    strategy: 'lru'
  }
})
```

## 🚀 Deployment

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

### Otras Plataformas
- **Netlify**: Compatible con Next.js
- **Railway**: Deploy con base de datos incluida
- **Docker**: Imagen Docker disponible

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollo**: Elias
- **UI/UX**: Diseño moderno con Tailwind CSS
- **Backend**: Supabase
- **Deployment**: Vercel

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/recipunto/issues)
- **Documentación**: [Wiki del proyecto](https://github.com/tu-usuario/recipunto/wiki)
- **Demo**: [Demo en vivo](https://recipunto.vercel.app/demo-local-storage)

## 🎉 Agradecimientos

- Supabase por el excelente backend
- Vercel por el hosting
- La comunidad de Next.js
- Todos los contribuidores

---

**Recipunto** - Haciendo el reciclaje más inteligente y accesible 🌱
