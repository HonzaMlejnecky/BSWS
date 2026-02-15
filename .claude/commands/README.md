# Claude Code Commands

Custom slash commands for the BSWS Hosting Centrum project.

## Available Commands

| Command | Description |
|---------|-------------|
| `/clean-code` | Full cleanup - comments, dead code, formatting |
| `/translate-comments` | Translate Czech comments to English |
| `/remove-dead-code` | Remove unused code, imports, commented code |
| `/clean-sql` | Clean SQL migration files |
| `/code-audit` | Audit code without making changes |

## Usage

In Claude Code CLI, type:

```bash
/clean-code
```

Or run specific cleanup:

```bash
/translate-comments
/remove-dead-code
```

## Recommended Order

1. **First run audit** to see all issues:
   ```
   /code-audit
   ```

2. **Then translate comments**:
   ```
   /translate-comments
   ```

3. **Remove dead code**:
   ```
   /remove-dead-code
   ```

4. **Clean SQL files**:
   ```
   /clean-sql
   ```

5. **Or run everything at once**:
   ```
   /clean-code
   ```

## What Gets Changed

### Java Files
- Czech comments → English
- Commented-out code → Removed
- Unused imports → Removed
- System.out.println → SLF4J logger
- Empty catch blocks → Added logging

### SQL Files
- Czech comments → English
- Standardized formatting

### NOT Changed
- String literals (user-facing messages)
- Log messages
- Test files
- Configuration values

## After Running

1. Check the changes:
   ```bash
   git diff
   ```

2. Test the build:
   ```bash
   make backend
   ```

3. Commit if OK:
   ```bash
   git add .
   git commit -m "chore: clean code - translate comments, remove dead code"
   ```
