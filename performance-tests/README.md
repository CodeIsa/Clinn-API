# 📊 Testes de Performance - Clinn API

Este diretório contém testes de performance implementados com **k6** para a Clinn API, seguindo uma estrutura organizada e profissional baseada em padrões da indústria.

## 🏗️ Estrutura do Projeto

```
performance-tests/
├── config/                 # Configurações dos testes
│   └── config.local.json  # Configuração local da API
├── fixtures/              # Dados de teste estáticos
│   └── testData.json     # Dados para cenários de teste
├── helpers/               # Funções auxiliares reutilizáveis
│   ├── autenticacao.js   # Helper para autenticação
│   └── endpoints.js      # Helper para gerenciar endpoints
├── tests/                 # Scripts de teste
│   ├── load-time.test.js # Teste de tempo de carregamento
│   └── response-time.test.js # Teste de tempo de resposta
├── utils/                 # Utilitários e constantes
│   └── variaveis.js      # Variáveis globais e configurações
├── k6.config.js          # Configuração global do k6
├── package.json          # Scripts NPM e dependências
├── run-tests.sh          # Script de execução automatizada
└── README.md             # Esta documentação
```

## 🎯 Objetivos dos Testes

### 1. Tempo de Carregamento
- **Requisito**: O sistema deve carregar dentro de 2 segundos para 95% dos usuários
- **Arquivo**: `tests/load-time.test.js`
- **Métrica**: `load_time_compliance` > 95%

### 2. Tempo de Resposta
- **Requisito**: O tempo médio de resposta para qualquer requisição deve ser inferior a 300ms em condições normais de rede
- **Arquivo**: `tests/response-time.test.js`
- **Métrica**: `http_req_duration` < 300ms (p95)

## 🚀 Como Executar

### Pré-requisitos
- [k6](https://k6.io/docs/getting-started/installation/) instalado
- Clinn API rodando em `http://localhost:3000`

### Instalação do k6

#### macOS
```bash
brew install k6
```

#### Linux
```bash
sudo apt-get install k6
```

#### Windows
```bash
choco install k6
```

### 🎯 Execução com Dashboard em Tempo Real (Recomendado)

#### Script Interativo
```bash
chmod +x run-tests.sh
./run-tests.sh
```

O script oferece 4 opções:
1. **Dashboard web** (recomendado) - Visualização em tempo real
2. **Modo silencioso** - Sem dashboard, apenas console
3. **Dashboard + relatório HTML** - Visualização + relatório completo
4. **Porta personalizada** - Dashboard em porta específica

#### Scripts NPM para Dashboard
```bash
# Teste de carregamento com dashboard
npm run test:dashboard

# Todos os testes com dashboard
npm run test:dashboard:all

# Teste com relatório HTML
npm run test:html

# Todos os testes com relatório HTML
npm run test:html:all

# Iniciar dashboard e abrir navegador
npm run start:dashboard
```

### 📊 Dashboard Web em Tempo Real

Quando executado com dashboard, o k6 inicia um servidor web local:

1. **Execute o teste com dashboard**:
   ```bash
   npm run test:dashboard
   ```

2. **Acesse o dashboard**:
   - Abra seu navegador
   - Acesse: `http://localhost:8080`
   - Visualize métricas em tempo real, gráficos e estatísticas

3. **Recursos do dashboard**:
   - Métricas em tempo real
   - Gráficos de performance
   - Estatísticas detalhadas
   - Histórico de execuções

### Execução Automática
```bash
chmod +x run-tests.sh
./run-tests.sh
```

### Scripts NPM Disponíveis
```bash
# Instalar dependências (se necessário)
npm install

# Testes básicos
npm run test:load          # Teste de tempo de carregamento
npm run test:response      # Teste de tempo de resposta
npm run test:all           # Todos os testes

# Testes com dashboard
npm run test:dashboard     # Com dashboard em tempo real
npm run test:dashboard:all # Todos os testes com dashboard
npm run test:html          # Com relatório HTML
npm run test:html:all      # Todos os testes com relatório HTML

# Relatórios e utilitários
npm run test:reports       # Gerar relatórios
npm run test:cloud         # Executar na nuvem k6
npm run clean              # Limpar relatórios
npm run setup              # Configurar estrutura de pastas

# Dashboard
npm run start:dashboard    # Iniciar dashboard
npm run open:dashboard     # Abrir dashboard no navegador
```

### Execução Manual

#### Execução Simples
```bash
# Teste de tempo de carregamento
k6 run tests/load-time.test.js

# Teste de tempo de resposta
k6 run tests/response-time.test.js

# Com saída JSON para análise
k6 run --out json=reports/results.json tests/load-time.test.js
```

#### Dashboard em Tempo Real
```bash
# Habilitar dashboard web em tempo real
K6_WEB_DASHBOARD=true k6 run tests/load-time.test.js

# Com URL personalizada da API
BASE_URL=https://sua-api.com K6_WEB_DASHBOARD=true k6 run tests/response-time.test.js

# Dashboard com configurações específicas
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_PORT=8080 k6 run tests/load-time.test.js

# Dashboard com relatório HTML
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=reports/performance-report.html k6 run tests/load-time.test.js
```

#### Exemplos Práticos
```bash
# Dashboard em tempo real para monitoramento
BASE_URL=https://sua-api.com K6_WEB_DASHBOARD=true k6 run tests/load-time.test.js

# Relatório HTML completo para análise
BASE_URL=https://sua-api.com K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html k6 run tests/load-time.test.js
```

## 🔧 Configuração

### Variáveis de Ambiente para Dashboard

O k6 oferece um dashboard web que pode ser habilitado através de variáveis de ambiente:

- **`K6_WEB_DASHBOARD`**: Habilita o dashboard web (true/false)
- **`K6_WEB_DASHBOARD_EXPORT`**: Define o arquivo de exportação HTML
- **`K6_WEB_DASHBOARD_PORT`**: Porta do dashboard (padrão: 8080)
- **`BASE_URL`**: URL base da API para testes

### config/config.local.json
Arquivo de configuração principal com:
- **Base URL** da API
- **Endpoints** disponíveis
- **Thresholds** de performance
- **Configurações** de teste

### utils/variaveis.js
Constantes e configurações globais:
- Headers padrão
- Timeouts
- Códigos de status
- Métricas personalizadas

### helpers/
Funções auxiliares reutilizáveis:
- **autenticacao.js**: Gerenciamento de tokens e autenticação (usa `http.post`)
- **endpoints.js**: Teste e validação de endpoints (usa `http.get`)

> **⚠️ Importante**: Todos os helpers agora usam as funções nativas do k6 (`http.get`, `http.post`) em vez de `fetch`, garantindo compatibilidade total com o ambiente de testes de performance.

## 📊 Relatórios

### Dashboard Web em Tempo Real

Quando `K6_WEB_DASHBOARD=true` é definido, o k6 inicia um servidor web local que permite monitorar os testes em tempo real:

1. **Inicie o teste com dashboard**:
   ```bash
   npm run test:dashboard
   ```

2. **Acesse o dashboard**:
   - Abra seu navegador
   - Acesse: `http://localhost:8080`
   - Visualize métricas em tempo real, gráficos e estatísticas

3. **Recursos do dashboard**:
   - Métricas em tempo real
   - Gráficos de performance
   - Estatísticas detalhadas
   - Histórico de execuções

### Relatórios HTML

Com `K6_WEB_DASHBOARD_EXPORT`, você pode gerar relatórios HTML completos:

```bash
npm run test:html
```

O relatório HTML inclui:
- Gráficos interativos
- Tabelas de métricas
- Análise de performance
- Comparações entre execuções

### Relatórios JSON

Os testes também geram relatórios em formato JSON para análise programática:

- **`reports/load-time-results.json`**: Resultados do teste de carregamento
- **`reports/response-time-results.json`**: Resultados do teste de resposta

### Exemplo de Saída JSON
```json
{
  "metrics": {
    "http_req_duration": {
      "p(95)": 245,
      "avg": 180
    },
    "load_time_compliance": {
      "rate": 0.97
    }
  }
}
```

## 🔍 Monitoramento

### Métricas Principais
- `http_req_duration`: Tempo de resposta das requisições
- `http_req_failed`: Taxa de erro
- `load_time_compliance`: Conformidade com tempo de carregamento
- `response_time_compliance`: Conformidade com tempo de resposta

### Thresholds Configurados
- **Tempo de Carregamento**: 95% das requisições < 2 segundos
- **Tempo de Resposta**: 95% das requisições < 300ms
- **Taxa de Erro**: < 1%

## 📈 Personalização

### Ajustar Configurações
Edite `config/config.local.json`:
```json
{
  "thresholds": {
    "loadTime": {
      "p95": 2000
    },
    "responseTime": {
      "p95": 300
    }
  }
}
```

### Adicionar Novos Endpoints
1. Adicione o endpoint em `config/config.local.json`
2. Implemente o teste em `helpers/endpoints.js` usando `http.get` ou `http.post`
3. Use o helper nos testes

### Criar Novos Testes
1. Crie arquivo em `tests/`
2. Importe os helpers necessários
3. Configure thresholds e cenários
4. Adicione script NPM em `package.json`

## 🔗 Integração com CI/CD

### GitHub Actions
```yaml
- name: Performance Tests
  run: |
    cd performance-tests
    npm run test:all
    npm run test:reports
```

### Jenkins
```groovy
stage('Performance Tests') {
  steps {
    sh 'cd performance-tests && npm run test:all'
    sh 'cd performance-tests && npm run test:reports'
  }
}
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **API não responde**
   - Verifique se a Clinn API está rodando
   - Confirme a URL em `config/config.local.json`

2. **Testes falham por timeout**
   - Ajuste os thresholds nos arquivos de configuração
   - Verifique a performance da API

3. **Erro de importação**
   - Verifique se os caminhos dos imports estão corretos
   - Confirme a estrutura de pastas

4. **Dashboard não abre**
   - Verifique se a porta 8080 está disponível
   - Use `K6_WEB_DASHBOARD_PORT` para porta alternativa
   - Confirme se `K6_WEB_DASHBOARD=true` está definido

## 📚 Recursos Adicionais

- [Documentação oficial do k6](https://k6.io/docs/)
- [Guia de métricas do k6](https://k6.io/docs/using-k6/metrics/)
- [Exemplos de testes](https://k6.io/docs/examples/)
- [Projeto de referência](https://github.com/CodeIsa/banco-api-performance)

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique esta documentação
2. Consulte a documentação oficial do k6
3. Verifique os logs de erro
4. Teste com configurações mais simples primeiro