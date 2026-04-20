CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    avatar_url      TEXT,
    timezone        VARCHAR(64) DEFAULT 'UTC',
    plan            VARCHAR(32) DEFAULT 'free',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Social platform accounts
CREATE TABLE platform_accounts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform            VARCHAR(32) NOT NULL,
    platform_user_id    VARCHAR(255) NOT NULL,
    platform_username   VARCHAR(255),
    access_token_enc    TEXT NOT NULL,
    refresh_token_enc   TEXT,
    token_expires_at    TIMESTAMPTZ,
    page_id             VARCHAR(255),
    page_name           VARCHAR(255),
    avatar_url          TEXT,
    is_active           BOOLEAN DEFAULT true,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, platform, platform_user_id)
);
CREATE INDEX idx_platform_accounts_user ON platform_accounts(user_id);

-- Teams
CREATE TABLE teams (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    owner_id    UUID NOT NULL REFERENCES users(id),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE team_members (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id     UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role        VARCHAR(32) NOT NULL DEFAULT 'member',
    can_publish BOOLEAN DEFAULT false,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Posts
CREATE TABLE posts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_id         UUID REFERENCES teams(id),
    status          VARCHAR(32) NOT NULL DEFAULT 'draft',
    content_global  TEXT,
    scheduled_at    TIMESTAMPTZ,
    published_at    TIMESTAMPTZ,
    ai_generated    BOOLEAN DEFAULT false,
    created_by      UUID REFERENCES users(id),
    approved_by     UUID REFERENCES users(id),
    approved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_posts_user_status ON posts(user_id, status);
CREATE INDEX idx_posts_scheduled ON posts(scheduled_at) WHERE status = 'scheduled';

-- Post variants per platform
CREATE TABLE post_variants (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id             UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    platform_account_id UUID NOT NULL REFERENCES platform_accounts(id) ON DELETE CASCADE,
    content_override    TEXT,
    platform_post_id    VARCHAR(255),
    platform_post_url   TEXT,
    status              VARCHAR(32) NOT NULL DEFAULT 'pending',
    error_message       TEXT,
    published_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_post_variants_post ON post_variants(post_id);

-- Media
CREATE TABLE media (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id         UUID REFERENCES posts(id) ON DELETE SET NULL,
    file_url        TEXT NOT NULL,
    thumbnail_url   TEXT,
    file_type       VARCHAR(32) NOT NULL,
    mime_type       VARCHAR(128),
    file_size_bytes BIGINT,
    width           INT,
    height          INT,
    duration_sec    INT,
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_media_post ON media(post_id);

-- Hashtag groups
CREATE TABLE hashtag_groups (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(128) NOT NULL,
    hashtags    TEXT[] NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Inbox
CREATE TABLE inbox_messages (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_account_id     UUID NOT NULL REFERENCES platform_accounts(id) ON DELETE CASCADE,
    platform_message_id     VARCHAR(255) NOT NULL,
    conversation_id         VARCHAR(255),
    message_type            VARCHAR(32) NOT NULL,
    sender_name             VARCHAR(255),
    sender_username         VARCHAR(255),
    sender_avatar_url       TEXT,
    sender_platform_id      VARCHAR(255),
    content                 TEXT,
    media_url               TEXT,
    parent_post_id          UUID REFERENCES posts(id),
    is_read                 BOOLEAN DEFAULT false,
    is_archived             BOOLEAN DEFAULT false,
    assigned_to             UUID REFERENCES users(id),
    platform_created_at     TIMESTAMPTZ,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(platform_account_id, platform_message_id)
);
CREATE INDEX idx_inbox_unread ON inbox_messages(platform_account_id, is_read) WHERE is_read = false;

CREATE TABLE inbox_replies (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inbox_message_id    UUID NOT NULL REFERENCES inbox_messages(id),
    user_id             UUID NOT NULL REFERENCES users(id),
    content             TEXT NOT NULL,
    platform_reply_id   VARCHAR(255),
    status              VARCHAR(32) DEFAULT 'sent',
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics snapshots
CREATE TABLE analytics_snapshots (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_account_id     UUID NOT NULL REFERENCES platform_accounts(id) ON DELETE CASCADE,
    post_variant_id         UUID REFERENCES post_variants(id),
    snapshot_date           DATE NOT NULL,
    followers_count         INT,
    impressions             INT DEFAULT 0,
    reach                   INT DEFAULT 0,
    engagements             INT DEFAULT 0,
    likes                   INT DEFAULT 0,
    comments                INT DEFAULT 0,
    shares                  INT DEFAULT 0,
    saves                   INT DEFAULT 0,
    clicks                  INT DEFAULT 0,
    video_views             INT DEFAULT 0,
    created_at              TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_analytics_account_date ON analytics_snapshots(platform_account_id, snapshot_date);

-- Approval requests
CREATE TABLE approval_requests (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    team_id     UUID NOT NULL REFERENCES teams(id),
    requested_by UUID NOT NULL REFERENCES users(id),
    reviewed_by  UUID REFERENCES users(id),
    status       VARCHAR(32) DEFAULT 'pending',
    comment      TEXT,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at  TIMESTAMPTZ
);
