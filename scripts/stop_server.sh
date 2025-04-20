#!/bin/bash
# Stop any running pm2 processes (ignore errors if none)
pm2 stop all || true
