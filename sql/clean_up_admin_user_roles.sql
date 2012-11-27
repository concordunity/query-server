
delete from users_roles where user_id = 1 and role_id = 1;
delete from users_roles where user_id = 2 and role_id = 1;
insert into users_roles (user_id, role_id) values (1,1);
insert into users_roles (user_id, role_id) values (2,1);
commit;
