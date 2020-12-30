create type cloud as enum ('dropbox', 'onedrive');

create table if not exists drives (
  id serial primary key not null,
  kind cloud not null,
  title text not null,
  user_id integer not null references users(id) on delete cascade
);