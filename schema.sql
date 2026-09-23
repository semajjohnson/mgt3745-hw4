-- schema.sql
-- One row per recommendation: a track and the one person it came from.
-- A track recommended by two people is two rows, merged for display (A6).
DROP TABLE IF EXISTS entries;
CREATE TABLE entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  track TEXT NOT NULL,
  source TEXT NOT NULL,
  dismissed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);