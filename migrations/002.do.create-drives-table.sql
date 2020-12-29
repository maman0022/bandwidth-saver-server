create table if not exists drives (
  id serial primary key not null,
  kind text not null,
  title text not null,
  user_id integer not null references users(id) on delete cascade
);