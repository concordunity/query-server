#!/bin/bash

cat >> restart_services.sh <<EOF

# removing tempory files under 
rm -rf $HOME/query-server/jar/images/*
rm -rf $HOME/query-server/jar/radm/*

echo "ts = 2.days.ago.to_i; c=\"ts < #{ts}\"; MonitoringData.delete_all(c)" | rails c

EOF