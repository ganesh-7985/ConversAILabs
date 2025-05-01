# ConversAI Labs - Notes Service

A minimal Supabase backend for a personal "notes" service.

## Setup & Deployment

1. Create a new Supabase project at [https://app.supabase.com](https://app.supabase.com)
2. Set up the following environment variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
3. Run the schema.sql file in the SQL editor to create the notes table
4. Deploy the edge functions:
   ```bash
   supabase functions deploy post_notes
   supabase functions deploy get_notes
   ```

## Schema Design

The notes table is designed with the following considerations:

- **UUID Primary Key**: Using UUID instead of sequential IDs prevents enumeration attacks and makes IDs unpredictable. The `gen_random_uuid()` function automatically generates these values.
- **User Reference**: Each note is linked to a user via `user_id` with a foreign key constraint to ensure data integrity.
- **Row-Level Security**: RLS policies ensure users can only access their own notes, providing strong data isolation.
- **Timestamps**: Automatic timestamps track creation and update times without requiring application code.

## API Endpoints

### POST /notes

Creates a new note for the authenticated user.

```bash
curl -X POST https://afdkjwrmlcitvebwjloe.supabase.co/functions/v1/post_notes \
  -H "Authorization: Bearer [ACCESS_TOKEN]" \
  -H "Content-Type: application/json" \
  -d '{"title": "My First Note", "content": "This is the content of my first note."}'
```

Expected response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "auth-user-id",
  "title": "My First Note",
  "content": "This is the content of my first note.",
  "created_at": "2023-05-01T12:00:00.000Z",
  "updated_at": "2023-05-01T12:00:00.000Z"
}
```

### GET /notes

Retrieves all notes for the authenticated user.

```bash
curl -X GET https://afdkjwrmlcitvebwjloe.supabase.co/functions/v1/get_notes \
  -H "Authorization: Bearer [ACCESS_TOKEN]"
```

Expected response:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "auth-user-id",
    "title": "My First Note",
    "content": "This is the content of my first note.",
    "created_at": "2023-05-01T12:00:00.000Z",
    "updated_at": "2023-05-01T12:00:00.000Z"
  },
  {
    "id": "223e4567-e89b-12d3-a456-426614174001",
    "user_id": "auth-user-id",
    "title": "My Second Note",
    "content": "This is the content of my second note.",
    "created_at": "2023-05-02T12:00:00.000Z",
    "updated_at": "2023-05-02T12:00:00.000Z"
  }
]
```