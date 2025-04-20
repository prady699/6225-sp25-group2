#!/bin/bash
cd /home/ubuntu/app
pm2 start npm --name "my-app" -- start
