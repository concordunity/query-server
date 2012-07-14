
cd $HOME/query-server
bundle exec rake db:migrate
cat bin/migrate_special_documents.rb | rails c
