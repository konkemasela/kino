import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * KINO is account-free: persistence is keyed to an anonymous device cookie.
 */
export const watchHistory = pgTable(
  "watch_history",
  {
    id: serial("id").primaryKey(),
    deviceId: text("device_id").notNull(),
    mediaType: text("media_type").notNull(),
    imdbId: text("imdb_id").notNull(),
    title: text("title").notNull(),
    posterPath: text("poster_path"),
    backdropPath: text("backdrop_path"),
    season: integer("season"),
    episode: integer("episode"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("watch_history_device_media_idx").on(
      t.deviceId,
      t.mediaType,
      t.imdbId,
    ),
  ],
);

export const watchlist = pgTable(
  "watchlist",
  {
    id: serial("id").primaryKey(),
    deviceId: text("device_id").notNull(),
    mediaType: text("media_type").notNull(),
    imdbId: text("imdb_id").notNull(),
    title: text("title").notNull(),
    posterPath: text("poster_path"),
    backdropPath: text("backdrop_path"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    uniqueIndex("watchlist_device_media_idx").on(
      t.deviceId,
      t.mediaType,
      t.imdbId,
    ),
  ],
);

export type WatchHistoryRow = typeof watchHistory.$inferSelect;
export type WatchlistRow = typeof watchlist.$inferSelect;
