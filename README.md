# TulparHub — Next.js приложение

Маркетплейс грузовых запчастей и аренды спецтехники. Переписан из HTML-прототипа в полноценный Next.js проект.

## Запуск

### 1. Установите Node.js (если ещё не установлен)

```bash
# macOS — через Homebrew:
brew install node

# Или скачайте установщик с https://nodejs.org (версия 18 или 20)
```

### 2. Установите зависимости и запустите

```bash
cd /Users/ulzanbaglanova/Claude/Projects/tulparhub
npm install
npm run dev
```

Откройте **http://localhost:3000**

### 3. Подключение Supabase (опционально)

Скопируйте `.env.local.example` в `.env.local` и заполните ключи из вашего проекта на supabase.com:

```bash
cp .env.local.example .env.local
```

Без `.env.local` приложение работает на mock-данных из `lib/data.ts`.

## API (бэкенд)

Все маршруты — Next.js Route Handlers внутри `app/api/`. При наличии `.env.local` работают через Supabase, без него — на mock-данных.

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/parts` | Список запчастей. Параметры: `system`, `brand`, `q`, `oemOnly=1`, `inStock=1`, `priceMax`, `sort`, `page` |
| GET | `/api/parts/:id` | Одна запчасть |
| GET | `/api/rental` | Список техники. Параметры: `type`, `operator=yes/no/any`, `city`, `page` |
| GET | `/api/rental/:id` | Одна единица техники |
| POST | `/api/leads` | Принять заявку (заказ, звонок, бронирование). JSON body с полями `kind`, `name`, `phone`, ... |
| GET | `/api/search?q=...` | Поиск — возвращает `{ parts, systems, brands }` |
| GET | `/api/brands` | Все бренды с моделями |
| GET | `/api/systems` | Все узлы и системы |
| GET | `/api/cities` | Все города |

### Seed (заполнение БД)

```bash
cp .env.local.example .env.local   # добавьте ключи Supabase
npm run seed                        # npx tsx scripts/seed.ts
```

## Структура

```
app/
  page.tsx              → Главная
  podbor/page.tsx       → Подбор по технике (6-шаговый визард)
  catalog/page.tsx      → Каталог с фильтрами
  catalog/[id]/page.tsx → Карточка товара
  rental/page.tsx       → Аренда спецтехники
  cart/page.tsx         → Корзина и оформление заказа
  globals.css           → Все CSS-переменные и стили

components/
  ui/                   → Ico, Btn, Badge, Chip, Price, Stock, Crumbs, Toast, VehicleSelector
  layout/               → Header, Footer, CityModal, FloatingChat
  catalog/              → PartCard, PartRow
  rental/               → RentalCard, BookingSheet

lib/
  data.ts               → Все демо-данные (запчасти, техника, бренды...)
  utils.ts              → fmtKZT, fmtVAT, stockStatus
  supabase.ts           → Supabase клиент и запросы

store/
  cart.ts               → Zustand store (корзина, город, язык) + localStorage
```

## Сборка и деплой

```bash
npm run build    # Собрать production-версию
npm start        # Запустить production-сервер

# Деплой на Vercel:
# 1. git init && git add . && git commit -m "init"
# 2. Создайте репо на GitHub и запушьте
# 3. Зайдите на vercel.com → Import → выберите репо
# 4. Добавьте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY
# 5. Deploy
```
