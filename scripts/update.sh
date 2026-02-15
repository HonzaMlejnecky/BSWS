#!/bin/bash
# ==============================================================================
# BSWS - Aktualizace projektu
#
# Pouziti: ./scripts/update.sh
#
# Co to udela:
#   1. Pullne nejnovejsi zmeny z gitu
#   2. Detekuje co se zmenilo
#   3. Spusti spravne prikazy (rebuild, restart, reset DB...)
# cool featura, snad to bude fungovat, pripadne si to proste resetnete rucne.
# ==============================================================================

set -e  # Ukonci pri chybe

# Barvy pro vystup
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   BSWS - Aktualizace projektu${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Prejdi do root slozky projektu
cd "$(dirname "$0")/.."

# 1. Uloz hash pred pullem
OLD_HASH=$(git rev-parse HEAD 2>/dev/null || echo "none")

# 2. Pull zmeny
echo -e "${YELLOW}>>> Stahuji zmeny z gitu...${NC}"
git pull origin main

# 3. Novy hash
NEW_HASH=$(git rev-parse HEAD)

# Pokud se nic nezmenilo
if [ "$OLD_HASH" == "$NEW_HASH" ]; then
    echo -e "${GREEN}✓ Zadne nove zmeny.${NC}"
    echo ""
    echo -e "${YELLOW}>>> Spoustim kontejnery (pokud nebezi)...${NC}"
    docker compose up -d
    echo ""
    echo -e "${GREEN}✓ Hotovo!${NC}"
    exit 0
fi

# 4. Zjisti co se zmenilo
echo -e "${YELLOW}>>> Analyzuji zmeny...${NC}"
CHANGED_FILES=$(git diff --name-only $OLD_HASH $NEW_HASH)

DB_CHANGED=false
BACKEND_CHANGED=false
WEB_CHANGED=false
COMPOSE_CHANGED=false
FRONTEND_CHANGED=false

for file in $CHANGED_FILES; do
    case $file in
        db/*) DB_CHANGED=true ;;
        backend/*) BACKEND_CHANGED=true ;;
        web/*) WEB_CHANGED=true ;;
        docker-compose.yml|.env.example) COMPOSE_CHANGED=true ;;
        frontend/*) FRONTEND_CHANGED=true ;;
    esac
done

echo "Zmenene soubory:"
echo "$CHANGED_FILES" | head -10
echo ""

# 5. Proved potrebne akce
if [ "$DB_CHANGED" = true ] || [ "$COMPOSE_CHANGED" = true ]; then
    echo -e "${RED}>>> Zmeny v databazi/compose - RESET databaze...${NC}"
    docker compose down -v
    docker compose up -d --build
elif [ "$BACKEND_CHANGED" = true ]; then
    echo -e "${YELLOW}>>> Zmeny v backendu - rebuild...${NC}"
    docker compose up -d --build backend
    # Restart web az bude backend healthy
    sleep 5
    docker compose restart web
elif [ "$WEB_CHANGED" = true ]; then
    echo -e "${YELLOW}>>> Zmeny v Apache - restart...${NC}"
    docker compose restart web
else
    echo -e "${YELLOW}>>> Spoustim kontejnery...${NC}"
    docker compose up -d
fi

# 6. Frontend
if [ "$FRONTEND_CHANGED" = true ]; then
    echo -e "${YELLOW}>>> Zmeny ve frontendu${NC}"
    if [ -f "frontend/package.json" ]; then
        echo "Spoustim npm install..."
        cd frontend && npm install && cd ..
        echo -e "${BLUE}Pro spusteni frontendu: cd frontend && npm run dev${NC}"
    fi
fi

# 7. Pockej a over
echo ""
echo -e "${YELLOW}>>> Cekam na spusteni kontejneru...${NC}"
sleep 10

# 8. Zkontroluj stav
echo ""
echo -e "${BLUE}>>> Stav kontejneru:${NC}"
docker compose ps

# 9. Test
echo ""
echo -e "${YELLOW}>>> Testuji dostupnost...${NC}"
if curl -s http://localhost:8080/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend OK (http://localhost:8080)${NC}"
else
    echo -e "${RED}✗ Backend nedostupny${NC}"
fi

if curl -s http://localhost/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Web OK (http://localhost)${NC}"
else
    echo -e "${RED}✗ Web nedostupny${NC}"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Aktualizace dokoncena!${NC}"
echo -e "${GREEN}========================================${NC}"
