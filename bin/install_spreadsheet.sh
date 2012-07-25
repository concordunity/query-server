#!/bin/bash
  echo "进入项目下的bin目录"
  cd $HOME/query-server
  echo "开始安装ruby-ole"
  rvm all do gem install ruby-ole-1.2.11.4.gem 
  echo "开始安装spreadsheet"
  rvm all do gem install spreadsheet-0.7.3.gem 
  echo "安装结束！"
