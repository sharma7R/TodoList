# Supabase Setup Guide for TodoList

Follow these steps to set up Supabase for your TodoList application.

## 🚀 **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `todolist-app` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"
7. Wait for project to be created (2-3 minutes)

## 🔑 **Step 2: Get Your Credentials**

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

## 📝 **Step 3: Create Environment File**

1. Create a `.env` file in your project root
2. Add your credentials:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🗄️ **Step 4: Set Up Database**

1. Go to **SQL Editor** in your Supabase dashboard
2. Run this SQL to create the users table:
```sql
-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY NOT NULL,
    avatar_url text,
    user_id text UNIQUE,
    token_identifier text NOT NULL,
    image text,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone,
    email text,
    name text,
    full_name text
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see only their own data
CREATE POLICY "Users can view own data" ON public.users
FOR SELECT USING (auth.uid()::text = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    user_id,
    email,
    name,
    full_name,
    avatar_url,
    token_identifier,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.id::text,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email,
    NEW.created_at,
    NEW.updated_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to handle user updates
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET
    email = NEW.email,
    name = NEW.raw_user_meta_data->>'name',
    full_name = NEW.raw_user_meta_data->>'full_name',
    avatar_url = NEW.raw_user_meta_data->>'avatar_url',
    updated_at = NEW.updated_at
  WHERE user_id = NEW.id::text;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();
```

## ⚙️ **Step 5: Configure Authentication**

1. Go to **Authentication** > **Settings**
2. Configure these settings:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Additional Redirect URLs**: 
     - `http://localhost:5173/auth/callback`
     - `http://localhost:5173`
3. Ensure **Enable signup** is turned ON
4. Set **Enable email confirmations** to OFF (for easier testing)

## 🌐 **Step 6: Configure CORS**

1. Go to **Settings** > **API**
2. In **Additional Allowed Origins**, add:
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`

## 🧪 **Step 7: Test Your Setup**

1. Start your development server:
```bash
npm run dev
```

2. Open your browser to `http://localhost:5173`
3. Try to create an account
4. Check the browser console for any errors

## 🔍 **Step 8: Debug Common Issues**

If you encounter errors:

1. **Check environment variables**:
```javascript
// Add this to your app temporarily
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

2. **Test Supabase connection**:
```javascript
// Add this to test connection
import { supabase } from './supabase/supabase';
supabase.auth.getSession().then(({ data, error }) => {
  console.log('Connection test:', { data, error });
});
```

3. **Check browser console** for specific error messages

## 📱 **Step 9: Set Up Google Auth (Optional)**

If you want to use Google authentication:

1. Follow the guide in `GOOGLE_AUTH_SETUP.md`
2. Configure Google OAuth in Supabase:
   - Go to **Authentication** > **Providers**
   - Enable Google
   - Add your Google OAuth credentials

## ✅ **Verification Checklist**

- [ ] Supabase project created
- [ ] Environment variables set
- [ ] Database schema created
- [ ] Authentication configured
- [ ] CORS settings updated
- [ ] Account creation works
- [ ] Login works
- [ ] Google auth works (if configured)

## 🆘 **Need Help?**

If you're still having issues:

1. Check the **SUPABASE_TROUBLESHOOTING.md** file
2. Look at the browser console for specific error messages
3. Verify all environment variables are set correctly
4. Ensure your Supabase project is active and not paused

## 🚀 **Next Steps**

Once Supabase is working:

1. Create your first account
2. Test the authentication flow
3. Set up Google authentication (optional)
4. Start building your todo features
5. Deploy to production when ready 