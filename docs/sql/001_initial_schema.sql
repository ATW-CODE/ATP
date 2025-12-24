-- ATP Initial Database Schema
-- Database: PostgreSQL
-- Version: 001

-- =========================
-- ENUM TYPES
-- =========================

CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TYPE printer_status AS ENUM ('online', 'offline', 'maintenance');

CREATE TYPE print_job_status AS ENUM (
    'uploaded',
    'queued',
    'printing',
    'completed',
    'failed'
);

CREATE TYPE transaction_type AS ENUM ('debit', 'credit');

-- =========================
-- USERS TABLE
-- =========================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================
-- FILES TABLE
-- =========================

CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_files_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- PRINTERS TABLE
-- =========================

CREATE TABLE printers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    location_name VARCHAR(255),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    status printer_status NOT NULL DEFAULT 'offline',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================
-- PRINT JOBS TABLE
-- =========================

CREATE TABLE print_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    file_id UUID NOT NULL,
    printer_id UUID NOT NULL,
    status print_job_status NOT NULL DEFAULT 'uploaded',
    copies INTEGER NOT NULL DEFAULT 1,
    color BOOLEAN NOT NULL DEFAULT false,
    pages INTEGER NOT NULL,
    cost NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_jobs_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_jobs_file
        FOREIGN KEY (file_id)
        REFERENCES files(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_jobs_printer
        FOREIGN KEY (printer_id)
        REFERENCES printers(id)
        ON DELETE RESTRICT
);

-- =========================
-- WALLETS TABLE
-- =========================

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    balance NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_wallet_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================
-- TRANSACTIONS TABLE
-- =========================

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    type transaction_type NOT NULL,
    reference UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT fk_transaction_wallet
        FOREIGN KEY (wallet_id)
        REFERENCES wallets(id)
        ON DELETE CASCADE
);

-- =========================
-- INDEXES (PERFORMANCE)
-- =========================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_files_user ON files(user_id);
CREATE INDEX idx_jobs_user ON print_jobs(user_id);
CREATE INDEX idx_jobs_printer ON print_jobs(printer_id);
CREATE INDEX idx_jobs_status ON print_jobs(status);
CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);
