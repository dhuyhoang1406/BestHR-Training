#!/usr/bin/env bash
# Creates the local PostgreSQL role + database used by the NestJS backend.
# Requires peer/sudo access to the postgres OS user, e.g.:
#   sudo -u postgres bash scripts/setup-db.sh

set -euo pipefail

DB_USER="${DB_USERNAME:-besthr}"
DB_PASS="${DB_PASSWORD:-besthr}"
DB_NAME="${DB_NAME:-besthr_training}"

psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASS}';
  ELSE
    ALTER ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASS}';
  END IF;
END
\$\$;

SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec

GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
SQL

echo "Database ready: ${DB_NAME} (user ${DB_USER})"
