@echo off
REM Só para ESTA janela de terminal

REM Vai para a pasta do projeto
cd /d "D:\desenv\interface-prompt"

REM Define o CODEX_HOME apenas neste processo (sem mexer em nada global)
set "CODEX_HOME=%CD%\.codex"

REM Chama o Codex CLI REAL (caminho que apareceu no where codex)
"C:\nvm4w\nodejs\codex.cmd" --yolo --sandbox workspace-write