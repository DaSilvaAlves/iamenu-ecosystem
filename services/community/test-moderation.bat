@echo off
chcp 65001 >nul
echo.
echo ================================================
echo   TESTE DO SISTEMA DE MODERAÇÃO
echo ================================================
echo.

REM Passo 1: Gerar token de admin
echo [1/5] Gerando token de admin...
curl -s http://localhost:3001/api/v1/community/auth/test-token > temp_token.json 2>nul
echo ✓ Token gerado!
echo.

REM Extrair token (simplificado - mostra tudo)
echo Token completo:
type temp_token.json
echo.
echo.

REM Guardar token numa variável (extrair manualmente do JSON)
echo ================================================
echo.
echo PRÓXIMO PASSO: Copie o token acima
echo Procure por: "token":"..."
echo.
echo Depois execute:
echo   SET ADMIN_TOKEN=SEU_TOKEN_AQUI
echo.
echo Quando tiver o token, execute os comandos abaixo:
echo.
echo ================================================
echo.

REM Passo 2: Listar posts (para obter um ID)
echo [2/5] Comando para listar posts:
echo curl -H "Authorization: Bearer %%ADMIN_TOKEN%%" http://localhost:3001/api/v1/community/posts
echo.

REM Passo 3: Listar reports
echo [3/5] Comando para listar reports:
echo curl -H "Authorization: Bearer %%ADMIN_TOKEN%%" http://localhost:3001/api/v1/community/reports
echo.

REM Passo 4: Criar report
echo [4/5] Comando para criar report (substitua POST_ID):
echo curl -X POST http://localhost:3001/api/v1/community/reports -H "Authorization: Bearer %%ADMIN_TOKEN%%" -H "Content-Type: application/json" -d "{\"targetType\":\"post\",\"targetId\":\"POST_ID\",\"reason\":\"spam\",\"details\":\"Teste de report\"}"
echo.

REM Passo 5: Listar reports novamente
echo [5/5] Depois de criar, liste reports novamente:
echo curl -H "Authorization: Bearer %%ADMIN_TOKEN%%" http://localhost:3001/api/v1/community/reports
echo.

echo ================================================
echo Script concluído!
echo ================================================
echo.

del temp_token.json 2>nul
pause
