-- Optional PostGIS extension if available
DO $$ BEGIN
  CREATE EXTENSION IF NOT EXISTS postgis;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'PostGIS not installed, continuing with standard PostgreSQL & JSONB GeoJSON';
END $$;

