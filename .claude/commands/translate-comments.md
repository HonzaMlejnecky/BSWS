# Translate Comments Agent

Your task is to find and translate all Czech comments to English in the codebase.

## Scope
- Directory: `backend/src/main/java/cz/hostingcentrum/`
- File types: `*.java`

## Rules
1. Translate Czech comments to clear, concise English
2. Keep technical terms in their original form
3. Preserve comment formatting (single-line `//`, multi-line `/* */`, Javadoc `/** */`)
4. Do NOT translate:
   - String literals (user-facing messages can stay in Czech)
   - Variable/method names
   - Log messages (these can be translated optionally)

## Common Translations

| Czech | English |
|-------|---------|
| Toto je | This is |
| Vytvoreni | Creation / Create |
| Smazani | Deletion / Delete |
| Uprava | Update / Edit |
| Uzivatel | User |
| Heslo | Password |
| Prihlaseni | Login |
| Odhlaseni | Logout |
| Registrace | Registration |
| Overeni | Verification |
| Databaze | Database |
| Konfigurace | Configuration |
| Nastaveni | Settings |
| Chyba | Error |
| Vstupni bod | Entry point |
| Hlavni trida | Main class |

## Process

1. Find all Java files with Czech comments (use grep for Czech characters: ěščřžýáíéůúťďň)
2. For each file:
   - Read the file
   - Identify Czech comments
   - Translate them
   - Save the file
3. Report changes

## Output

```
📄 FileName.java
  Line 15: "// Toto je uzivatel" → "// User entity"
  Line 42: "// Overeni emailu" → "// Email verification"
```

Start by scanning for files with Czech characters in comments.
