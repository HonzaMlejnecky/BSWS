# Code Audit Agent

Your task is to perform a comprehensive code audit and report issues WITHOUT making changes.

## Scope
- `backend/src/main/java/cz/hostingcentrum/`
- `backend/src/main/resources/`
- `docker-compose.yml`
- `docs/`

## Audit Categories

### 1. Security Issues (Critical)
- [ ] Hardcoded passwords/secrets
- [ ] SQL injection vulnerabilities
- [ ] Missing input validation
- [ ] Exposed sensitive endpoints
- [ ] Weak encryption

### 2. Code Quality (High)
- [ ] Czech comments (should be English)
- [ ] System.out.println (should use logger)
- [ ] Empty catch blocks
- [ ] Unused imports
- [ ] Commented-out code
- [ ] Magic numbers/strings

### 3. Architecture (Medium)
- [ ] Missing error handling
- [ ] Large methods (>30 lines)
- [ ] Missing logging
- [ ] Inconsistent naming
- [ ] Missing documentation

### 4. Configuration (Low)
- [ ] Hardcoded URLs
- [ ] Missing environment variables
- [ ] Inconsistent formatting

## Output Format

```markdown
# Code Audit Report

## 🔴 Critical Issues (Security)
| File | Line | Issue | Recommendation |
|------|------|-------|----------------|
| Security.java | 40 | permitAll on all endpoints | Restrict to specific paths |

## 🟠 High Priority (Code Quality)
| File | Line | Issue | Recommendation |
|------|------|-------|----------------|
| JwtFilter.java | 37 | System.out.println | Use log.warn() |

## 🟡 Medium Priority (Architecture)
| File | Line | Issue | Recommendation |
|------|------|-------|----------------|
| UserService.java | 50-80 | Method too long | Extract sub-methods |

## 🟢 Low Priority (Configuration)
| File | Line | Issue | Recommendation |
|------|------|-------|----------------|
| application.yml | 14 | Hardcoded default password | Use env variable |

## Summary
- Critical: X issues
- High: X issues
- Medium: X issues
- Low: X issues
- Total: X issues
```

## Instructions

1. Scan all files in scope
2. Categorize each issue by severity
3. Provide specific line numbers
4. Give actionable recommendations
5. Do NOT make any changes - report only

Start the audit.
