# Prace s databazi - Kompletni prirucka

Tento dokument popisuje jak pracovat s databazi v projektu Hosting Centrum.

---

## Zakladni info

| Polozka | Hodnota |
|---------|---------|
| Databaze | MariaDB 11 |
| Migrace | Flyway |
| Systemova DB | `hosting_platform` |
| Uzivatel | `platform_user` / `platformpass123` |
| Root | `root` / `rootpass123` |
| Port (externi) | 3307 |

---

## Jak funguje Flyway

```
Spring Boot startuje
        |
        v
Flyway nacte tabulku flyway_schema_history
        |
        v
Porovna s db/migration/*.sql soubory
        |
        v
Aplikuje POUZE nove migrace (inkrementalne)
        |
        v
Zapise do flyway_schema_history
```

**DULEZITE:** Data se NEztraci pri restartu! Flyway aplikuje pouze nove migrace.

---

## Pripojeni k databazi

### Prikazova radka
```bash
docker exec -it hc-db mariadb -u platform_user -pplatformpass123 hosting_platform
```

### GUI nastroje
- **phpMyAdmin**: http://localhost:8081
- **DBeaver/TablePlus**: localhost:3307, platform_user, platformpass123

### Uzitecne prikazy
```sql
-- Vsechny tabulky
SHOW TABLES;

-- Struktura tabulky
DESCRIBE users;
SHOW CREATE TABLE users;

-- Flyway historie
SELECT version, description, success, installed_on
FROM flyway_schema_history
ORDER BY installed_rank;
```

---

## Jak vytvorit novou migraci

### Krok 1: Zjisti aktualni verzi

```bash
docker exec -it hc-db mariadb -u platform_user -pplatformpass123 hosting_platform \
  -e "SELECT MAX(version) as posledni_verze FROM flyway_schema_history;"
```

### Krok 2: Vytvor soubor

```bash
# Pokud posledni je V2, vytvor V3
touch backend/src/main/resources/db/migration/V3__popis_zmeny.sql
```

### Pravidla pojmenovani

```
V{cislo}__{popis}.sql
    |     |
    |     +-- DVE podtrzitka!
    +-- Cislo vyssi nez predchozi

SPRAVNE:
  V3__add_user_phone.sql
  V4__create_invoices_table.sql
  V10__add_index_on_orders.sql

SPATNE:
  V3_jedna_podtrzitko.sql    # Chybi jedno podtrzitko
  V2__uz_existuje.sql        # V2 uz je v DB
  v3__male_v.sql             # Male pismeno
  3__bez_v.sql               # Chybi V
```

### Krok 3: Napis SQL

```sql
-- V3__add_user_phone.sql
-- Popis: Pridava telefonni cislo k uzivatelum

ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

### Krok 4: Otestuj lokalne

```bash
# Restart backendu
docker compose restart backend

# Over v logu
docker compose logs backend | grep -i flyway

# Ocekavany vystup:
# Successfully applied 1 migration to schema `hosting_platform`
```

### Krok 5: Over vysledek

```bash
docker exec -it hc-db mariadb -u platform_user -pplatformpass123 hosting_platform \
  -e "DESCRIBE users;"
```

### Krok 6: Commit a push

```bash
git add backend/src/main/resources/db/migration/V3__add_user_phone.sql
git commit -m "feat(db): add phone column to users"
git push
```

---

## Co delat pri git pull

### Bezny scenar: Kolega pridal migraci

```bash
git pull                           # Stahnes nove migrace
docker compose up -d --build       # Flyway aplikuje nove migrace
# Hotovo! Tvoje data zustala, nove zmeny se aplikovaly
```

### Kdyz se nic nezmenilo v migracich

```bash
git pull
docker compose up -d --build       # Flyway nic neudela, vse OK
```

---

## Reseni problemu

### Problem 1: Syntax error v migraci

**Priznak:**
```
Flyway: Migration V3__xxx.sql failed
Caused by: SQL syntax error
```

**Reseni:**
```bash
# 1. Oprav SQL soubor
nano backend/src/main/resources/db/migration/V3__xxx.sql

# 2. Restart (Flyway zkusi znovu)
docker compose restart backend
```

### Problem 2: Migrace prosla, ale je spatne

**Priklad:** Omylem smazany sloupec

**Reseni - NIKDY neupravuj existujici migraci!**
```bash
# Vytvor novou migraci, ktera opravi chybu
cat > backend/src/main/resources/db/migration/V4__fix_v3_mistake.sql << 'EOF'
-- Oprava: Vracim smazany sloupec
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
EOF

docker compose restart backend
```

### Problem 3: Checksum mismatch

**Priznak:**
```
Flyway: Checksum mismatch for migration V2
```

**Pricina:** Nekdo upravil uz aplikovanou migraci

**Reseni A - Opravit checksum (pokud zmena byla OK):**
```bash
docker exec -it hc-db mariadb -u platform_user -pplatformpass123 hosting_platform -e "
DELETE FROM flyway_schema_history WHERE version = '2';
"
docker compose restart backend
```

**Reseni B - Uplny reset (ztrata dat!):**
```bash
docker compose down -v
docker compose up -d --build
```

### Problem 4: Konflikt verzi (dva lide vytvorili V3)

**Priznak:** Po git pull mas dva soubory V3__*.sql

**Reseni:**
```bash
# Prejmenuj svuj na V4
mv backend/src/main/resources/db/migration/V3__moje_zmena.sql \
   backend/src/main/resources/db/migration/V4__moje_zmena.sql

git add .
git commit -m "fix: rename migration to V4"
```

### Problem 5: Potrebuji kompletni reset

```bash
# POZOR: Smaze VSECHNA data!
docker compose down -v
docker compose up -d --build
# Flyway spusti V1, V2, V3... od zacatku
```

---

## Backup a restore

### Vytvorit backup

```bash
# Pred rizikovou zmenou VZDY udelej backup!
docker exec hc-db mariadb-dump -u root -prootpass123 hosting_platform > backup_$(date +%Y%m%d_%H%M%S).sql

# Overit velikost
ls -lh backup_*.sql
```

### Obnovit z backupu

```bash
# 1. Smazat aktualni data
docker exec -it hc-db mariadb -u root -prootpass123 -e "DROP DATABASE hosting_platform; CREATE DATABASE hosting_platform;"

# 2. Nahrat backup
docker exec -i hc-db mariadb -u root -prootpass123 hosting_platform < backup_20240215_143000.sql

# 3. Restart backendu
docker compose restart backend
```

---

## Best practices

### 1. Pred KAZDOU migraci

```bash
# Udelej backup
docker exec hc-db mariadb-dump -u root -prootpass123 hosting_platform > backup_pred_V3.sql
```

### 2. Testuj lokalne pred pushem

```bash
# Restart a over logy
docker compose restart backend
docker compose logs backend | grep -i -E "(flyway|error|exception)"

# Zkontroluj vysledek
docker exec -it hc-db mariadb -u platform_user -pplatformpass123 hosting_platform \
  -e "SELECT version, description, success FROM flyway_schema_history ORDER BY installed_rank;"
```

### 3. Pis zpetne kompatibilni migrace

```sql
-- SPATNE: Smaze sloupec, ktery mozna jeste kod pouziva
ALTER TABLE users DROP COLUMN old_field;

-- LEPE: Nejdriv updatuj kod, pak az v dalsi migraci smaz
-- V3: Pridej novy sloupec
-- V4: Kod uz pouziva novy sloupec
-- V5: Smaz stary sloupec
```

### 4. Velke zmeny rozdeluj

```sql
-- SPATNE: Vse v jedne migraci
ALTER TABLE users ADD COLUMN a, ADD COLUMN b, ADD COLUMN c;
CREATE TABLE nova_tabulka (...);
INSERT INTO nova_tabulka SELECT ...;

-- LEPE: Rozdelit do vice migraci
-- V3__add_columns_to_users.sql
-- V4__create_nova_tabulka.sql
-- V5__migrate_data_to_nova_tabulka.sql
```

### 5. Komentuj slozite migrace

```sql
-- V7__reorganize_orders.sql
--
-- POZOR: Tato migrace:
-- 1. Pridava sloupec status_new
-- 2. Kopiruje data ze status do status_new
-- 3. Maze stary sloupec status
-- 4. Prejmenovava status_new na status
--
-- Doba behu: ~2 minuty na produkci
-- Rollback: V8__undo_reorganize_orders.sql

ALTER TABLE orders ADD COLUMN status_new VARCHAR(50);
UPDATE orders SET status_new = status;
-- ...
```

---

## Prehled prikazu

| Co chci udelat | Prikaz |
|----------------|--------|
| Pripojit k DB | `docker exec -it hc-db mariadb -u platform_user -pplatformpass123 hosting_platform` |
| Zobrazit tabulky | `SHOW TABLES;` |
| Struktura tabulky | `DESCRIBE users;` |
| Flyway historie | `SELECT * FROM flyway_schema_history;` |
| Restart + migrace | `docker compose restart backend` |
| Logy Flyway | `docker compose logs backend \| grep -i flyway` |
| Backup | `docker exec hc-db mariadb-dump -u root -prootpass123 hosting_platform > backup.sql` |
| Restore | `docker exec -i hc-db mariadb -u root -prootpass123 hosting_platform < backup.sql` |
| Reset (ztrata dat!) | `docker compose down -v && docker compose up -d --build` |

---

## Struktura flyway_schema_history

```sql
SELECT * FROM flyway_schema_history;

+----------------+---------+------------------+---------+---------------------+
| installed_rank | version | description      | success | installed_on        |
+----------------+---------+------------------+---------+---------------------+
| 1              | 1       | create schema    | 1       | 2024-02-15 10:00:00 |
| 2              | 2       | seed data        | 1       | 2024-02-15 10:00:01 |
+----------------+---------+------------------+---------+---------------------+
```

| Sloupec | Vyznam |
|---------|--------|
| installed_rank | Poradi aplikace |
| version | Cislo migrace (V1, V2...) |
| description | Popis z nazvu souboru |
| success | 1 = OK, 0 = selhala |
| installed_on | Kdy byla aplikovana |
| checksum | Hash souboru (detekce zmen) |

---

## Kontakty

Pokud si nevís rady:
1. Zkontroluj logy: `docker compose logs backend`
2. Podívej se do této dokumentace
3. Zeptej se team leadera
