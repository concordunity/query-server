#!/usr/bin/bash
cd ~/query-server
rails runner "DocumentStat.generate"
