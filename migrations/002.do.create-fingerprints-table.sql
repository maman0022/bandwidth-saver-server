create table if not exists fingerprints (
  id serial primary key not null,
  identifier text not null,
  max_per_hour integer not null,
  current_usage integer not null,
  next_reset bigint not null
);