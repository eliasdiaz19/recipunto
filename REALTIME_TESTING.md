# Pruebas de Funcionalidad Realtime - Recipunto

## 🧪 **Verificación del Sistema de Deduplicación**

### **Prueba 1: Operaciones Locales vs. Eventos Realtime**

#### **Escenario: Usuario agrega una caja**
1. **Abrir la aplicación** en dos pestañas diferentes
2. **Iniciar sesión** con el mismo usuario en ambas
3. **En la pestaña A**: Hacer clic en el mapa para agregar una caja
4. **Verificar en la consola** que aparezca:
   ```
   Operación INSERT registrada para ID: temp_[timestamp]
   ```
5. **Verificar en la pestaña B**: La caja aparece automáticamente
6. **Verificar en la consola** que aparezca:
   ```
   Evento INSERT ignorado - operación local en progreso para ID: [id]
   Operación INSERT completada para ID: [id]
   ```

#### **Resultado Esperado:**
- ✅ No hay duplicados en la interfaz
- ✅ El estado se mantiene consistente
- ✅ Las notificaciones aparecen correctamente
- ✅ El panel de debug muestra la operación

### **Prueba 2: Cambios Externos**

#### **Escenario: Otro usuario actualiza una caja**
1. **En la pestaña A**: Actualizar el estado de una caja a "llena"
2. **Verificar en la pestaña B**: El cambio aparece automáticamente
3. **Verificar en la consola** que aparezca:
   ```
   Caja actualizada en tiempo real: [payload]
   Versión de caja [id] actualizada: [old] -> [new]
   ```
4. **Verificar notificación**: Aparece toast informando del cambio

#### **Resultado Esperado:**
- ✅ Los cambios se sincronizan en tiempo real
- ✅ Las notificaciones aparecen para cambios externos
- ✅ El panel de debug muestra las versiones actualizadas

### **Prueba 3: Manejo de Errores**

#### **Escenario: Error en la operación**
1. **Simular error**: Desconectar internet temporalmente
2. **Intentar agregar caja**: Debería fallar
3. **Verificar en la consola** que aparezca:
   ```
   Error al agregar caja: [error message]
   ```
4. **Verificar que se limpie** la operación pendiente
5. **Restaurar conexión**: Debería reconectarse automáticamente

#### **Resultado Esperado:**
- ✅ Los errores se manejan correctamente
- ✅ Las operaciones pendientes se limpian
- ✅ La reconexión es automática
- ✅ El estado no se corrompe

## 🔍 **Verificación del Panel de Debug**

### **Prueba 4: Funcionalidades de Debug**

#### **Escenario: Uso del panel de debug**
1. **Hacer clic en el botón 🐛** (esquina inferior izquierda)
2. **Verificar que se muestre** el panel de debug
3. **Expandir el panel** (botón 📈)
4. **Verificar información mostrada**:
   - Estado de conexión
   - Contador de eventos
   - Contador de errores
   - Último evento
   - Operaciones pendientes
   - Versiones de cajas
5. **Probar botones**:
   - Test Event: Debería incrementar contador de eventos
   - Test Error: Debería incrementar contador de errores
   - Limpiar: Debería resetear contadores
   - Exportar Logs: Debería descargar archivo JSON

#### **Resultado Esperado:**
- ✅ El panel solo aparece en desarrollo
- ✅ Toda la información se muestra correctamente
- ✅ Los botones funcionan como se espera
- ✅ La exportación de logs funciona

## 📊 **Verificación de Métricas**

### **Prueba 5: Contadores y Logs**

#### **Escenario: Múltiples operaciones**
1. **Agregar 3 cajas** en secuencia
2. **Actualizar 2 cajas** con diferentes cambios
3. **Eliminar 1 caja**
4. **Verificar contadores** en el panel de debug:
   - Eventos: Debería ser >= 6 (3 INSERT + 2 UPDATE + 1 DELETE)
   - Errores: Debería ser 0 (si no hay errores)
5. **Verificar operaciones pendientes**: Debería estar vacío
6. **Verificar versiones de cajas**: Debería mostrar todas las cajas

#### **Resultado Esperado:**
- ✅ Los contadores se incrementan correctamente
- ✅ Las operaciones pendientes se limpian
- ✅ Las versiones se mantienen actualizadas
- ✅ No hay memory leaks

## 🚨 **Verificación de Casos Edge**

### **Prueba 6: Race Conditions**

#### **Escenario: Operaciones simultáneas**
1. **Abrir 3 pestañas** con la misma sesión
2. **En cada pestaña**: Hacer clic para agregar caja al mismo tiempo
3. **Verificar que no haya conflictos**:
   - Solo una caja se agrega por clic
   - No hay duplicados
   - El estado se mantiene consistente
4. **Verificar en el debug** que las operaciones se manejen correctamente

#### **Resultado Esperado:**
- ✅ No hay conflictos entre operaciones simultáneas
- ✅ Cada operación se procesa correctamente
- ✅ El estado final es consistente

### **Prueba 7: Reconexión Automática**

#### **Escenario: Pérdida de conexión**
1. **Desconectar internet** temporalmente
2. **Verificar que el indicador** cambie a "Desconectado"
3. **Verificar que las notificaciones** muestren el estado
4. **Restaurar conexión**
5. **Verificar reconexión automática**:
   - El indicador vuelve a "Conectado"
   - Se muestran notificaciones de reconexión
   - Las operaciones pendientes se procesan

#### **Resultado Esperado:**
- ✅ La desconexión se detecta correctamente
- ✅ La reconexión es automática
- ✅ El estado se recupera correctamente
- ✅ No se pierden operaciones

## 🔧 **Verificación de Configuración**

### **Prueba 8: Variables de Entorno**

#### **Escenario: Configuración de Supabase**
1. **Verificar archivo .env.local**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY]
   ```
2. **Verificar que la aplicación** se inicie sin errores
3. **Verificar en la consola** que aparezca:
   ```
   ✅ Suscrito exitosamente a cambios en tiempo real
   ```

#### **Resultado Esperado:**
- ✅ La aplicación se inicia correctamente
- ✅ No hay errores de configuración
- ✅ La conexión a Supabase funciona
- ✅ Realtime se conecta exitosamente

## 📋 **Checklist de Verificación**

### **Funcionalidades Core:**
- [ ] Supabase Realtime se conecta correctamente
- [ ] Las operaciones locales se registran como pendientes
- [ ] Los eventos Realtime se filtran correctamente
- [ ] No hay duplicados en la interfaz
- [ ] Las notificaciones aparecen correctamente
- [ ] El estado se mantiene consistente

### **Sistema de Debug:**
- [ ] El panel de debug aparece en desarrollo
- [ ] La información se actualiza en tiempo real
- [ ] Los contadores funcionan correctamente
- [ ] La exportación de logs funciona
- [ ] No hay dependencias circulares

### **Manejo de Errores:**
- [ ] Los errores se capturan y registran
- [ ] Las operaciones pendientes se limpian
- [ ] La reconexión es automática
- [ ] No hay memory leaks
- [ ] El estado se recupera correctamente

### **Rendimiento:**
- [ ] No hay re-renders innecesarios
- [ ] Las operaciones son idempotentes
- [ ] El sistema maneja múltiples usuarios
- [ ] La sincronización es eficiente
- [ ] No hay bloqueos de UI

## 🚀 **Cómo Ejecutar las Pruebas**

### **1. Preparación:**
```bash
# Asegurarse de que las variables de entorno estén configuradas
cp .env.example .env.local
# Editar .env.local con las credenciales de Supabase
```

### **2. Ejecutar la Aplicación:**
```bash
npm run dev
# Abrir http://localhost:3000
```

### **3. Ejecutar Pruebas:**
- Seguir cada escenario paso a paso
- Verificar la consola del navegador
- Usar el panel de debug para monitorear
- Probar con múltiples pestañas

### **4. Verificar Resultados:**
- Todos los checkboxes deberían estar marcados
- No debería haber errores en la consola
- La interfaz debería ser fluida y consistente
- Las notificaciones deberían aparecer correctamente

## 📚 **Recursos de Ayuda**

- [Documentación de Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Guía de configuración](SUPABASE_REALTIME_SETUP.md)
- [Sistema de deduplicación](REALTIME_DEDUPLICATION.md)
- [README de funcionalidades](README_REALTIME.md)

## 🆘 **Solución de Problemas**

### **Problema: "Realtime is not enabled for this table"**
**Solución:** Habilitar Realtime en Supabase Dashboard

### **Problema: "Cannot read properties of undefined"**
**Solución:** Verificar variables de entorno y configuración

### **Problema: Las notificaciones no aparecen**
**Solución:** Verificar que el hook useRealtimeNotifications esté funcionando

### **Problema: El panel de debug no se muestra**
**Solución:** Verificar que NODE_ENV sea 'development'
