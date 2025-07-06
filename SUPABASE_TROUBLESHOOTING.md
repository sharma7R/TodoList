# Supabase Account Creation Troubleshooting Guide

This guide will help you resolve common issues when creating accounts with Supabase in your TodoList application.

## 🔍 **Common Issues & Solutions**

### **Issue 1: Missing Environment Variables**

**Symptoms:**
- "Invalid API key" error
- "Unable to connect to Supabase" error
- Authentication requests fail

**Solution:**
1. Create a `.env` file in your project root:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

2. Get your Supabase credentials:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the "Project URL" and "anon public" key

### **Issue 2: Supabase Project Not Set Up**

**Symptoms:**
- "Project not found" error
- "Invalid project reference" error

**Solution:**
1. Create a new Supabase project:
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name and database password
   - Wait for project to be created

2. Run database migrations:
```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Start local development
supabase start

# Apply migrations
supabase db push
```

### **Issue 3: Database Schema Issues**

**Symptoms:**
- "Table does not exist" error
- "Function not found" error
- Users table missing

**Solution:**
1. Check if migrations are applied:
```bash
supabase db reset
```

2. Verify the `users` table exists:
```sql
-- Run this in Supabase SQL editor
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'users';
```

### **Issue 4: Authentication Configuration**

**Symptoms:**
- "Signup disabled" error
- "Email confirmation required" error
- "Invalid redirect URL" error

**Solution:**
1. Check Supabase Auth settings:
   - Go to Authentication > Settings
   - Ensure "Enable signup" is turned ON
   - Set "Site URL" to your app URL (e.g., `http://localhost:5173`)
   - Add redirect URLs in "Additional Redirect URLs"

2. For local development, add:
   - `http://localhost:5173`
   - `http://localhost:5173/auth/callback`

### **Issue 5: Email Configuration**

**Symptoms:**
- "Email service not configured" error
- Users can't receive confirmation emails

**Solution:**
1. For development, use Supabase's built-in email service
2. For production, configure SMTP:
   - Go to Authentication > Settings > SMTP
   - Add your SMTP credentials (SendGrid, Mailgun, etc.)

### **Issue 6: Password Requirements**

**Symptoms:**
- "Password too weak" error
- "Password requirements not met" error

**Solution:**
1. Check password requirements in `supabase/config.toml`:
```toml
[auth]
minimum_password_length = 6
password_requirements = ""
```

2. Ensure passwords meet minimum requirements:
   - At least 6 characters (configurable)
   - Consider enabling stronger requirements

### **Issue 7: CORS Issues**

**Symptoms:**
- "CORS error" in browser console
- "Cross-origin request blocked" error

**Solution:**
1. Add your domain to Supabase CORS settings:
   - Go to Settings > API
   - Add your domain to "Additional Allowed Origins"
   - For development: `http://localhost:5173`

### **Issue 8: Row Level Security (RLS)**

**Symptoms:**
- "Permission denied" error
- Users can't access their data

**Solution:**
1. Check RLS policies in your migrations
2. Ensure policies allow authenticated users to access their data

## 🛠️ **Debugging Steps**

### **Step 1: Check Browser Console**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Try to create an account
4. Look for error messages and copy them

### **Step 2: Check Network Tab**
1. Go to Network tab in developer tools
2. Try to create an account
3. Look for failed requests to Supabase
4. Check request/response details

### **Step 3: Verify Supabase Connection**
Add this to your app to test connection:
```javascript
// Test Supabase connection
supabase.auth.getSession().then(({ data, error }) => {
  console.log('Supabase connection test:', { data, error });
});
```

### **Step 4: Check Environment Variables**
Add this to verify env vars are loaded:
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

## 🚀 **Quick Fix Checklist**

- [ ] Environment variables set correctly
- [ ] Supabase project exists and is active
- [ ] Database migrations applied
- [ ] Authentication enabled in Supabase
- [ ] Site URL configured correctly
- [ ] Redirect URLs added
- [ ] CORS settings configured
- [ ] RLS policies in place

## 📞 **Getting Help**

If you're still experiencing issues:

1. **Check Supabase Status**: [status.supabase.com](https://status.supabase.com)
2. **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
3. **Supabase Discord**: [discord.gg/supabase](https://discord.gg/supabase)
4. **GitHub Issues**: [github.com/supabase/supabase](https://github.com/supabase/supabase)

## 🔧 **Common Error Messages & Solutions**

| Error Message | Solution |
|---------------|----------|
| "Invalid API key" | Check VITE_SUPABASE_ANON_KEY in .env |
| "Project not found" | Verify project URL and ensure project exists |
| "Signup disabled" | Enable signup in Auth > Settings |
| "Email confirmation required" | Disable email confirmation or configure SMTP |
| "CORS error" | Add domain to CORS settings |
| "Table does not exist" | Run database migrations |
| "Permission denied" | Check RLS policies |
| "Password too weak" | Meet minimum password requirements | 