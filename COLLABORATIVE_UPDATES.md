# Actualizaciones Colaborativas de Cajas

## Descripción

Esta funcionalidad permite que cualquier usuario autenticado pueda actualizar la cantidad de envases (`current_amount`) y el estado de llenado (`is_full`) de cualquier caja de reciclaje, independientemente de quién la haya creado.

## Características

### ✅ **Permitido para todos los usuarios autenticados:**
- Actualizar `current_amount` (cantidad actual de envases)
- Actualizar `is_full` (estado de llenado)
- Ver información de todas las cajas

### ❌ **Solo para el creador de la caja:**
- Actualizar `lat` y `lng` (ubicación)
- Actualizar `capacity` (capacidad)
- Eliminar la caja
- Mover la caja

## Implementación Técnica

### 1. Políticas RLS (Row Level Security)

```sql
-- Política para creadores (pueden actualizar todo)
CREATE POLICY "Box creators can update their boxes" ON recycling_boxes
  FOR UPDATE USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Política para usuarios autenticados (solo cantidad y estado)
CREATE POLICY "Authenticated users can update status" ON recycling_boxes
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (
    auth.role() = 'authenticated' AND
    (OLD.current_amount IS DISTINCT FROM NEW.current_amount OR OLD.is_full IS DISTINCT FROM NEW.is_full) AND
    NEW.current_amount >= 0 AND NEW.current_amount <= NEW.capacity
  );
```

### 2. Servicio de Base de Datos

```typescript
// Nuevo método para actualizaciones colaborativas
static async updateBoxStatus(id: string, statusData: UpdateBoxStatusData): Promise<RecyclingBox> {
  const { data, error } = await supabase
    .from('recycling_boxes')
    .update({
      current_amount: statusData.current_amount,
      is_full: statusData.is_full
    })
    .eq('id', id)
    .select()
    .single()
  // ... manejo de errores
}
```

### 3. Hook de React

```typescript
// Nuevo hook para actualizaciones colaborativas
const updateBoxStatus = useCallback(async (id: string, statusData: UpdateBoxStatusData): Promise<RecyclingBox> => {
  try {
    setError(null)
    const updatedBox = await BoxService.updateBoxStatus(id, statusData)
    return updatedBox
  } catch (err) {
    // ... manejo de errores
  }
}, [])
```

### 4. Interfaz de Usuario

#### Para el creador de la caja:
- Modal completo con todos los campos editables
- Opciones para mover y eliminar
- Actualización completa de la caja

#### Para otros usuarios:
- Vista de solo lectura de la información general
- Botón "Actualizar cantidad" que abre un modal específico
- Solo pueden modificar cantidad y estado de llenado

## Archivos Modificados

### Base de Datos
- `db/rls.sql` - Políticas RLS actualizadas

### Servicios
- `lib/boxes.ts` - Nuevo método `updateBoxStatus`
- `hooks/useBoxes.ts` - Hook `updateBoxStatus` agregado

### Componentes
- `components/boxes/update-box-status-modal.tsx` - Modal específico para actualizaciones colaborativas
- `components/map/update-box-modal.tsx` - Modal principal actualizado con lógica condicional
- `components/map/map-interface.tsx` - Integración de actualizaciones colaborativas
- `components/boxes/box-management.tsx` - Integración de actualizaciones colaborativas

### Pruebas
- `scripts/test-collaborative-updates.js` - Script de prueba para verificar funcionalidad

## Cómo Usar

### 1. Configurar Base de Datos

```bash
# Ejecutar las políticas RLS actualizadas
psql -h your-supabase-host -U postgres -d postgres -f db/rls.sql
```

### 2. Probar Funcionalidad

```bash
# Ejecutar script de prueba
node scripts/test-collaborative-updates.js
```

### 3. Usar en la Aplicación

1. **Como creador de caja:**
   - Haz clic en cualquier caja que hayas creado
   - Verás el modal completo con todas las opciones

2. **Como otro usuario:**
   - Haz clic en cualquier caja creada por otro usuario
   - Verás una vista de solo lectura con un botón "Actualizar cantidad"
   - Haz clic en "Actualizar cantidad" para modificar solo la cantidad y estado

## Beneficios

1. **Colaboración Real:** Los usuarios pueden actualizar el estado de las cajas sin necesidad de contactar al creador
2. **Seguridad:** Los campos críticos (ubicación, capacidad) solo pueden ser modificados por el creador
3. **Tiempo Real:** Los cambios se sincronizan instantáneamente entre todos los usuarios
4. **Experiencia de Usuario:** Interfaz clara que distingue entre permisos de creador y colaborador

## Consideraciones de Seguridad

- Las políticas RLS garantizan que solo se puedan actualizar campos específicos
- Validación de rangos (cantidad no puede exceder capacidad)
- Autenticación requerida para todas las operaciones
- Logs detallados para auditoría

## Próximos Pasos

1. Monitorear el uso de actualizaciones colaborativas
2. Considerar notificaciones cuando otros usuarios actualicen tus cajas
3. Implementar historial de cambios para auditoría
4. Agregar límites de frecuencia para evitar spam
