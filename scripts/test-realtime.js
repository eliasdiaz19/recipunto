/**
 * Test script to verify real-time functionality
 * Run with: node scripts/test-realtime.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...')
  
  try {
    const { data, error } = await supabase
      .from('recycling_boxes')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      return false
    }
    
    console.log('✅ Database connection successful')
    return true
  } catch (err) {
    console.error('❌ Database connection failed:', err.message)
    return false
  }
}

async function testRealtimeSubscription() {
  console.log('🔍 Testing real-time subscription...')
  
  return new Promise((resolve) => {
    const channel = supabase
      .channel('test_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recycling_boxes'
        },
        (payload) => {
          console.log('✅ Real-time event received:', payload.eventType)
          supabase.removeChannel(channel)
          resolve(true)
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Real-time subscription active')
          
          // Test with a temporary box
          setTimeout(async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser()
              if (!user) {
                console.log('⚠️  No authenticated user - creating test box will fail')
                console.log('   This is expected if you haven\'t logged in yet')
                supabase.removeChannel(channel)
                resolve(true)
                return
              }
              
              const { error } = await supabase
                .from('recycling_boxes')
                .insert({
                  lat: 40.4168,
                  lng: -3.7038,
                  capacity: 50,
                  current_amount: 0,
                  created_by: user.id
                })
              
              if (error) {
                console.error('❌ Failed to create test box:', error.message)
                supabase.removeChannel(channel)
                resolve(false)
              } else {
                console.log('✅ Test box created - waiting for real-time event...')
              }
            } catch (err) {
              console.error('❌ Error creating test box:', err.message)
              supabase.removeChannel(channel)
              resolve(false)
            }
          }, 1000)
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Real-time subscription failed')
          resolve(false)
        }
      })
    
    // Timeout after 10 seconds
    setTimeout(() => {
      console.log('⏰ Real-time test timeout')
      supabase.removeChannel(channel)
      resolve(false)
    }, 10000)
  })
}

async function main() {
  console.log('🚀 Starting real-time functionality test...\n')
  
  const dbConnected = await testDatabaseConnection()
  if (!dbConnected) {
    console.log('\n❌ Database test failed. Please check your setup.')
    process.exit(1)
  }
  
  console.log('')
  const realtimeWorking = await testRealtimeSubscription()
  
  console.log('\n' + '='.repeat(50))
  if (realtimeWorking) {
    console.log('🎉 All tests passed! Real-time functionality is working.')
    console.log('\nNext steps:')
    console.log('1. Start your development server: npm run dev')
    console.log('2. Open the app in multiple browser windows')
    console.log('3. Create/update boxes and watch them sync in real-time!')
  } else {
    console.log('❌ Real-time test failed. Please check:')
    console.log('1. Real-time is enabled for recycling_boxes table in Supabase')
    console.log('2. Your Supabase project is active')
    console.log('3. Network connectivity is working')
  }
  console.log('='.repeat(50))
}

main().catch(console.error)
