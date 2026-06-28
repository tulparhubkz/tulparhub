# TulparHub

Маркетплейс грузовых запчастей и аренды спецтехники (Казахстан). Next.js + самостоятельно размещаемый PostgreSQL.

## Стек

| Слой | Технология |
|------|------------|
| Frontend / API | Next.js 14 (App Router), TypeScript |
| База данных | PostgreSQL + Drizzle ORM |
| Авторизация | Auth.js (NextAuth v5) — Google + email magic link |
| Инфраструктура | Docker Compose (Postgres + app + Caddy auto-TLS), KZ VPS |
| Стейт на клиенте | Zustand + localStorage (корзина, избранное, гараж) |

Источник данных каталога — CSV-выгрузка прайса вендора (см. `scripts/import-csv.ts`); в будущем — 1С.

## Локальный запуск

```bash
docker compose -f docker-compose.dev.yml up -d   # Postgres на localhost:5432
cp .env.example .env                             # DATABASE_URL уже настроен для dev
yarn install
yarn db:migrate                                  # применить миграции
yarn import-csv                                  # импорт каталога (нужен CSV по пути CSV_PATH)
yarn dev                                          # http://localhost:3000
```

## Скрипты

| Команда | Действие |
|---------|----------|
| `yarn dev` / `yarn build` / `yarn start` | разработка / сборка / прод |
| `yarn db:generate` | сгенерировать миграцию из `lib/db/schema.ts` |
| `yarn db:migrate` | применить миграции |
| `yarn db:studio` | Drizzle Studio (просмотр БД) |
| `yarn import-csv` | импорт прайса вендора в БД |

## API (Route Handlers в `app/api/`)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/parts` | Список запчастей: `system`, `brand`, `model`, `partBrand`, `q`, `oemOnly=1`, `inStock=1`, `priceMax`, `sort`, `page` |
| GET | `/api/parts/:id` | Одна запчасть |
| GET | `/api/search?q=` | Поиск (parts / systems / brands) |
| GET | `/api/part-brands` | Производители запчастей с количеством |
| GET | `/api/rental`, `/api/rental/:id` | Аренда техники |
| GET | `/api/brands`, `/api/systems`, `/api/cities` | Справочники (из `lib/data`) |
| POST | `/api/leads` | Заявка (заказ / звонок / бронь / запрос цены) |
| `/api/auth/*` | Auth.js (Google, email) |

## Структура

```
app/            страницы + app/api (Route Handlers) + actions.ts (server actions)
lib/db/         schema.ts (Drizzle), index.ts (клиент), миграции в drizzle/
lib/services/   слой доступа к данным (parts, leads, garage) — роуты зовут его, не БД напрямую
lib/auth.ts     конфиг Auth.js
lib/data.ts     статические справочники (бренды/модели/города/категории, демо-аренда)
store/          Zustand-сторы (корзина, избранное, гараж)
```

## Деплой

См. [DEPLOY.md](DEPLOY.md) — self-hosted на KZ VPS через Docker Compose, авто-деплой из `main` (GitHub Actions).
