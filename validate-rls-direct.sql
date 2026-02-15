-- RLS Validation Query
-- Direct SQL to validate RLS policies across all schemas

\echo '🔐 RLS VALIDATION REPORT'
\echo '=========================='

-- Community Schema
\echo ''
\echo '📊 COMMUNITY SCHEMA'
\echo '-------------------'
SELECT
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN '✅' ELSE '❌' END as rls_enabled,
  (SELECT COUNT(*) FROM pg_policies p WHERE p.schemaname = pg_tables.schemaname AND p.tablename = pg_tables.tablename) as policy_count
FROM pg_tables
WHERE schemaname = 'community'
ORDER BY tablename;

-- Marketplace Schema
\echo ''
\echo '📊 MARKETPLACE SCHEMA'
\echo '---------------------'
SELECT
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN '✅' ELSE '❌' END as rls_enabled,
  (SELECT COUNT(*) FROM pg_policies p WHERE p.schemaname = pg_tables.schemaname AND p.tablename = pg_tables.tablename) as policy_count
FROM pg_tables
WHERE schemaname = 'marketplace'
ORDER BY tablename;

-- Academy Schema
\echo ''
\echo '📊 ACADEMY SCHEMA'
\echo '-----------------'
SELECT
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN '✅' ELSE '❌' END as rls_enabled,
  (SELECT COUNT(*) FROM pg_policies p WHERE p.schemaname = pg_tables.schemaname AND p.tablename = pg_tables.tablename) as policy_count
FROM pg_tables
WHERE schemaname = 'academy'
ORDER BY tablename;

-- Business Schema
\echo ''
\echo '📊 BUSINESS SCHEMA'
\echo '------------------'
SELECT
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN '✅' ELSE '❌' END as rls_enabled,
  (SELECT COUNT(*) FROM pg_policies p WHERE p.schemaname = pg_tables.schemaname AND p.tablename = pg_tables.tablename) as policy_count
FROM pg_tables
WHERE schemaname = 'business'
ORDER BY tablename;

-- Summary
\echo ''
\echo '📋 SUMMARY'
\echo '----------'
SELECT
  'TOTAL' as metric,
  COUNT(*) as table_count,
  SUM(CASE WHEN rowsecurity THEN 1 ELSE 0 END) as rls_enabled_count,
  SUM(CASE WHEN rowsecurity THEN 0 ELSE 1 END) as rls_disabled_count
FROM pg_tables
WHERE schemaname IN ('community', 'marketplace', 'academy', 'business');

-- Policy Details
\echo ''
\echo '🔍 POLICY DETAILS'
\echo '-----------------'
SELECT
  schemaname,
  tablename,
  policyname,
  qual,
  with_check
FROM pg_policies
WHERE schemaname IN ('community', 'marketplace', 'academy', 'business')
ORDER BY schemaname, tablename, policyname;

\echo ''
\echo '✅ RLS Validation Complete'
\echo ''
