const { createClient } = require('@supabase/supabase-js')

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas')
  console.log('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCollaborativeUpdates() {
  console.log('🧪 Probando actualizaciones colaborativas...\n')

  try {
    // 1. Obtener una caja existente
    console.log('1. Obteniendo cajas existentes...')
    const { data: boxes, error: fetchError } = await supabase
      .from('recycling_boxes')
      .select('*')
      .limit(1)

    if (fetchError) {
      throw new Error(`Error al obtener cajas: ${fetchError.message}`)
    }

    if (!boxes || boxes.length === 0) {
      console.log('❌ No hay cajas en la base de datos. Crea una caja primero.')
      return
    }

    const testBox = boxes[0]
    console.log(`✅ Caja encontrada: ${testBox.id}`)
    console.log(`   - Cantidad actual: ${testBox.current_amount}`)
    console.log(`   - Capacidad: ${testBox.capacity}`)
    console.log(`   - Creada por: ${testBox.created_by}`)
    console.log(`   - Está llena: ${testBox.is_full}\n`)

    // 2. Simular actualización colaborativa (cualquier usuario autenticado)
    console.log('2. Probando actualización colaborativa...')
    const newAmount = Math.min(testBox.current_amount + 5, testBox.capacity)
    const newIsFull = newAmount >= testBox.capacity

    const { data: updatedBox, error: updateError } = await supabase
      .from('recycling_boxes')
      .update({
        current_amount: newAmount,
        is_full: newIsFull
      })
      .eq('id', testBox.id)
      .select()
      .single()

    if (updateError) {
      console.log(`❌ Error en actualización colaborativa: ${updateError.message}`)
      console.log(`   Código: ${updateError.code}`)
      console.log(`   Detalles: ${updateError.details}`)
      console.log(`   Hint: ${updateError.hint}`)
    } else {
      console.log('✅ Actualización colaborativa exitosa!')
      console.log(`   - Nueva cantidad: ${updatedBox.current_amount}`)
      console.log(`   - Nuevo estado: ${updatedBox.is_full ? 'Llena' : 'Disponible'}`)
    }

    // 3. Verificar políticas RLS
    console.log('\n3. Verificando políticas RLS...')
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'recycling_boxes')

    if (policiesError) {
      console.log('⚠️  No se pudieron obtener las políticas (normal en algunos casos)')
    } else {
      console.log(`✅ Políticas encontradas: ${policies.length}`)
      policies.forEach(policy => {
        console.log(`   - ${policy.policyname}: ${policy.permissive ? 'PERMISSIVE' : 'RESTRICTIVE'}`)
      })
    }

    // 4. Probar actualización de campos restringidos (debería fallar)
    console.log('\n4. Probando actualización de campos restringidos...')
    const { error: restrictedUpdateError } = await supabase
      .from('recycling_boxes')
      .update({
        capacity: testBox.capacity + 10, // Este campo no debería ser actualizable por otros usuarios
        lat: testBox.lat + 0.001
      })
      .eq('id', testBox.id)

    if (restrictedUpdateError) {
      console.log('✅ Correctamente bloqueado: No se pueden actualizar campos restringidos')
      console.log(`   Error: ${restrictedUpdateError.message}`)
    } else {
      console.log('⚠️  Advertencia: Se permitió actualizar campos restringidos')
    }

    console.log('\n🎉 Prueba de actualizaciones colaborativas completada!')

  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message)
  }
}

// Ejecutar la prueba
testCollaborativeUpdates()
