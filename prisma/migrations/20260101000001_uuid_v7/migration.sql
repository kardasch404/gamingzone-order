-- Enable uuid-ossp extension for UUID v7
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create UUID v7 function
CREATE OR REPLACE FUNCTION uuid_generate_v7()
RETURNS uuid
AS $$
DECLARE
  unix_ts_ms bytea;
  uuid_bytes bytea;
BEGIN
  unix_ts_ms = substring(int8send(floor(extract(epoch from clock_timestamp()) * 1000)::bigint) from 3);
  uuid_bytes = unix_ts_ms || gen_random_bytes(10);
  
  RETURN encode(
    set_byte(
      set_byte(
        uuid_bytes,
        6, (get_byte(uuid_bytes, 6) & 15) | 112
      ),
      8, (get_byte(uuid_bytes, 8) & 63) | 128
    ),
    'hex'
  )::uuid;
END
$$
LANGUAGE plpgsql
VOLATILE;
