# Frontend

**Zodpovednost:** TYM FRONTEND

Viz `docs/UKOLY-FRONTEND.md` pro detailni zadani.

## Technologie (k rozhodnuti)

- **React** - SPA, jednodussi setup
- **Next.js** - React s SSR, lepsi SEO
- **Vue.js** - alternativa k Reactu
- **Thymeleaf** - serverove renderovani primo ve Spring Boot

## Setup

TYM FRONTEND: Inicializujte projekt podle zvolene technologie.

### Priklad pro React (Vite):
```bash
npm create vite@latest . -- --template react-ts
npm install
npm run dev
```

### Priklad pro Next.js:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint
npm run dev
```

## API Endpointy

Backend bezi na `http://localhost:8080`.
Viz dokumentace API (TYM BACKEND).
