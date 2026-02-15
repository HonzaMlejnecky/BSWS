# Mail Server

**Zodpovednost:** TYM MAIL

Viz `docs/UKOLY-MAIL.md` pro detailni zadani.

## Reseni

**Mailpit** - testovaci SMTP server, zachytava vsechny emaily a zobrazi je ve webovem rozhrani.

- Webove rozhrani: http://localhost:8025
- SMTP port: 1025

## Spusteni

1. Odkomentuj sekci `mail` v `docker-compose.yml`
2. `docker-compose up -d`
3. Otevri http://localhost:8025

## Napojeni na backend

Backend posila emaily na `mail:1025` (hostname kontejneru).
Konfigurace je v `backend/src/main/resources/application.yml`.
