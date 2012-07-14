#!/bin/bash

cd $HOME/query-server/

bundle exec rake db:migrate
