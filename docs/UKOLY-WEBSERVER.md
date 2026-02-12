# Ukoly: Webserver (Apache)

**Slozka:** `web/`
**Zodpovednost:** 1 osoba

## Co uz je pripraveno

- Apache 2.4 kontejner v `docker-compose.yml`
- `httpd.conf` - hlavni konfigurace s moduly
- `vhosts.conf` - reverse proxy na Spring Boot + 3 testovaci VirtualHosty

## Struktura slozky

```
web/
└── apache-config/
    ├── httpd.conf          ← Hlavni konfigurace
    └── vhosts.conf         ← VirtualHosty
```

## Architektura

```
                            +------------------+
                            |     Apache       |
                            |     (:80)        |
                            +--------+---------+
                                     |
            +------------------------+------------------------+
            |                        |                        |
            v                        v                        v
    +---------------+       +----------------+       +----------------+
    | localhost     |       | mojefirma.cz   |       | druhafirma.cz  |
    | → proxy →     |       | → static →     |       | → static →     |
    | Spring Boot   |       | /customers/2/  |       | /customers/3/  |
    +---------------+       +----------------+       +----------------+
```

## Ukoly

### 1. Reverse Proxy (uz hotovo)

Pozadavky na `localhost` jdou na Spring Boot:

```apache
<VirtualHost *:80>
    ServerName localhost
    ProxyPreserveHost On
    ProxyPass / http://backend:8080/
    ProxyPassReverse / http://backend:8080/
</VirtualHost>
```

### 2. VirtualHosty pro zakaznicke weby

Kazdy zakaznik ma svou domenu → servuje se z jeho slozky:

```apache
<VirtualHost *:80>
    ServerName www.mojefirma.cz
    ServerAlias mojefirma.cz

    DocumentRoot /srv/customers/user_2/www

    <Directory /srv/customers/user_2/www>
        Options Indexes FollowSymLinks
        AllowOverride All          # Povoli .htaccess
        Require all granted
    </Directory>

    ErrorLog /proc/self/fd/2
    CustomLog /proc/self/fd/1 combined
</VirtualHost>
```

**Ukoly:**
- [ ] Overit, ze testovaci VirtualHosty funguji
- [ ] Pridat dalsi testovaci domeny (min. 3 celkem)
- [ ] Dokumentovat, jak pridat novou domenu

### 3. Bezpecnostni hlavicky

Pridej do kazdeho VirtualHostu:

```apache
<IfModule headers_module>
    # Zabranuje MIME sniffingu
    Header always set X-Content-Type-Options "nosniff"

    # Zabranuje clickjackingu
    Header always set X-Frame-Options "SAMEORIGIN"

    # XSS ochrana
    Header always set X-XSS-Protection "1; mode=block"

    # Referrer policy
    Header always set Referrer-Policy "strict-origin-when-cross-origin"

    # Content Security Policy (upravit podle potreby)
    # Header always set Content-Security-Policy "default-src 'self'"
</IfModule>
```

### 4. Gzip komprese (volitelne)

```apache
<IfModule deflate_module>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml
    AddOutputFilterByType DEFLATE text/css application/javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>
```

### 5. PHP podpora (volitelne)

Pokud zakaznici budou hostovat WordPress, potrebuji PHP:

**Moznost A:** Pridat PHP modul do Apache
**Moznost B:** PHP-FPM jako separatni kontejner

```yaml
# docker-compose.yml - pridat PHP-FPM
php:
  image: php:8.2-fpm
  container_name: hc-php
  volumes:
    - ./customers:/srv/customers
  networks:
    - hosting-net
```

Apache konfigurace pro PHP-FPM:
```apache
<FilesMatch \.php$>
    SetHandler "proxy:fcgi://php:9000"
</FilesMatch>
```

### 6. SSL/TLS (volitelne)

Pro vyvoj neni potreba. Pro produkci:

```apache
LoadModule ssl_module modules/mod_ssl.so

<VirtualHost *:443>
    ServerName www.mojefirma.cz

    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/mojefirma.crt
    SSLCertificateKeyFile /etc/ssl/private/mojefirma.key

    # ... zbytek konfigurace
</VirtualHost>
```

## Testovani

### 1. Pridej domeny do /etc/hosts
```
127.0.0.1   localhost
127.0.0.1   www.mojefirma.cz mojefirma.cz
127.0.0.1   www.druhafirma.cz druhafirma.cz
127.0.0.1   www.tretifirma.cz tretifirma.cz
```

### 2. Otestuj
```bash
# Restart Apache
docker-compose restart web

# Test reverse proxy
curl http://localhost

# Test zakaznickeho webu
curl http://www.mojefirma.cz

# Test hlavicek
curl -I http://www.mojefirma.cz
```

### 3. Overeni konfigurace
```bash
# Syntax check
docker exec hc-web httpd -t

# Zobrazit nactene moduly
docker exec hc-web httpd -M
```

## Logovani

Logy jdou do stdout/stderr (Docker best practice):
```bash
# Zobrazit logy
docker-compose logs -f web
```

## Checklist

- [ ] Reverse proxy na Spring Boot funguje
- [ ] VirtualHosty pro testovaci domeny funguji
- [ ] Bezpecnostni hlavicky nastaveny
- [ ] .htaccess funguje (AllowOverride All)
- [ ] Logovani funguje
- [ ] Dokumentace jak pridat novou domenu
- [ ] (Volitelne) PHP podpora
- [ ] (Volitelne) SSL/TLS
