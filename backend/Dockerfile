# ==============================================================================
# SPRING BOOT BACKEND - Dockerfile
#
# Multi-stage build:
#   1. Build stage: Maven kompilace
#   2. Runtime stage: Pouze JRE + JAR
#
# TYM BACKEND: Upravte podle potreby
# ==============================================================================

# --- BUILD STAGE ---
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Zkopiruj pom.xml a stahni dependencies (cache layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Zkopiruj zdrojaky a buildni
COPY src ./src
RUN mvn clean package -DskipTests -B

# --- RUNTIME STAGE ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Bezpecnost: ne-root user
RUN addgroup -g 1000 appgroup && \
    adduser -u 1000 -G appgroup -D appuser

# Zkopiruj JAR z build stage
COPY --from=build /app/target/*.jar app.jar

# Vlastnik souboru
RUN chown -R appuser:appgroup /app
USER appuser

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]