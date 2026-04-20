-- Users
CREATE TABLE IF NOT EXISTS users (
    id              TEXT PRIMARY KEY,
    email           TEXT UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    full_name       TEXT NOT NULL,
    avatar_url      TEXT,
    timezone        TEXT DEFAULT 'UTC',
    plan            TEXT DEFAULT 'free',
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
);

-- Social platform accounts
CREATE TABLE IF NOT EXISTS platform_accounts (
    id                  TEXT PRIMARY KEY,
    user_id             TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform            TEXT NOT NULL,
    platform_user_id    TEXT NOT NULL,
    platform_username   TEXT,
    access_token_enc    TEXT NOT NULL,
    refresh_token_enc   TEXT,
    token_expires_at    TEXT,
    page_id             TEXT,
    page_name           TEXT,
    avatar_url          TEXT,
    is_active           INTEGER DEFAULT 1,
    created_at          TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, platform, platform_user_id)
);
CREATE INDEX IF NOT EXISTS idx_platform_accounts_user ON platform_accounts(user_id);

-- Teams
CREATE TABLE IF NOT EXISTS teams (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    owner_id    TEXT NOT NULL REFERENCES users(id),
    created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS team_members (
    id          TEXT PRIMARY KEY,
    team_id     TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role        TEXT NOT NULL DEFAULT 'member',
    can_publish INTEGER DEFAULT 0,
    created_at  TEXT DEFAULT (datetime('now')),
    UNIQUE(team_id, user_id)
);

-- Posts
CREATE TABLE IF NOT EXISTS posts (
    id              TEXT PRIMARY KEY,
    user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_id         TEXT REFERENCES teams(id),
    status          TEXT NOT NULL DEFAULT 'draft',
    content_global  TEXT,
    scheduled_at    TEXT,
    published_at    TEXT,
    ai_generated    INTEGER DEFAULT 0,
    created_by      TEXT REFERENCES users(id),
    approved_by     TEXT REFERENCES users(id),
    approved_at     TEXT,
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_posts_user_status ON posts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled ON posts(scheduled_at);

-- Post variants per platform
CREATE TABLE IF NOT EXISTS post_variants (
    id                  TEXT PRIMARY KEY,
    post_id             TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    platform_account_id TEXT NOT NULL REFERENCES platform_accounts(id) ON DELETE CASCADE,
    content_override    TEXT,
    platform_post_id    TEXT,
    platform_post_url   TEXT,
    status              TEXT NOT NULL DEFAULT 'pending',
    error_message       TEXT,
    published_at        TEXT,
    created_at          TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_post_variants_post ON post_variants(post_id);

-- Media
CREATE TABLE IF NOT EXISTS media (
    id              TEXT PRIMARY KEY,
    user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id         TEXT REFERENCES posts(id) ON DELETE SET NULL,
    file_url        TEXT NOT NULL,
    thumbnail_url   TEXT,
    file_type       TEXT NOT NULL,
    mime_type       TEXT,
    file_size_bytes INTEGER,
    width           INTEGER,
    height          INTEGER,
    duration_sec    INTEGER,
    sort_order      INTEGER DEFAULT 0,
    created_at      TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_media_post ON media(post_id);

-- Hashtag groups
CREATE TABLE IF NOT EXISTS hashtag_groups (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    hashtags    TEXT NOT NULL,
    created_at  TEXT DEFAULT (datetime('now'))
);

-- Inbox
CREATE TABLE IF NOT EXISTS inbox_messages (
    id                      TEXT PRIMARY KEY,
    platform_account_id     TEXT NOT NULL REFERENCES platform_accounts(id) ON DELETE CASCADE,
    platform_message_id     TEXT NOT NULL,
    conversation_id         TEXT,
    message_type            TEXT NOT NULL,
    sender_name             TEXT,
    sender_username         TEXT,
    sender_avatar_url       TEXT,
    sender_platform_id      TEXT,
    content                 TEXT,
    media_url               TEXT,
    parent_post_id          TEXT REFERENCES posts(id),
    is_read                 INTEGER DEFAULT 0,
    is_archived             INTEGER DEFAULT 0,
    assigned_to             TEXT REFERENCES users(id),
    platform_created_at     TEXT,
    created_at              TEXT DEFAULT (datetime('now')),
    UNIQUE(platform_account_id, platform_message_id)
);
CREATE INDEX IF NOT EXISTS idx_inbox_unread ON inbox_messages(platform_account_id, is_read);

CREATE TABLE IF NOT EXISTS inbox_replies (
    id                  TEXT PRIMARY KEY,
    inbox_message_id    TEXT NOT NULL REFERENCES inbox_messages(id),
    user_id             TEXT NOT NULL REFERENCES users(id),
    content             TEXT NOT NULL,
    platform_reply_id   TEXT,
    status              TEXT DEFAULT 'sent',
    created_at          TEXT DEFAULT (datetime('now'))
);

-- Analytics snapshots
CREATE TABLE IF NOT EXISTS analytics_snapshots (
    id                      TEXT PRIMARY KEY,
    platform_account_id     TEXT NOT NULL REFERENCES platform_accounts(id) ON DELETE CASCADE,
    post_variant_id         TEXT REFERENCES post_variants(id),
    snapshot_date           TEXT NOT NULL,
    followers_count         INTEGER,
    impressions             INTEGER DEFAULT 0,
    reach                   INTEGER DEFAULT 0,
    engagements             INTEGER DEFAULT 0,
    likes                   INTEGER DEFAULT 0,
    comments                INTEGER DEFAULT 0,
    shares                  INTEGER DEFAULT 0,
    saves                   INTEGER DEFAULT 0,
    clicks                  INTEGER DEFAULT 0,
    video_views             INTEGER DEFAULT 0,
    created_at              TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_analytics_account_date ON analytics_snapshots(platform_account_id, snapshot_date);

-- Approval requests
CREATE TABLE IF NOT EXISTS approval_requests (
    id          TEXT PRIMARY KEY,
    post_id     TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    team_id     TEXT NOT NULL REFERENCES teams(id),
    requested_by TEXT NOT NULL REFERENCES users(id),
    reviewed_by  TEXT REFERENCES users(id),
    status       TEXT DEFAULT 'pending',
    comment      TEXT,
    created_at   TEXT DEFAULT (datetime('now')),
    reviewed_at  TEXT
);

-- Settings (key-value store for API keys and config)
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT (datetime('now'))
);
