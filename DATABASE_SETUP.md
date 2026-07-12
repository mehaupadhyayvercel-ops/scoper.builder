# Database Setup Instructions (Supabase)

The frontend application is now fully wired up to send the assessment data to the backend. To ensure leads and their generated AI summaries are saved "live properly" to your Supabase database, follow these final steps.

## 1. Create the `leads` Table in Supabase
Run the following SQL in your Supabase SQL Editor to create the correct table schema:

```sql
create table leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text not null,
  email text not null,
  company_name text,
  industry text,
  project_description text,
  platforms jsonb,
  capabilities jsonb,
  timeline_preference text,
  budget_preference text,
  ai_summary jsonb
);

-- Optional: Enable Row Level Security (RLS) if required by your security model
alter table leads enable row level security;
```

## 2. Add Your Supabase Keys
The code is looking for two environment variables to securely connect to your database. 

**Locally:**
Open your `.env` file and add the following:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-supabase-service-role-key
```
*(Note: You must use the Service Role Key because this runs securely on the backend. Do not use the Anon Key).*

**Live (Vercel):**
Go to your Vercel Dashboard -> Project Settings -> Environment Variables. Add the exact same two keys.

## 3. How It Works
Once the keys are detected, the app automatically works in the background:
1. User completes all screens and clicks "Generate Summary".
2. The AI generates the summary.
3. The backend instantly inserts the user's details and the AI's JSON output into the `leads` table.
4. If the key is missing, it skips saving (to prevent crashing the app) and logs a warning.
