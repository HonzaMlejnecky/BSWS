# Ukoly: Backend (Spring Boot)

**Slozka:** `backend/`
**Zodpovednost:** 2 osoby

## Co uz je pripraveno

- Spring Boot 3.2 projekt s Maven
- Dockerfile (multi-stage build)
- Zakladni konfigurace (`application.yml`)
- Docasna Security konfigurace (vse povoleno)
- Ukazkovy HomeController

## Struktura balicku

```
src/main/java/cz/upce/bsws/hostingcentrum/
├── HostingCentrumApplication.java   ← Vstupni bod
├── config/                          ← Konfigurace (Security, CORS, ...)
│   └── SecurityConfig.java
├── controller/                      ← REST API endpointy
│   └── HomeController.java
├── service/                         ← Business logika
├── repository/                      ← JPA repozitare
├── model/                           ← Entity a DTO
│   ├── entity/                      ← JPA entity
│   └── dto/                         ← Data Transfer Objects
└── exception/                       ← Custom vyjimky
```

## Ukoly

### 1. Entity (JPA)

Vytvorte entity podle databazoveho schematu:

```java
// Priklad entity
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    // ...
}
```

**Seznam entit:**
- [ ] `User` - uzivatele
- [ ] `HostingPlan` - tarify
- [ ] `Order` - objednavky
- [ ] `Domain` - domeny
- [ ] `FtpAccount` - FTP ucty
- [ ] `CustomerDatabase` - zakaznicke DB
- [ ] `EmailAccount` - emailove schranky
- [ ] `Payment` - platby
- [ ] `AuditLog` - audit log

### 2. Autentizace & Autorizace

- [ ] Implementovat registraci (`POST /api/auth/register`)
- [ ] Implementovat login (`POST /api/auth/login`)
- [ ] Implementovat logout (`POST /api/auth/logout`)
- [ ] JWT tokeny nebo Spring Session
- [ ] Role: `CUSTOMER`, `ADMIN`
- [ ] Chranene endpointy (`@PreAuthorize`)

### 3. API Endpointy

**Autentizace:**
```
POST   /api/auth/register     - Registrace
POST   /api/auth/login        - Prihlaseni
POST   /api/auth/logout       - Odhlaseni
GET    /api/auth/me           - Aktualni uzivatel
POST   /api/auth/password     - Zmena hesla
```

**Uzivatele (admin):**
```
GET    /api/users             - Seznam uzivatelu
GET    /api/users/{id}        - Detail uzivatele
PUT    /api/users/{id}        - Uprava uzivatele
DELETE /api/users/{id}        - Smazani uzivatele
```

**Hostingove plany:**
```
GET    /api/plans             - Seznam planu
GET    /api/plans/{id}        - Detail planu
POST   /api/plans             - Vytvorit plan (admin)
PUT    /api/plans/{id}        - Upravit plan (admin)
```

**Objednavky:**
```
GET    /api/orders            - Moje objednavky
POST   /api/orders            - Vytvorit objednavku
GET    /api/orders/{id}       - Detail objednavky
POST   /api/orders/{id}/pay   - Simulace platby
```

**Domeny:**
```
GET    /api/domains           - Moje domeny
POST   /api/domains           - Pridat domenu
DELETE /api/domains/{id}      - Odebrat domenu
```

**FTP ucty:**
```
GET    /api/ftp-accounts      - Moje FTP ucty
POST   /api/ftp-accounts      - Vytvorit FTP ucet
```

**Databaze:**
```
GET    /api/databases         - Moje databaze
POST   /api/databases         - Vytvorit databazi
```

### 4. Vytvareni zakaznickych databazi

Kdyz zakaznik aktivuje hosting, backend musi:

```java
// Priklad vytvoreni zakaznicke DB
@Service
public class CustomerDatabaseService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void createCustomerDatabase(Long userId, String dbName) {
        String dbUser = "cust_" + userId + "_user";
        String dbPass = generateRandomPassword();

        // Vytvor databazi
        jdbcTemplate.execute("CREATE DATABASE " + dbName);

        // Vytvor uzivatele
        jdbcTemplate.execute("CREATE USER '" + dbUser + "'@'%' IDENTIFIED BY '" + dbPass + "'");

        // Pridelej prava
        jdbcTemplate.execute("GRANT ALL PRIVILEGES ON " + dbName + ".* TO '" + dbUser + "'@'%'");

        // Uloz do platformove DB
        // ...
    }
}
```

### 5. Vytvareni FTP uctu

FTP ucty se ukladaji do tabulky `ftp_accounts`. Pure-FTPd cte uzivatele primo z teto tabulky.

```java
// Heslo musi byt MD5 hash pro Pure-FTPd
String passwordHash = DigestUtils.md5Hex(plainPassword);

FtpAccount account = new FtpAccount();
account.setFtpUsername("user_" + userId);
account.setFtpPassword(passwordHash);
account.setHomeDir("/srv/customers/user_" + userId);
ftpAccountRepository.save(account);
```

**DULEZITE:** Vytvor take slozku na disku:
```java
Files.createDirectories(Paths.get("/srv/customers/user_" + userId + "/www"));
```

### 6. Validace

- [ ] `@Valid` na vsech vstupnich DTO
- [ ] Custom validatory (unikatni email, silne heslo, ...)
- [ ] Globalni exception handler (`@ControllerAdvice`)

### 7. Bezpecnost

- [ ] Hesla ukladat jako bcrypt hash
- [ ] Parametrizovane SQL dotazy (prevence SQL injection)
- [ ] Rate limiting na login (prevence brute force)
- [ ] CORS konfigurace pro frontend

## Testovani

```bash
# Spustit backend
docker-compose up -d --build

# Test API
curl http://localhost:8080/
curl http://localhost:8080/api/status

# Registrace
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.cz","password":"Test1234","username":"testuser"}'
```

## Uzitecne links

- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Security](https://docs.spring.io/spring-security/reference/)
- [Spring Data JPA](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
