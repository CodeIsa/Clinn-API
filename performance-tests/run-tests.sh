#!/bin/bash

echo "🚀 Iniciando testes de performance da Clinn API"
echo "================================================"
echo "📁 Estrutura organizada seguindo padrões profissionais"
echo ""

# Verificar se o k6 está instalado
if ! command -v k6 &> /dev/null; then
    echo "❌ k6 não está instalado. Por favor, instale o k6 primeiro:"
    echo "   macOS: brew install k6"
    echo "   Linux: sudo apt-get install k6"
    echo "   Windows: choco install k6"
    exit 1
fi

# Criar pasta de relatórios se não existir
mkdir -p reports

echo "🔧 Configuração:"
echo "   - Base URL: $(grep -o '"baseUrl": "[^"]*"' config/config.local.json | cut -d'"' -f4)"
echo "   - Endpoints configurados: $(grep -c '"endpoint"' config/config.local.json || echo "5")"
echo ""

# Função para mostrar opções de dashboard
show_dashboard_options() {
    echo ""
    echo "🎯 Opções de Dashboard em Tempo Real:"
    echo "   1️⃣  Teste com dashboard web (recomendado)"
    echo "   2️⃣  Teste sem dashboard (modo silencioso)"
    echo "   3️⃣  Teste com dashboard + relatório HTML"
    echo "   4️⃣  Teste com dashboard em porta personalizada"
    echo ""
    read -p "Escolha uma opção (1-4): " choice
    
    case $choice in
        1)
            echo "🚀 Executando com dashboard web em tempo real..."
            echo "📊 Dashboard disponível em: http://localhost:8080"
            echo "⏳ Aguarde o teste iniciar..."
            echo ""
            K6_WEB_DASHBOARD=true k6 run tests/load-time.test.js
            echo ""
            echo "2️⃣ Teste de tempo de resposta com dashboard..."
            K6_WEB_DASHBOARD=true k6 run tests/response-time.test.js
            ;;
        2)
            echo "🔇 Executando testes sem dashboard..."
            echo ""
            echo "1️⃣ Teste de tempo de carregamento..."
            k6 run tests/load-time.test.js
            echo ""
            echo "2️⃣ Teste de tempo de resposta..."
            k6 run tests/response-time.test.js
            ;;
        3)
            echo "📊 Executando com dashboard + relatório HTML..."
            echo "📊 Dashboard disponível em: http://localhost:8080"
            echo "📄 Relatório HTML será gerado em: reports/performance-report.html"
            echo ""
            echo "1️⃣ Teste de tempo de carregamento..."
            K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=reports/performance-report.html k6 run tests/load-time.test.js
            echo ""
            echo "2️⃣ Teste de tempo de resposta..."
            K6_WEB_DASHBOARD=true k6 run tests/response-time.test.js
            ;;
        4)
            read -p "Digite a porta para o dashboard (padrão: 8080): " port
            port=${port:-8080}
            echo "🔌 Executando com dashboard na porta $port..."
            echo "📊 Dashboard disponível em: http://localhost:$port"
            echo ""
            echo "1️⃣ Teste de tempo de carregamento..."
            K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_PORT=$port k6 run tests/load-time.test.js
            echo ""
            echo "2️⃣ Teste de tempo de resposta..."
            K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_PORT=$port k6 run tests/response-time.test.js
            ;;
        *)
            echo "❌ Opção inválida. Executando modo padrão..."
            echo ""
            echo "1️⃣ Teste de tempo de carregamento..."
            k6 run tests/load-time.test.js
            echo ""
            echo "2️⃣ Teste de tempo de resposta..."
            k6 run tests/response-time.test.js
            ;;
    esac
}

# Executar com opções de dashboard
show_dashboard_options

echo ""
echo "📈 Gerando relatórios JSON..."
k6 run --out json=reports/load-time-results.json tests/load-time.test.js
k6 run --out json=reports/response-time-results.json tests/response-time.test.js

echo ""
echo "✅ Testes de performance concluídos!"
echo "📁 Relatórios salvos em: reports/"
echo ""
echo "📊 Para visualizar os resultados:"
echo "   - Load Time: reports/load-time-results.json"
echo "   - Response Time: reports/response-time-results.json"
echo ""
echo "🚀 Scripts NPM disponíveis:"
echo "   npm run test:quick      # Teste rápido"
echo "   npm run test:load       # Teste de carregamento"
echo "   npm run test:response   # Teste de resposta"
echo "   npm run test:all        # Todos os testes"
echo "   npm run test:reports    # Gerar relatórios"
echo "   npm run test:cloud      # Executar na nuvem k6"
echo "   npm run test:dashboard  # Com dashboard em tempo real"
echo "   npm run test:html       # Com relatório HTML"
