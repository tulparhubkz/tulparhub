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

## Как мы работаем

- **`main` защищён — прямой push запрещён.** Всегда: ветка → PR → проверка `build`
  в CI должна пройти → merge. Merge в `main` запускает авто-деплой.
- **Ветки:** `feat/<имя>`, `fix/<имя>`, `chore/<имя>`. Коммиты — мелкие и по
  существу, conventional style (`feat(catalog): ...`); один PR = одна задача.
- **Пакетный менеджер — yarn** (не npm). После изменения зависимостей запусти
  `yarn install`, чтобы `yarn.lock` совпадал — CI использует `--frozen-lockfile`.
- **UI mobile-first.** Проверяй на **375px** (нет горизонтального скролла, чистая
  консоль), затем desktop. Перед пушем `yarn build` должен проходить локально.

## Подводные камни

- **GET-роуты, читающие БД, должны иметь `export const dynamic = 'force-dynamic'`** —
  иначе Next пытается отрендерить их при сборке (БД недоступна) и build падает.
  Пример: `app/api/part-brands/route.ts`.
- **Не правь версии зависимостей руками** в `package.json` — используй
  `yarn add` / `yarn install`, чтобы lock-файл совпадал.
- **Стили страницы** — `<style jsx>` (скоуп), а не голый `<style>` (утекает
  глобально). Пример: `app/catalog/[id]/page.tsx`.
- Клиент БД import-safe — `yarn build` работает без `DATABASE_URL`.

## Задачи и роадмап

План MVP и пост-MVP — в **[ROADMAP.md](ROADMAP.md)**.
Бэклог ведётся в GitHub (метки: `good first issue`, `feature`, `infra`, `blocked`):

- **Issues:** https://github.com/tulparhubkz/tulparhub/issues
- **Project board:** https://github.com/orgs/tulparhubkz/projects/1

Новым контрибьюторам — начните с метки **`good first issue`**.

## Деплой

См. [DEPLOY.md](DEPLOY.md) — self-hosted на KZ VPS через Docker Compose, авто-деплой из `main` (GitHub Actions).
