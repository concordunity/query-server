#!/bin/bash

# first make a backup of BIN

mkdir -p $HOME/backup

tar cvf $HOME/backup/dms_bin_0611.tar $HOME/bin
tar cvf $HOME/backup/dms_docview_0611.tar public/libs/datepicker public/docview/alerts public/docview/details/ public/docview/dgselect/  public/docview/docview.js public/docview/history/ public/docview/history.ejs public/docview/login/ public/docview/manage/ public/docview/media/ public/docview/models/ public/docview/multi/ public/docview/nav/ public/docview/search/ public/docview/single/ public/docview/settings/ public/docview/sou/ public/docview/stats/ public/docview/subnav/ public/docview/views/ public/docview/*.html

tar cvf $HOME/backup/dms_app_0611.tar app/controllers/*.rb app/models/*.rb config/routes.rb db/migrate/*.rb

bundle exec rake db:migrate

mysql -uroot -pmysql5 dms_development < sql/clean_up_admin_user_roles.sql

