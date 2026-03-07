@echo off
echo Spoustim hostingove centrum 

IF NOT EXIST .env (
    echo ^> Vytvarim .env z .env.example...
    copy .env.example .env
)

echo ^> Spoustim kontejnery...
docker-compose down -v
docker-compose up -d --build

echo.
echo ^> Hotovo!
pause