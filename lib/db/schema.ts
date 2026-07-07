import { sql } from 'drizzle-orm'
import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  jsonb,
  timestamp,
  primaryKey,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'

/* ─────────────────────────────────────────────────────────────────────────────
 * Reference / catalog dimension tables
 * ──────────────────────────────────────────────────────────────────────────── */

// Vendors (suppliers). One vendor today; designed for many. The CSV price export
// is currently the source of truth — one vendor maps to one feed.
export const vendors = pgTable('vendors', {
  id: text('id').primaryKey(), // slug, e.g. "main"
  name: text('name').notNull(),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// Cities (storefront localization + stock warehouses live in part_stock).
export const cities = pgTable('cities', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  country: text('country'),
  currency: text('currency'),
  symbol: text('symbol'),
})

// Equipment types (truck categories for the storefront).
export const equipmentTypes = pgTable('equipment_types', {
  id: text('id').primaryKey(),
  ru: text('ru').notNull(),
  en: text('en'),
  count: integer('count').notNull().default(0),
})

// Truck brands (NOT parts manufacturers).
export const brands = pgTable('brands', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  country: text('country'),
})

// Truck models, scoped to a brand.
export const models = pgTable(
  'models',
  {
    id: text('id').notNull(),
    brandId: text('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    years: text('years'),
    cls: text('cls'),
    fits: text('fits'), // exact prefix used in parts.fits, e.g. "Volvo FH13"
  },
  (t) => ({
    pk: primaryKey({ columns: [t.brandId, t.id] }),
  }),
)

// Part categories ("systems": engine, brakes, …).
export const systems = pgTable('systems', {
  id: text('id').primaryKey(),
  ru: text('ru').notNull(),
  icon: text('icon'),
  count: integer('count').notNull().default(0),
})

/* ─────────────────────────────────────────────────────────────────────────────
 * Catalog: parts + per-warehouse stock
 * ──────────────────────────────────────────────────────────────────────────── */

export const parts = pgTable(
  'parts',
  {
    // Stable internal id. Derived deterministically from (vendor_id, vendor_sku)
    // so re-imports never churn ids (the old `p-${lineNum}` scheme broke this).
    id: text('id').primaryKey(),
    vendorId: text('vendor_id')
      .notNull()
      .references(() => vendors.id),
    vendorSku: text('vendor_sku').notNull(), // vendor's internal code (CSV "код")
    oem: text('oem'), // OEM article number
    name: text('name').notNull(),
    brand: text('brand'), // parts manufacturer (MANN, Bosch, КАМАЗ…)
    type: text('type').notNull().default('OEM'), // OEM | Aftermarket
    category: text('category').references(() => systems.id),
    fits: text('fits').array(), // ["Volvo FH13", "KAMAZ 6520", …]
    price: integer('price').notNull().default(0), // retail, KZT
    priceB2b: integer('price_b2b'), // wholesale, KZT
    priceUsd: integer('price_usd'),
    vat: integer('vat').notNull().default(12),
    eta: text('eta'),
    img: text('img'),
    specs: jsonb('specs').$type<Record<string, string>>().default({}),
    cross: text('cross').array(), // cross / interchange numbers
    rating: real('rating').default(0),
    reviews: integer('reviews').notNull().default(0),
    active: boolean('active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    vendorSkuUq: uniqueIndex('parts_vendor_sku_uq').on(t.vendorId, t.vendorSku),
    oemIdx: index('parts_oem_idx').on(t.oem),
    categoryIdx: index('parts_category_idx').on(t.category),
  }),
)

export const partStock = pgTable(
  'part_stock',
  {
    partId: text('part_id')
      .notNull()
      .references(() => parts.id, { onDelete: 'cascade' }),
    city: text('city').notNull(), // warehouse city
    qty: integer('qty').notNull().default(0),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.partId, t.city] }),
  }),
)

/* ─────────────────────────────────────────────────────────────────────────────
 * Rental units
 * ──────────────────────────────────────────────────────────────────────────── */

export const rentalUnits = pgTable('rental_units', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  brand: text('brand'),
  year: integer('year'),
  type: text('type'),
  img: text('img'),
  specs: jsonb('specs').$type<Record<string, string>>().default({}),
  rateShift: integer('rate_shift'),
  rateDay: integer('rate_day'),
  rateWeek: integer('rate_week'),
  rateMonth: integer('rate_month'),
  city: text('city'),
  operator: boolean('operator').notNull().default(false),
  delivery: text('delivery'),
  available: text('available'),
  condition: text('condition'),
  hours: integer('hours'),
})

/* ─────────────────────────────────────────────────────────────────────────────
 * Auth.js (NextAuth v5) tables — shape required by @auth/drizzle-adapter,
 * plus TulparHub-specific user columns (role, B2B fields).
 * ──────────────────────────────────────────────────────────────────────────── */

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('email_verified', { withTimezone: true, mode: 'date' }),
  image: text('image'),
  // TulparHub additions
  role: text('role').notNull().default('retail'), // retail | b2b | admin
  phone: text('phone'),
  company: text('company'),
  bin: text('bin'), // КЗ business identification number
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const accounts = pgTable(
  'accounts',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.provider, t.providerAccountId] }),
  }),
)

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { withTimezone: true, mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { withTimezone: true, mode: 'date' }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.identifier, t.token] }),
  }),
)

/* ─────────────────────────────────────────────────────────────────────────────
 * Commerce: orders + line items, plus leads (callbacks/quotes/bookings).
 * ──────────────────────────────────────────────────────────────────────────── */

export const orders = pgTable(
  'orders',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    invoiceNumber: text('invoice_number').notNull().unique(),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }), // null = guest checkout
    status: text('status').notNull().default('new'), // new | confirmed | shipped | done | cancelled
    paymentStatus: text('payment_status').notNull().default('pending'), // pending | paid | failed | refunded
    paymentProvider: text('payment_provider'),
    paymentRef: text('payment_ref'),
    total: integer('total').notNull().default(0), // KZT — grand total, goods + delivery
    deliveryCost: integer('delivery_cost'), // KZT; null = manager-calc / not captured
    currency: text('currency').notNull().default('KZT'),
    // Customer snapshot (guests have no user row)
    customerName: text('customer_name').notNull(),
    customerPhone: text('customer_phone').notNull(),
    customerEmail: text('customer_email'),
    city: text('city'),
    company: text('company'),
    bin: text('bin'),
    delivery: text('delivery'),
    address: text('address'),
    comment: text('comment'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('orders_user_idx').on(t.userId),
    statusIdx: index('orders_status_idx').on(t.status),
  }),
)

export const orderItems = pgTable(
  'order_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    partId: text('part_id').references(() => parts.id, { onDelete: 'set null' }),
    // Snapshot fields so the line item survives catalog changes
    oem: text('oem'),
    name: text('name').notNull(),
    qty: integer('qty').notNull(),
    price: integer('price').notNull(), // unit price at time of order, KZT
  },
  (t) => ({
    orderIdx: index('order_items_order_idx').on(t.orderId),
  }),
)

// Lightweight leads: callbacks, quote requests, rental bookings. Detail in meta.
export const leads = pgTable('leads', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  kind: text('kind').notNull(), // order | callback | booking | quote
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  city: text('city'),
  comment: text('comment'),
  meta: jsonb('meta').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// User's saved vehicles ("My Garage"). Guests keep a localStorage copy; rows
// here belong to signed-in users and are imported from localStorage on first
// sign-in (#17). `search_query` is the decoded "brand model" string used by
// the catalog search — persisted because NHTSA-decoded VINs can't be
// re-derived offline.
export const garage = pgTable(
  'garage',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id').notNull(),
    vin: text('vin').notNull(),
    name: text('name').notNull(),
    note: text('note').default(''),
    searchQuery: text('search_query'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('garage_user_idx').on(t.userId),
  }),
)

/* ─────────────────────────────────────────────────────────────────────────────
 * Import / sync audit — one row per importer run (CSV today, 1C later).
 * ──────────────────────────────────────────────────────────────────────────── */

export const syncRuns = pgTable('sync_runs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  vendorId: text('vendor_id').references(() => vendors.id),
  source: text('source').notNull().default('csv'), // csv | 1c
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
  status: text('status').notNull().default('running'), // running | success | error
  rowsRead: integer('rows_read').notNull().default(0),
  partsUpserted: integer('parts_upserted').notNull().default(0),
  stockUpserted: integer('stock_upserted').notNull().default(0),
  error: text('error'),
})

// Convenience type exports for the services layer.
export type Part = typeof parts.$inferSelect
export type NewPart = typeof parts.$inferInsert
export type Order = typeof orders.$inferSelect
export type User = typeof users.$inferSelect
