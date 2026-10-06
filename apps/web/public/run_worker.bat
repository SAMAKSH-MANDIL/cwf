@echo off
title FEDZERO NATIVE EDGE WORKER DAEMON
cls
echo ======================================================================
echo   FEDZERO DECENTRALIZED VERIFIABLE AI NETWORK
echo   Native Edge Worker Node Launcher (Windows)
echo ======================================================================
echo.

set /p SERVER_IP="Enter Coordinator Server IP (Default: 192.168.29.159): "
if "%SERVER_IP%"=="" set SERVER_IP=192.168.29.159

set /p NODE_NAME="Enter Your Worker Node Name (Default: LOQ_Vinu): "
if "%NODE_NAME%"=="" set NODE_NAME=LOQ_Vinu

echo.
echo Starting FedZero Worker Daemon...
echo Connecting to: http://%SERVER_IP%:8000
echo.

python fedzero_worker.py --server http://%SERVER_IP%:8000 --name %NODE_NAME%
pause
