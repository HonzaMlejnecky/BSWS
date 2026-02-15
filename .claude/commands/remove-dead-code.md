# Remove Dead Code Agent

Your task is to identify and remove dead/unused code from the codebase.

## Scope
- Directory: `backend/src/main/java/cz/hostingcentrum/`
- File types: `*.java`

## What to Remove

### 1. Commented-Out Code
```java
// REMOVE THIS:
// private void oldMethod() {
//     doSomething();
// }

// BUT KEEP THIS (explanation comment):
// Note: This method is called asynchronously
```

### 2. Unused Imports
```java
// REMOVE unused imports like:
import java.util.ArrayList; // if ArrayList is not used in the file
```

### 3. Unused Private Methods
- Private methods that are never called within the class
- Be careful with reflection-based frameworks

### 4. Unused Private Variables
- Private fields that are never read
- Exception: Fields with `@Autowired`, `@Value`, etc.

### 5. Empty Blocks
```java
// REMOVE or fix:
try {
    // ...
} catch (Exception e) {
    // Empty catch - bad practice!
}

// REPLACE WITH:
try {
    // ...
} catch (Exception e) {
    log.error("Error occurred: {}", e.getMessage());
}
```

### 6. Redundant Code
```java
// REMOVE redundant null checks after initialization:
String s = "hello";
if (s != null) { // redundant
    return s;
}

// REMOVE redundant boolean returns:
if (condition) {
    return true;
} else {
    return false;
}
// REPLACE WITH:
return condition;
```

## What NOT to Remove

- Public API methods (even if unused internally)
- Methods with `@Override`, `@Bean`, `@PostConstruct`, etc.
- Methods called via reflection or Spring
- Configuration classes
- DTOs/Entities fields (used by Jackson/Hibernate)

## Process

1. Scan each Java file
2. Identify dead code patterns
3. Remove safely
4. Verify no compilation errors would occur
5. Report changes

## Output

```
📄 FileName.java
  ✗ Removed: Unused import 'java.util.HashMap' (line 5)
  ✗ Removed: Commented-out method 'oldMethod' (lines 45-52)
  ✗ Removed: Unused private field 'tempValue' (line 12)
  ⚠ Fixed: Empty catch block - added logging (line 78)
```

Start scanning the codebase for dead code patterns.
