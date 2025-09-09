# Supabase Setup (Recipunto)

Sigue estos pasos para preparar Supabase para el entorno local y Vercel.

## 1) Crear proyecto en Supabase
1. Ingresa a https://supabase.com/ y crea una organización y un proyecto.
2. Region: la más cercana a tu audiencia (LATAM si está disponible).
3. Plan: Free está bien para desarrollo.

## 2) Habilitar métodos de autenticación
1. En el Dashboard → Authentication → Providers → Email.
2. Activa:
   - Email + Password.
   - Magic Links (OTP por email).
3. Guarda los cambios.

## 3) Variables de entorno
Obtén en Dashboard → Project Settings → API:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (SERVER ONLY; NO CLIENT)

En local, crea `.env.local` (no se commitea):
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# Opcional server-side:
# SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_DEBUG=1
```
En Vercel, ve a Project → Settings → Environment Variables y añade las mismas (sin el SERVICE_ROLE salvo que uses API routes privadas).

## 4) Storage (opcional)
1. Dashboard → Storage → Create bucket `avatars`.
2. Public bucket: marcado si servirás avatares públicos.

## 5) Realtime (opcional ahora)
1. Dashboard → Database → Replication → Realtime.
2. Activa para tablas que necesiten suscripción (posteriormente `profiles`).

## 6) Crear el esquema
1. Abre Dashboard → SQL editor.
2. Copia y ejecuta el contenido de `db/schema.sql`.
3. Luego aplica las políticas RLS con `db/rls.sql` (archivo a crear en el siguiente paso del flujo).

## 7) Validación rápida
- En Database → Tables, verifica que existan `profiles` y `user_settings`.
- Inserta manualmente un `profiles` con un `uid` existente de `auth.users` o crea un usuario desde Authentication → Users y luego inserta el perfil.

## 8) Seguridad
- Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` en el cliente o `.env.local` que se envíe al navegador.
- Usa API routes de Next.js para acciones privilegiadas.

## 9) Troubleshooting
- Si el enum `app_role` ya existe, puedes omitir su creación o usar `drop type app_role` con precaución en dev.
- Si tienes errores de permisos, revisa que las políticas RLS estén aplicadas y que el usuario esté autenticado.
