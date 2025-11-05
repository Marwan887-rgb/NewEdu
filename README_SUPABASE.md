Supabase Migration & Connection
===============================

Goal
----
Provide a safe path to test Supabase connectivity and migrate current Firestore data to Supabase (Postgres).

Files added
-----------
- `functions/supabaseClient.js` - returns a Supabase server client using env vars.
- `functions/migrate_to_supabase.js` - Node script to read collections from Firestore and upsert them into Supabase.
- `supabase_schema.sql` - suggested Postgres schema to create in Supabase before migration.
- `functions/package.json` updated to include `@supabase/supabase-js` dependency.

Quick start (local test)
------------------------
1. Create a Supabase project and create the tables using `supabase_schema.sql` (SQL Editor in Supabase dashboard).
2. In your local session set environment variables (PowerShell):

```powershell
$env:SUPABASE_URL='https://<your-project>.supabase.co'
$env:SUPABASE_SERVICE_ROLE_KEY='your-service-role-key'
$env:GOOGLE_APPLICATION_CREDENTIALS='C:\path\to\service-account.json'
```

3. Install dependencies inside `functions/`:

```powershell
cd 'c:\Users\mrn88\OneDrive\المستندات\EduActive\functions'
npm install
```

4. Dry-run the migration (this will only print what would be inserted):

```powershell
node migrate_to_supabase.js --dry
```

5. If the dry-run looks good, run the real migration:

```powershell
node migrate_to_supabase.js --run
```

6. Verify data in Supabase (SQL editor or Table view).

Integration notes
-----------------
- After migration, update your Cloud Functions to use Supabase client:
  - Require and create client: `const { getSupabaseClient } = require('./supabaseClient'); const supabase = getSupabaseClient();`
  - Use `await supabase.from('table').insert(...)` or `.select()` etc.
- Keep sensitive keys secret. For production use store the Supabase service role key in Secret Manager or the secure mechanism of your hosting provider.

If you want I can:
- Add example edits to `functions/index.js` showing `saveProgress` implemented with Supabase.
- Run the dry-run migration here if you provide `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (or run it locally using the commands above).

Safety
------
- Always run dry-run first. Test on a staging Supabase project before migrating production.
- `SUPABASE_SERVICE_ROLE_KEY` is powerful — keep it secret. Consider rotating it after migration.
