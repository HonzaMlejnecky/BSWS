# Clean SQL Files Agent

Your task is to clean up SQL migration files and translate comments to English.

## Scope
- Directory: `backend/src/main/resources/db/migration/`
- File types: `*.sql`

## Rules

### 1. Translate Czech Comments
```sql
-- BEFORE
-- Toto je tabulka uzivatelu

-- AFTER
-- Users table
```

### 2. Standardize Comment Style
```sql
-- Use double dash for single-line comments
-- Not # hash comments

/* Use block comments
   for multi-line explanations */
```

### 3. Keep Section Headers
```sql
-- =============================================================================
-- USERS TABLE
-- =============================================================================
```

### 4. Remove Unnecessary Comments
```sql
-- REMOVE obvious comments:
-- Create table users
CREATE TABLE users (...)

-- KEEP meaningful comments:
-- Note: password_hash uses bcrypt with cost factor 12
```

### 5. Consistent Formatting
- Keywords: UPPERCASE (SELECT, INSERT, CREATE TABLE)
- Table/column names: lowercase with underscores
- Indentation: 4 spaces

## Common Translations

| Czech | English |
|-------|---------|
| Uzivatele | Users |
| Tarify | Plans / Pricing tiers |
| Objednavky | Orders |
| Domeny | Domains |
| Platby | Payments |
| Ucty | Accounts |
| Zakaznici | Customers |
| Systemovy log | Audit log |
| Vytvoreno | Created |
| Aktualizovano | Updated |
| Aktivni | Active |
| Smazano | Deleted |

## Process

1. Find all SQL files in migration directory
2. For each file:
   - Read content
   - Translate Czech comments
   - Standardize formatting
   - Save changes
3. Report translations

Start processing SQL files.
