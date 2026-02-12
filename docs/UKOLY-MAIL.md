# Ukoly: Mail Server

**Slozka:** `mail/`
**Zodpovednost:** 1 osoba (spolecne s FTP)

## Co uz je pripraveno

- Sekce `mail` v `docker-compose.yml` (ZAKOMENTOVANA)
- Konfigurace mailu v `backend/src/main/resources/application.yml`

## Reseni pro vyvoj: Mailpit

**Mailpit** = testovaci SMTP server, ktery:
- Prijima vsechny emaily
- Neuklada je do schranek, ale zobrazuje ve webovem rozhrani
- Zadne emaily neodchazeji ven

**Idealni pro vyvoj a testovani!**

## Ukoly

### 1. Odkomentovat v docker-compose.yml

```yaml
mail:
  image: axllent/mailpit:latest
  container_name: hc-mail
  restart: unless-stopped
  ports:
    - "8025:8025"    # Webove rozhrani
    - "1025:1025"    # SMTP port
  networks:
    - hosting-net
```

### 2. Spustit a otestovat

```bash
# Spustit
docker-compose up -d mail

# Otevrit webove rozhrani
open http://localhost:8025
```

### 3. Napojit na Spring Boot

Backend konfigurace (uz je pripravena v `application.yml`):

```yaml
spring:
  mail:
    host: mail           # Hostname kontejneru
    port: 1025           # Mailpit SMTP port
    username: ""
    password: ""
    properties:
      mail:
        smtp:
          auth: false
          starttls:
            enable: false
```

### 4. Implementovat odesilani emailu (TYM BACKEND)

```java
// backend/src/main/java/cz/upce/bsws/hostingcentrum/service/EmailService.java
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendWelcomeEmail(String to, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@hostingcentrum.cz");
        message.setTo(to);
        message.setSubject("Vitejte v Hostingovem centru!");
        message.setText("Ahoj " + username + ",\n\nVas ucet byl uspesne vytvoren.\n\nHostingove centrum");

        mailSender.send(message);
    }

    public void sendOrderConfirmation(String to, String orderNumber) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@hostingcentrum.cz");
        message.setTo(to);
        message.setSubject("Potvrzeni objednavky " + orderNumber);
        message.setText("Vase objednavka byla prijata.\n\nCislo objednavky: " + orderNumber);

        mailSender.send(message);
    }
}
```

### 5. HTML emaily (volitelne)

Pro hezci emaily pouzij Thymeleaf sablony:

```java
@Autowired
private JavaMailSender mailSender;

@Autowired
private TemplateEngine templateEngine;

public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) {
    Context context = new Context();
    context.setVariables(variables);

    String htmlContent = templateEngine.process(templateName, context);

    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

    helper.setFrom("noreply@hostingcentrum.cz");
    helper.setTo(to);
    helper.setSubject(subject);
    helper.setText(htmlContent, true);

    mailSender.send(message);
}
```

### 6. Testovani

1. Spust `docker-compose up -d mail`
2. Otevri http://localhost:8025
3. Zaregistruj noveho uzivatele v aplikaci
4. Zkontroluj, ze email dorazil do Mailpit

```bash
# Test z prikazove radky
echo "Test email" | mail -s "Test" test@test.cz

# Nebo pres curl
curl -X POST http://localhost:8025/api/v1/send \
  -H "Content-Type: application/json" \
  -d '{"from":"test@test.cz","to":["user@example.com"],"subject":"Test","text":"Hello"}'
```

## Volitelne: Postfix (realny mail server)

Pro produkci nebo pokrocilejsi testovani:

```yaml
mail:
  image: boky/postfix
  container_name: hc-mail
  environment:
    ALLOWED_SENDER_DOMAINS: hostingcentrum.cz
  ports:
    - "25:25"
  networks:
    - hosting-net
```

**POZOR:** Realny mail server vyzaduje:
- Spravne DNS zaznamy (MX, SPF, DKIM)
- Reverzni DNS
- IP adresu, ktera neni na blacklistu

Pro skolni projekt je Mailpit dostacujici.

## Use Cases pro emaily

1. **Registrace** - uvitaci email
2. **Reset hesla** - odkaz pro zmenu hesla
3. **Potvrzeni objednavky** - detail objednavky
4. **Aktivace hostingu** - FTP udaje, pristup k DB
5. **Upominka platby** - blizi se konec obdobi
6. **Zmena stavu objednavky** - aktivovano, pozastaveno, ...

## Checklist

- [ ] Odkomentovat mail v docker-compose.yml
- [ ] Overit, ze Mailpit bezi (http://localhost:8025)
- [ ] Implementovat EmailService v backendu
- [ ] Odeslat testovaci email
- [ ] Overit, ze email dorazil do Mailpit
- [ ] Implementovat uvitaci email po registraci
- [ ] Implementovat email po vytvoreni objednavky
- [ ] (Volitelne) HTML sablony pro emaily
- [ ] (Volitelne) Reset hesla pres email
