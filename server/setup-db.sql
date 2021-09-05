\echo 'Delete and recreate cinema db?'
\prompt 'Return for yes or CTRL-C to cancel > ' foo

DROP DATABASE cinema;
CREATE DATABASE cinema;
\connect cinema

\i db-schema.sql
\i db-seed.sql

\echo 'Delete and recreate cinema_test db?'
\prompt 'Return for yes or CTRL-C to cancel > ' foo

DROP DATABASE cinema_test;
CREATE DATABASE cinema_test;
\connect cinema_test

\i db-schema.sql