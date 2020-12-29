create table if not exists users (
  id serial primary key not null,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  pw text not null
);