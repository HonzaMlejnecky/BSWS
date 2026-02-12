# FTP Server

**Zodpovednost:** TYM FTP

Viz `docs/UKOLY-FTP.md` pro detailni zadani.

## Doporucene reseni

**Pure-FTPd s MySQL autentizaci** - uzivatele se autentizuji primo z databaze.

## Soubory k vytvoreni

- `pureftpd-mysql.conf` - konfigurace MySQL autentizace
- Pripadne dalsi konfiguracni soubory

## Spusteni

1. Odkomentuj sekci `ftp` v `docker-compose.yml`
2. `docker-compose up -d --build`
3. Test: `ftp localhost` nebo FileZilla
