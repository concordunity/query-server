#!/bin/bash


sudo /etc/init.d/nginx stop

mkdir -p $HOME/backup
cd $HOME/query-server/log/
mv development.log $HOME/backup
touch development.log
sudo /etc/init.d/nginx start
