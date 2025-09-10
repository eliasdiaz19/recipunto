# Real-Time Box Status Updates Setup Guide

This guide will help you set up real-time data persistence for box status updates in your Recipunto application.

## Prerequisites

- Supabase project set up and configured
- Environment variables configured in `.env.local`
- Database access to your Supabase project

## Step 1: Database Setup

### 1.1 Create the Database Schema

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `db/schema.sql` and execute it
4. Copy and paste the contents of `db/rls.sql` and execute it

### 1.2 Enable Real-time for the Table

1. In Supabase Dashboard, go to **Database** → **Replication**
2. Find the `recycling_boxes` table
3. Toggle **Realtime** to **ON**

## Step 2: Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 3: Test the Implementation

### 3.1 Start Your Development Server

```bash
npm run dev
```

### 3.2 Test Real-time Updates

1. Open your application in two different browser windows/tabs
2. In one window, create or update a box
3. You should see the changes appear instantly in the other window without refreshing

### 3.3 Test Different Scenarios

- **Create a new box**: Should appear in real-time on all connected clients
- **Update box status**: Changes should sync immediately
- **Move a box**: Location updates should be reflected instantly
- **Delete a box**: Should disappear from all clients in real-time

## Step 4: Production Deployment

### 4.1 Database Migration

For production, run the same SQL scripts in your production Supabase instance:

1. Execute `db/schema.sql`
2. Execute `db/rls.sql`
3. Enable real-time replication for `recycling_boxes` table

### 4.2 Environment Variables

Set the same environment variables in your production environment (Vercel, etc.)

## Features Implemented

### ✅ Real-time Box Status Updates
- Box creation, updates, and deletion sync across all clients
- Automatic `is_full` status calculation based on capacity
- Optimistic UI updates with error handling

### ✅ Database Optimizations
- Proper indexes for location-based queries
- Automatic timestamp updates
- Data validation constraints
- Row Level Security (RLS) policies

### ✅ React Hooks
- `useBoxes()` - Main hook for all box operations
- `useBox(id)` - Hook for individual box with real-time updates
- `useBoxesByStatus(status)` - Filtered boxes by status

### ✅ Error Handling
- Loading states for better UX
- Error states with retry functionality
- Toast notifications for user feedback

## API Reference

### BoxService Methods

```typescript
// Get all boxes
const boxes = await BoxService.getAllBoxes()

// Get a specific box
const box = await BoxService.getBoxById(id)

// Create a new box
const newBox = await BoxService.createBox({
  lat: 40.4168,
  lng: -3.7038,
  capacity: 50,
  current_amount: 0
})

// Update a box
const updatedBox = await BoxService.updateBox(id, {
  current_amount: 25,
  capacity: 50
})

// Delete a box
await BoxService.deleteBox(id)

// Get boxes by status
const fullBoxes = await BoxService.getFullBoxes()
const availableBoxes = await BoxService.getAvailableBoxes()
```

### React Hooks

```typescript
// Main hook for all boxes
const { boxes, loading, error, createBox, updateBox, deleteBox } = useBoxes()

// Individual box hook
const { box, loading, error } = useBox(boxId)

// Filtered boxes hook
const { boxes } = useBoxesByStatus('full') // 'all' | 'full' | 'available'
```

## Troubleshooting

### Common Issues

1. **Real-time not working**: Check if real-time is enabled for the `recycling_boxes` table in Supabase
2. **Permission errors**: Verify RLS policies are correctly applied
3. **Connection issues**: Check your Supabase URL and API keys
4. **Data not syncing**: Ensure you're using the hooks instead of local state

### Debug Mode

Add this to your `.env.local` for debugging:

```env
NEXT_PUBLIC_DEBUG=1
```

This will log real-time events to the console.

## Performance Considerations

- Real-time subscriptions are automatically cleaned up when components unmount
- Database indexes are optimized for location-based queries
- Only necessary data is fetched and updated
- Error boundaries prevent crashes from real-time connection issues

## Security

- Row Level Security (RLS) ensures users can only modify their own boxes
- All database operations go through the service layer
- Input validation prevents invalid data
- Authentication is required for all write operations
