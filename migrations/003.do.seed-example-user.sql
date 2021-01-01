begin;

insert into users (first_name, last_name, email, pw)
values ('John', 'Doe', 'jd@123.com', '$2a$10$WvpoPQu1C1/keOlq9hhe4OhznWn4vWv2Gd6dkADVXP5g4qX8jp5Du');

insert into fingerprints (identifier, max_per_hour, current_usage, next_reset)
values ('jd@123.com', 1, 0, (extract(epoch from now()) + 90) * 1000);

commit;