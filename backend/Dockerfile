# ==================================================================
# BACKEND Dockerfile - HOSTING CENTRUM
# ==================================================================

# --- BUILD STAGE ---
# Používáme BuildKit cache pro Maven
# Spustit build s DOCKER_BUILDKIT=1 docker build ...
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# --- Maven dependencies cache ---
# Tento mount umožní BuildKit cachovat všechny závislosti mezi buildu
RUN --mount=type=cache,target=/root/.m2 \
    echo "Maven cache připravena"

# --- Zkopíruj POM a stáhni dependencies ---
COPY pom.xml ./
RUN --mount=type=cache,target=/root/.m2 mvn dependency:go-offline -B

# --- Zkopíruj zdrojový kód a buildni aplikaci ---
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn clean package -DskipTests -B

# --- RUNTIME STAGE ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# --- Root only pro instalaci curl ---
USER root
RUN apk add --no-cache curl

# --- Vytvoření non-root uživatele ---
RUN addgroup -g 1000 appgroup && \
    adduser -u 1000 -G appgroup -D appuser

# --- Kopírování JAR z build stage ---
COPY --from=build /app/target/*.jar app.jar

# --- Nastavení vlastníka a přepnutí na non-root ---
RUN chown -R appuser:appgroup /app
USER appuser

# --- Healthcheck ---
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# --- Port a entrypoint ---
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
