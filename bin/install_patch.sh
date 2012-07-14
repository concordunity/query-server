#!/bin/bash

# first make a backup of BIN

mkdir -p $HOME/backup

tar cvf $HOME/backup/dms_bin_0604.tar $HOME/bin
tar cvf $HOME/backup/dms_docview_0604.tar public/libs/datepicker public/docview/alerts public/docview/details/ public/docview/dgselect/  public/docview/docview.js public/docview/history/ public/docview/history.ejs public/docview/login/ public/docview/manage/ public/docview/media/ public/docview/models/ public/docview/multi/ public/docview/nav/ public/docview/search/ public/docview/single/ public/docview/settings/ public/docview/sou/ public/docview/stats/ public/docview/subnav/ public/docview/views/ public/docview/*.html
tar cvf $HOME/backup/dms_app_0604.tar app/controllers/*.rb app/models/*.rb config/routes.rb db/migrate/*.rb

bundle exec rake db:migrate
cat sql/update_web_links_names.rb | rails c
