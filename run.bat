@echo off
echo Starting Bright Path Learning Centre App...

echo Starting Backend API (ASP.NET Core)...
start "BrightPath Backend API" cmd /k "cd /d %~dp0BE\BrightPathLessonManager && dotnet run --project BPLM.API"

echo Starting Frontend App (React / Vite)...
start "BrightPath Frontend App" cmd /k "cd /d %~dp0FE && npm run dev"

echo Backend and Frontend have been launched in separate terminal windows.
