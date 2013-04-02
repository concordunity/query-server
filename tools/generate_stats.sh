#!/usr/bin/env bash

# load rvm ruby
source /home/ubuntu/.rvm/environments/ruby-1.9.3-p194

cd /home/ubuntu/query-server && /home/ubuntu/.rvm/gems/ruby-1.9.3-p194/bin/rails runner /home/ubuntu/query-server/tools/document_stat.rb 
