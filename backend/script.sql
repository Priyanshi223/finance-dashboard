-- AI-Generated Code - 2026-04-02 - Claude
-- DDL for finance dashboard (SQLite). Matches JPA entities User + FinancialRecord.
-- Spring Boot uses snake_case physical column names (e.g. password_hash, record_date).
-- Usage: sqlite3 data/finance.db < script.sql
--        (run from backend/ so data/ matches application.properties)
-- Note: If tables already exist from Hibernate ddl-auto=update, compare before applying.

PRAGMA foreign_keys = ON;

-- Optional: reset schema (uncomment to wipe existing data)
-- DROP TABLE IF EXISTS financial_records;
-- DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    username        VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    email           VARCHAR(120),
    role            VARCHAR(20)  NOT NULL,
    active          INTEGER      NOT NULL DEFAULT 1,
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT ck_users_role CHECK (role IN ('VIEWER', 'ANALYST', 'ADMIN'))
);

CREATE TABLE IF NOT EXISTS financial_records (
    id              INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    amount          NUMERIC(19, 4) NOT NULL,
    type            VARCHAR(20)    NOT NULL,
    category        VARCHAR(80)    NOT NULL,
    record_date     DATE           NOT NULL,
    notes           VARCHAR(2000),
    created_at      TIMESTAMP      NOT NULL,
    created_by_id   INTEGER,
    CONSTRAINT fk_financial_records_created_by
        FOREIGN KEY (created_by_id) REFERENCES users (id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    CONSTRAINT ck_financial_records_type CHECK (type IN ('INCOME', 'EXPENSE'))
);

CREATE INDEX IF NOT EXISTS idx_financial_records_record_date
    ON financial_records (record_date);

CREATE INDEX IF NOT EXISTS idx_financial_records_created_by_id
    ON financial_records (created_by_id);

CREATE INDEX IF NOT EXISTS idx_financial_records_category
    ON financial_records (category);

CREATE INDEX IF NOT EXISTS idx_financial_records_type
    ON financial_records (type);
