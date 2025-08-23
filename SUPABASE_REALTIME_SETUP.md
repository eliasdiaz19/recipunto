# Configuración de Supabase Realtime

## Habilitar Realtime en la tabla `boxes`

Para que la funcionalidad de tiempo real funcione correctamente, necesitas habilitar Realtime en tu base de datos de Supabase.

### Opción 1: Desde el Dashboard de Supabase

1. Ve a tu proyecto de Supabase
2. Navega a **Database** > **Replication**
3. En la sección **Tables**, busca la tabla `boxes`
4. Habilita la opción **Enable Realtime** para la tabla `boxes`
5. Guarda los cambios

### Opción 2: Usando SQL

Ejecuta el siguiente comando SQL en el **SQL Editor** de Supabase:

```sql
-- Habilitar Realtime para la tabla boxes
ALTER PUBLICATION supabase_realtime ADD TABLE boxes;

-- Verificar que Realtime esté habilitado
SELECT 
    schemaname,
    tablename,
    pubname
FROM pg_publication_tables 
WHERE tablename = 'boxes';
```

### Opción 3: Verificar desde la API

Puedes verificar si Realtime está habilitado haciendo una petición a:

```
GET https://[YOUR_PROJECT_REF].supabase.co/rest/v1/boxes?select=count
```

Si Realtime está habilitado, deberías ver en la consola del navegador:
- ✅ Suscrito exitosamente a cambios en tiempo real

## Configuración de políticas RLS (Row Level Security)

Asegúrate de que las políticas RLS estén configuradas correctamente para permitir operaciones CRUD:

```sql
-- Política para permitir lectura a todos los usuarios autenticados
CREATE POLICY "Allow authenticated users to read boxes" ON boxes
FOR SELECT USING (auth.role() = 'authenticated');

-- Política para permitir inserción a usuarios autenticados
CREATE POLICY "Allow authenticated users to insert boxes" ON boxes
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para permitir actualización a creadores de cajas
CREATE POLICY "Allow creators to update boxes" ON boxes
FOR UPDATE USING (auth.uid() = creator_id);

-- Política para permitir eliminación a creadores de cajas
CREATE POLICY "Allow creators to delete boxes" ON boxes
FOR DELETE USING (auth.uid() = creator_id);
```

## Verificación de la funcionalidad

Una vez configurado Realtime:

1. Abre la aplicación en dos pestañas diferentes
2. Inicia sesión con el mismo usuario en ambas
3. En una pestaña, agrega, actualiza o elimina una caja
4. En la otra pestaña, deberías ver los cambios automáticamente
5. Verifica en la consola del navegador que aparezcan los mensajes de Realtime

## Solución de problemas

### Error: "Realtime is not enabled for this table"
- Verifica que hayas habilitado Realtime para la tabla `boxes`
- Asegúrate de que la tabla tenga políticas RLS configuradas

### Error: "Cannot read properties of undefined (reading 'subscribe')"
- Verifica que las variables de entorno de Supabase estén configuradas correctamente
- Asegúrate de que el cliente de Supabase se esté inicializando correctamente

### Las notificaciones no aparecen
- Verifica que el hook `useRealtimeNotifications` esté funcionando
- Revisa la consola del navegador para errores de JavaScript

## Variables de entorno requeridas

Asegúrate de tener estas variables en tu archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```

## Recursos adicionales

- [Documentación oficial de Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Guía de políticas RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Configuración de Realtime](https://supabase.com/docs/guides/realtime/quickstart)
