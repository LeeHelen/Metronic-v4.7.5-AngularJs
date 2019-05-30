@echo off
title redis-server
set ENV_HOME="E:\Program Files\Redis-x64-3.2.100"
color 0a
E:
cd %ENV_HOME%
redis-server.exe redis.windows.conf
exit