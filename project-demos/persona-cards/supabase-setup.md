# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization and enter project details:
   - Name: "Stakeholder Impact Tool"
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
4. Click "Create new project"

## 2. Create the Database Table

Once your project is ready, go to the SQL Editor and run this SQL:

```sql
-- Create the stakeholders table
CREATE TABLE stakeholders (
    id BIGSERIAL PRIMARY KEY,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar TEXT,
    name TEXT,
    department TEXT,
    impact_level TEXT,
    concerns TEXT,
    communication TEXT,
    project_phase TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster queries
CREATE INDEX idx_stakeholders_session_id ON stakeholders(session_id);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can make this more restrictive)
CREATE POLICY "Allow all operations on stakeholders" ON stakeholders
    FOR ALL USING (true);
```

## 3. Get Your Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy your:
   - Project URL
   - Anon (public) key

## 4. Update the Configuration

Open `script.js` and replace these lines:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

With your actual credentials:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

## 5. Test the Connection

1. Open your HTML file in a browser
2. Open the browser's developer console (F12)
3. You should see "Supabase initialized successfully" if everything is working
4. If you see "Supabase credentials not configured", the app will work with localStorage instead

## 6. Optional: Set Up Authentication

If you want users to have persistent sessions across devices, you can set up Supabase Auth:

1. Go to Authentication > Settings in your Supabase dashboard
2. Enable the providers you want (Email, Google, etc.)
3. Update the JavaScript to handle user authentication
4. Modify the database queries to filter by user ID instead of session ID

## 7. Database Schema Details

The `stakeholders` table includes:

- `id`: Auto-incrementing primary key
- `session_id`: Unique identifier for each user session
- `role`: The stakeholder role (CISO, Engineer, etc.)
- `avatar`: URL to the avatar image
- `name`: Stakeholder name or group name
- `department`: Department or team
- `impact_level`: Low, Medium, High, or Critical
- `concerns`: Key concerns about the changes
- `communication`: Preferred communication method
- `project_phase`: Which project phase they're most impacted by
- `created_at`: When the record was created
- `updated_at`: When the record was last updated

## Troubleshooting

- **"Invalid API key"**: Check that you copied the correct anon key
- **"Failed to fetch"**: Check your project URL and ensure it's accessible
- **"Permission denied"**: Check your RLS policies or disable RLS for testing
- **Data not saving**: Check the browser console for error messages
