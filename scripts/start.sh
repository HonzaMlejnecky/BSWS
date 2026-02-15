#!/bin/bash
# ==============================================================================
# BSWS - Prvni spusteni projektu
#
# Pouziti: ./scripts/start.sh
# ==============================================================================

set -e

echo "========================================"
echo "   BSWS - Prvni spusteni"
echo "========================================"
echo ""

cd "$(dirname "$0")/.."

# Zkontroluj Docker
if ! command -v docker &> /dev/null; then
    echo "CHYBA: Docker neni nainstalovany!"
    echo "Stahnete z: https://docs.docker.com/get-docker/"
    exit 1
fi

# Zkontroluj ze Docker bezi
if ! docker info &> /dev/null; then
    echo "CHYBA: Docker nebezi!"
    echo "Spust Docker Desktop a zkus znovu."
    exit 1
fi

# Vytvor .env pokud neexistuje
if [ ! -f .env ]; then
    echo ">>> Vytvarim .env z .env.example..."
    cp .env.example .env
fi

# Spust
echo ">>> Spoustim kontejnery (muze trvat par minut)..."
docker compose up -d --build

# Pockej
echo ">>> Cekam na spusteni..."
sleep 15

# Stav
echo ""
echo ">>> Stav:"
docker compose ps

# Test
echo ""
if curl -s http://localhost:8080/ > /dev/null 2>&1; then
    echo "✓ Backend: http://localhost:8080"
else
    echo "✗ Backend jeste startuje, pockej chvili..."
fi

if curl -s http://localhost/ > /dev/null 2>&1; then
    echo "✓ Web: http://localhost"
else
    echo "✗ Web jeste startuje..."
fi

echo ""
echo "========================================"
echo "   Hotovo! Otevri http://localhost"
echo "========================================"
