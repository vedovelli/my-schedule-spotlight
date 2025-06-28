# 🚀 Supabase Setup Guide

## 📋 Prerequisites

1. **Supabase Project**: Ensure you have a Supabase project created
2. **Environment Variables**: Configure the required environment variables

## 🔧 Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### How to get these values:

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the following:
   - **Project URL** → Use as `VITE_SUPABASE_URL`
   - **anon/public key** → Use as `VITE_SUPABASE_ANON_KEY`

## 🔐 Authentication Setup

The Supabase client is configured with the following auth settings:

- **Auto Refresh Token**: Enabled
- **Persist Session**: Enabled
- **Detect Session in URL**: Enabled

## 📁 Client Configuration

The Supabase client is initialized in `src/lib/supabase.ts` and provides:

### Core Client

```typescript
import { supabase } from "@/lib/supabase";
```

### Auth Helper Functions

```typescript
import { auth } from "@/lib/supabase";

// Available methods:
await auth.signUp(email, password);
await auth.signIn(email, password);
await auth.signOut();
await auth.resetPassword(email);
await auth.getSession();
await auth.getUser();
auth.onAuthStateChange(callback);
```

## 🗃️ Database Types

Database types are defined in `src/lib/supabase.ts` and will be expanded as tables are created.

## ✅ Verification

To verify the setup is working:

1. Start the development server: `npm run dev`
2. Check the browser console for any Supabase connection errors
3. The client should initialize without throwing environment variable errors

## 🔗 Next Steps

1. ✅ **Client Setup** (Current step)
2. 🔄 **Database Schema Setup** (Task 3)
3. 🔄 **Authentication Implementation** (Task 2.2)
4. 🔄 **Auth UI Components** (Task 2.3)

---

_Updated: 2025-06-28_
