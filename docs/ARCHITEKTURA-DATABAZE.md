# Architektura databáze - Hosting Centrum BSWS

Tento dokument vysvětluje, jak funguje databázová vrstva v projektu.

## Základní princip

Máme **jednu MariaDB instanci** (jeden Docker kontejner `hc-db`), která obsahuje **více databází**:

```
┌─────────────────────────────────────────────────────────┐
│                    MariaDB Server                       │
│                    (kontejner hc-db)                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌─────────────────────┐    ┌─────────────────────┐   │
│   │  hosting_platform   │    │    cust_novak       │   │
│   │   (systémová DB)    │    │   (zákaznická DB)   │   │
│   ├─────────────────────┤    ├─────────────────────┤   │
│   │ users               │    │ (cokoliv zákazník   │   │
│   │ orders              │    │  potřebuje -        │   │
│   │ ftp_accounts        │    │  WordPress tabulky, │   │
│   │ domains             │    │  eshop, ...)        │   │
│   │ customer_databases  │    │                     │   │
│   │ ...                 │    │                     │   │
│   └─────────────────────┘    └─────────────────────┘   │
│                                                         │
│                              ┌─────────────────────┐   │
│                              │    cust_svoboda     │   │
│                              │   (další zákazník)  │   │
│                              └─────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Dva typy databází

### 1. Platformová databáze (`hosting_platform`)

Spravuje celý hosting - uživatele, objednávky, služby.

**Kdo ji používá:** Spring Boot backend (přes `platform_user`)

```
hosting_platform
│
├── UŽIVATELÉ A AUTENTIZACE
│   └── users                 # Zákazníci a admini
│
├── PRODUKTY A OBJEDNÁVKY
│   ├── hosting_plans         # Tarify (Basic, Premium, Business)
│   ├── orders                # Objednávky hostingu
│   └── payments              # Platby (simulace)
│
├── SLUŽBY ZÁKAZNÍKŮ
│   ├── domains               # Domény zákazníků
│   ├── customer_databases    # Metadata o zákaznických DB
│   ├── ftp_accounts          # FTP účty (Pure-FTPd čte odsud!)
│   └── email_accounts        # Emailové schránky
│
└── SYSTÉM
    └── audit_logs            # Logy akcí
```

### 2. Zákaznické databáze (`cust_{username}`)

Tyto DB jsou **prázdné** při vytvoření - zákazník si do nich nahraje co potřebuje.

**Kdo ji používá:** Zákazník (přes vlastní `cust_*` účet)

```
cust_novak                    # Příklad: WordPress
├── wp_posts
├── wp_users
├── wp_options
└── ...

cust_svoboda                  # Příklad: E-shop
├── products
├── categories
├── orders
└── ...
```

**Princip:** Hosting platforma neví a neřeší, co si zákazník do DB dá. Jen:
- Vytvoří prázdnou DB
- Dá zákazníkovi přístupy
- Monitoruje velikost (kvůli limitům tarifu)

## Dva typy uživatelů v MariaDB

| Uživatel | Účel | Přístup |
|----------|------|---------|
| `platform_user` | Backend aplikace | Pouze `hosting_platform` |
| `root` | Vytváření zákaznických DB | Všechno |
| `cust_{username}` | Zákazník | Pouze vlastní `cust_*` DB |

## Jak to funguje v praxi

```
1. Zákazník se registruje
   └─► Backend zapíše do hosting_platform.users

2. Zákazník si objedná hosting s databází
   └─► Backend (jako root) provede:
       CREATE DATABASE cust_novak;
       CREATE USER 'cust_novak'@'%' IDENTIFIED BY 'heslo123';
       GRANT ALL ON cust_novak.* TO 'cust_novak'@'%';
   └─► Záznam o DB se uloží do hosting_platform.customer_databases

3. Zákazník dostane přístupy
   └─► Host: db (nebo localhost:3307 zvenku)
       DB: cust_novak
       User: cust_novak
       Pass: heslo123

4. Zákazník nahraje WordPress přes FTP
   └─► WordPress se připojí do cust_novak a vytvoří si tabulky
```

## Konfigurace v docker-compose.yml

```yaml
db:
  image: mariadb:11
  environment:
    # Root pro vytváření zákaznických DB
    MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD:-rootpass123}

    # Platformová DB - vytvoří se automaticky při startu
    MYSQL_DATABASE: ${DB_NAME:-hosting_platform}
    MYSQL_USER: ${DB_USER:-platform_user}
    MYSQL_PASSWORD: ${DB_PASSWORD:-platformpass123}
  volumes:
    # Data zůstávají i po restartu
    - db_data:/var/lib/mysql
    # Init skripty - spustí se při prvním startu
    - ./db/init:/docker-entrypoint-initdb.d:ro
```

## ER Diagram (vztahy mezi tabulkami)

```
┌─────────────────────────────────────────────────────────────────┐
│                      hosting_platform                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   users ─────┬────────► orders ◄──────── hosting_plans         │
│              │             │                                    │
│              │             ├──────────► domains                 │
│              │             │                                    │
│              │             ├──────────► customer_databases ─────┼──► cust_*
│              │             │                                    │
│              │             ├──────────► ftp_accounts            │
│              │             │                                    │
│              │             └──────────► email_accounts          │
│              │                                                  │
│              └────────────────────────► payments                │
│                                                                 │
│   audit_logs (loguje všechny akce)                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Proč tento přístup?

| Výhoda | Vysvětlení |
|--------|------------|
| **Izolace** | Zákazník vidí jen svou DB, nemůže do platformové ani k jinému zákazníkovi |
| **Jednoduchost** | Jedna MariaDB instance = jednodušší správa, zálohování, monitoring |
| **Realismus** | Takhle to dělají skuteční hosting provideři (např. Wedos, Forpsi) |
| **Flexibilita** | Zákazník může mít cokoliv - WordPress, vlastní aplikaci, eshop |

## Shrnutí pro jednotlivé týmy

| Tým | Co potřebuje vědět |
|-----|-------------------|
| **Backend** | Připojuje se jako `platform_user`, pro vytváření zákaznických DB používá root credentials |
| **Databáze** | Spravuje schéma v `db/init/`, vytváří seed data |
| **FTP** | Pure-FTPd čte uživatele přímo z `ftp_accounts` tabulky |
| **Frontend** | Zobrazuje data z API, neřeší DB přímo |

## Další dokumentace

- **Detailní schéma tabulek:** [UKOLY-DATABAZE.md](UKOLY-DATABAZE.md)
- **Init skripty:** `db/init/01-schema.sql`
