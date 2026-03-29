-- ET Nexus Database Schema
-- Run once on fresh PostgreSQL instance (auto-applied via docker-entrypoint-initdb.d)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------
-- Table: users
-- Stores persona-driven user profiles
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name      VARCHAR(255) NOT NULL,
    persona   VARCHAR(50)  NOT NULL CHECK (persona IN ('INVESTOR', 'FOUNDER', 'STUDENT')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on persona for quick feed filtering
CREATE INDEX IF NOT EXISTS idx_users_persona ON users (persona);

-- -------------------------------------------------------
-- Table: story_arcs
-- Stores AI-synthesised story arc data as JSONB
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS story_arcs (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    topic          VARCHAR(512) NOT NULL,
    timeline_json  JSONB        NOT NULL DEFAULT '[]'::JSONB,
    key_players    JSONB        NOT NULL DEFAULT '[]'::JSONB,
    predictions    JSONB        NOT NULL DEFAULT '[]'::JSONB,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- GIN index for fast JSONB queries
CREATE INDEX IF NOT EXISTS idx_story_arcs_timeline ON story_arcs USING GIN (timeline_json);
CREATE INDEX IF NOT EXISTS idx_story_arcs_players  ON story_arcs USING GIN (key_players);
CREATE INDEX IF NOT EXISTS idx_story_arcs_topic    ON story_arcs (topic);

-- -------------------------------------------------------
-- Seed Data (demo personas)
-- -------------------------------------------------------
INSERT INTO users (name, persona) VALUES
    ('Arjun Mehta',   'INVESTOR'),
    ('Priya Sharma',  'FOUNDER'),
    ('Riya Kapoor',   'STUDENT')
ON CONFLICT DO NOTHING;
