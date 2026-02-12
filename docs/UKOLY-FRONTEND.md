# Ukoly: Frontend

**Slozka:** `frontend/`
**Zodpovednost:** 2 osoby

## Co uz je pripraveno

- Prazdna slozka s README
- Backend API bezi na `http://localhost:8080`

## Rozhodnout: Technologie

| Moznost | Popis | Doporuceni |
|---------|-------|------------|
| **React + Vite** | SPA, jednoduchy setup | Pro zacatecniky |
| **Next.js** | React s SSR, lepsi SEO | Pro zkusenejsi |
| **Vue.js** | Alternativa k React | Pokud znas Vue |

## Setup projektu

### React + Vite (doporuceno)
```bash
cd frontend
npm create vite@latest . -- --template react-ts
npm install
npm install axios react-router-dom @tanstack/react-query
npm run dev
```

### Next.js
```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint
npm run dev
```

## Stranky k implementaci

### Verejne (bez prihlaseni)
- [ ] **Homepage** `/` - uvodni stranka, prehled sluzeb
- [ ] **Tarify** `/plans` - seznam hostigovych planu s cenami
- [ ] **Registrace** `/register` - registracni formular
- [ ] **Prihlaseni** `/login` - prihlasovaci formular

### Chranene (po prihlaseni)
- [ ] **Dashboard** `/dashboard` - prehled zakaznika
- [ ] **Objednavky** `/orders` - seznam objednavek
- [ ] **Nova objednavka** `/orders/new` - vytvoreni objednavky
- [ ] **Domeny** `/domains` - sprava domen
- [ ] **FTP pristupy** `/ftp` - zobrazeni FTP udaju
- [ ] **Databaze** `/databases` - sprava databazi
- [ ] **Profil** `/profile` - uprava profilu, zmena hesla

### Admin (volitelne)
- [ ] **Admin dashboard** `/admin` - statistiky
- [ ] **Sprava uzivatelu** `/admin/users` - seznam uzivatelu
- [ ] **Sprava objednavek** `/admin/orders` - vsechny objednavky

## API volani

### Axios setup
```typescript
// src/api/client.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

// Interceptor pro auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Priklad API volani
```typescript
// src/api/auth.ts
import api from './client';

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
```

## Komponenty

### Layout
```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   └── ...
├── pages/
│   ├── Home.tsx
│   ├── Plans.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── dashboard/
│       ├── Dashboard.tsx
│       ├── Orders.tsx
│       └── ...
└── ...
```

## Stylování

### Moznosti
- **Tailwind CSS** - utility-first CSS
- **CSS Modules** - scoped CSS
- **Styled Components** - CSS-in-JS
- **Shadcn/ui** - komponenty pro React + Tailwind

### Tailwind setup (Vite)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Autentizace

### Context pro uzivatele
```typescript
// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then(setUser)
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  // ...
};
```

### Chranene routy
```typescript
// src/components/ProtectedRoute.tsx
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loading />;
  if (!user) return <Navigate to="/login" />;

  return children;
};
```

## Responzivni design

- Mobile-first pristup
- Breakpointy: 640px (sm), 768px (md), 1024px (lg)
- Testovat na ruznych zarizenich

## Testovani

```bash
# Spustit frontend
cd frontend
npm run dev

# Otevre se na http://localhost:5173
```

## Checklist

- [ ] Inicializace projektu
- [ ] Routing setup
- [ ] API client
- [ ] Auth context
- [ ] Homepage
- [ ] Tarify stranka
- [ ] Login/Register formulare
- [ ] Dashboard
- [ ] Responzivni design
- [ ] Error handling
- [ ] Loading stavy
