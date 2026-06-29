# TulparHub — передача разработчикам

B2B/B2C маркетплейс запчастей для грузовой и спецтехники в Казахстане (КАМАЗ, MAN,
DAF, Volvo, Scania, HOWO, Shacman и др.) + аренда спецтехники. MVP собран, задеплоен
и работает. Этот документ — обзор для новых разработчиков; технические детали см. в
[README.md](README.md) и [DEPLOY.md](DEPLOY.md).

- **Репозиторий:** https://github.com/tulparhubkz/tulparhub
- **Staging (живой):** https://tulparhub.onrender.com
- **Задачи / бэклог:** [Issues](https://github.com/tulparhubkz/tulparhub/issues) ·
  [Project board](https://github.com/orgs/tulparhubkz/projects/1)

## 1. Стек (актуальный)

| Слой | Технология |
|---|---|
| Frontend / API | Next.js 14 (App Router), TypeScript, React |
| Стили | Чистый CSS (без Tailwind), переменные в `app/globals.css` |
| База данных | PostgreSQL + Drizzle ORM (самостоятельно размещаемый) |
| Авторизация | Auth.js (NextAuth v5) — Google + email magic link |
| Стейт на клиенте | Zustand + localStorage (корзина, избранное, гараж) |
| Инфраструктура | Docker Compose (Postgres + Next + Caddy auto-TLS) |
| Хостинг | Staging — Render (Frankfurt) + Neon Postgres; prod-цель — KZ VPS |

> Раньше проект был на Supabase + Vercel — выполнена миграция на самостоятельно
> размещаемый PostgreSQL/Drizzle и Docker. Источник каталога — CSV-выгрузка прайса
> вендора (`scripts/import-csv.ts`), в будущем — 1С. Дизайн рассчитан на нескольких
> вендоров, сейчас активен один.

## 2. Что уже работает

**Каталог** — ~20 280 деталей и ~121 680 строк остатков по складам, импорт из CSV
(идемпотентный, с журналом `sync_runs`). Фильтры (бренд, OEM/аналог, наличие, цена,
категория). Поиск по артикулу, названию и **VIN** (автоопределение марки/модели).
Карточка товара: наличие по складам, цена розница/опт (B2B), кросс-номера, аналоги.

**Корзина и заказ** — добавление в корзину с попапом (как на autopiter.kz), страница
корзины, оформление (пока создаёт «заявку» — см. ниже).

**Избранное** (`/wishlist`), **Мой гараж** с VIN-декодером по WMI-коду
(MAN, DAF, Volvo, Scania, Mercedes-Benz, IVECO, Renault, КАМАЗ, МАЗ, HOWO, Shacman,
FAW, Foton, DongFeng), **Помощь в подборе** (`/vin` — по VIN и по параметрам).

**Mobile-first UI** — нижняя навигация (bottom tab bar, «Liquid Glass»), шапка с
поиском, бренды, аренда — переписаны под мобильные; storefront смоделирован по
autopiter.kz.

## 3. Чего ещё нет (бэклог)

Всё ведётся в [Issues](https://github.com/tulparhubkz/tulparhub/issues) и на
[доске](https://github.com/orgs/tulparhubkz/projects/1) (метки `feature`, `infra`,
`blocked`, `good first issue`). Главное:

- **Авторизация подключена, но выключена** — провайдеры Auth.js настроены, но
  бездействуют, пока не заданы креды (`AUTH_GOOGLE_*`, `EMAIL_*`).
- **Нет реальных заказов** — оформление пишет `lead` (kind=`order`); нужно сохранять
  в таблицы `orders` / `order_items` (они уже есть в схеме).
- **Нет админ-панели** — каталог обновляется CSV-импортом, UI управления нет.
- **Нет оплаты** — нет интеграции с платёжным провайдером (Freedom Pay / Halyk ePay).
- **Переводы KZ/EN** — переключатель есть, переводов интерфейса нет.
- **Реальные фото по всем товарам** — у большинства показывается фото по категории.
- **Точный подбор по VIN** — текущий декодер приближённый (по таблице WMI); для
  production-точности нужна интеграция TecDoc/Laximo + мультивендорные кросс-ссылки.

## 4. С чего начать новому разработчику

1. Поднять локально по [README.md](README.md) (Docker + `yarn dev`).
2. Прочитать раздел **«Как мы работаем»** и **«Подводные камни»** в README.
3. Взять задачу с меткой **`good first issue`** в Issues, сделать ветку → PR.

## 5. Что обсудить с командой

1. Подключение реальной авторизации (Google OAuth + SMTP) на staging.
2. Реальные заказы (`orders`) → затем оплата (Freedom Pay vs Halyk ePay).
3. Нужна ли интеграция TecDoc/Laximo для точного VIN-подбора (платная).
4. Переезд staging → prod на KZ VPS (см. [DEPLOY.md](DEPLOY.md)).
