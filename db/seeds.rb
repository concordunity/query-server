# encoding: utf-8
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

u = User.find_or_create_by_username("electronic_doc_producer@concordunity.com")
u.password='bmnybnuqi8bCjqEew9uL'
u.email='electronic_doc_producer@concordunity.com'
r = Role.find_or_create_by_name('admin')
u.roles<<r
u.save

u = User.find_or_create_by_username("admin")
u.fullname='System Admin'
u.email='no-reply@customs.gov.cn'
u.password='GsrIvQNhD'
u.roles<<r
u.save

