# 🏥 Clinn API - Automação de Testes e Performance

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Mocha](https://img.shields.io/badge/Mocha-11.7.1-yellow.svg)](https://mochajs.org/)
[![k6](https://img.shields.io/badge/k6-Performance-blue.svg)](https://k6.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Projeto de automação de testes de API e performance para o sistema de agendamento inteligente de consultas (Clinn)

## 📋 Índice

- [🎯 Objetivo](#-objetivo)
- [🛠️ Stack Tecnológica](#️-stack-tecnológica)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [⚙️ Configuração](#️-configuração)
- [🚀 Execução dos Testes](#-execução-dos-testes)
- [📊 Relatórios](#-relatórios)
- [🔗 Documentação das Dependências](#-documentação-das-dependências)

## 🎯 Objetivo

Este projeto implementa uma suite completa de testes automatizados para a **Clinn API**, um sistema de agendamento inteligente de consultas. O objetivo é garantir a qualidade, confiabilidade e performance da API através de:

- **Testes Funcionais**: Validação de endpoints, autenticação, CRUD de usuários, agendamentos e disponibilidade
- **Testes de Performance**: Análise de tempo de resposta, carga e escalabilidade
- **Relatórios Automatizados**: Geração de relatórios HTML e JSON para análise de resultados

## 🛠️ Stack Tecnológica

### Testes Funcionais
- **Mocha** (11.7.1) - Framework de testes JavaScript
- **Chai** (4.3.10) - Biblioteca de assertions
- **Supertest** (7.1.4) - Testes de API HTTP
- **Mochawesome** (7.1.3) - Gerador de relatórios HTML
- **Mochawesome-merge** (5.0.0) - Combinação de relatórios
- **Mochawesome-report-generator** (6.2.0) - Geração de relatórios finais

### Testes de Performance
- **k6** - Framework de testes de performance e carga
- **Dashboard Web** - Visualização em tempo real dos testes

### API (Dependências)
- **Express** (4.19.2) - Framework web
- **bcryptjs** (2.4.3) - Hash de senhas
- **jsonwebtoken** (9.0.2) - Autenticação JWT
- **cors** (2.8.5) - Cross-Origin Resource Sharing
- **dotenv** (16.4.5) - Variáveis de ambiente
- **morgan** (1.10.0) - Logger de requisições
- **swagger-jsdoc** (6.2.8) - Documentação da API
- **swagger-ui-express** (5.0.1) - Interface da documentação
- **googleapis** (131.0.0) - Integração com Google Calendar
- **uuid** (9.0.1) - Geração de IDs únicos

## 📁 Estrutura do Projeto

```
Clinn-API/
├── 📁 src/                          # Código fonte da API
│   ├── 📁 routes/                   # Rotas da API
│   │   ├── auth.routes.js          # Autenticação
│   │   ├── user.routes.js          # Usuários
│   │   ├── availability.routes.js  # Disponibilidade
│   │   └── appointment.routes.js   # Agendamentos
│   ├── 📁 middlewares/             # Middlewares
│   │   └── auth.js                 # Autenticação JWT
│   ├── 📁 services/                # Serviços
│   │   └── calendar.service.js     # Integração Google Calendar
│   ├── 📁 docs/                    # Documentação
│   │   └── swagger.js              # Configuração Swagger
│   ├── 📁 data/                    # Dados
│   │   └── store.js                # Armazenamento em memória
│   ├── app.js                      # Configuração Express
│   └── server.js                   # Servidor
├── 📁 test/                        # Testes funcionais
│   ├── login.test.js              # Testes de login
│   ├── register.test.js           # Testes de registro
│   ├── users.test.js              # Testes de usuários
│   ├── appointments.test.js       # Testes de agendamentos
│   ├── availability.test.js       # Testes de disponibilidade
│   └── TEST_README.md             # Documentação dos testes
├── 📁 performance-tests/           # Testes de performance
│   ├── 📁 config/                 # Configurações
│   ├── 📁 fixtures/               # Dados de teste
│   ├── 📁 helpers/                # Funções auxiliares
│   │   ├── autenticacao.js       # Helper de autenticação
│   │   └── endpoints.js          # Helper de endpoints
│   ├── 📁 tests/                  # Scripts de teste
│   │   ├── load-time.test.js     # Teste de tempo de carregamento
│   │   └── response-time.test.js # Teste de tempo de resposta
│   ├── 📁 utils/                  # Utilitários
│   │   └── variaveis.js          # Variáveis globais
│   ├── 📁 reports/                # Relatórios de performance
│   ├── k6.config.js              # Configuração k6
│   ├── run-tests.sh              # Script de execução
│   └── README.md                 # Documentação performance
├── 📁 reports/                    # Relatórios de testes funcionais
├── 📁 Documents/                  # Documentação do projeto
├── package.json                   # Dependências e scripts
└── README.md                      # Este arquivo
```

## ⚙️ Configuração

### 1. Instalação das Dependências

```bash
# Instalar dependências da API
npm install

# Instalar dependências dos testes de performance (se necessário)
cd performance-tests
npm install
```

### 2. Configuração do Arquivo .env

Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Autenticação JWT
JWT_SECRET=sua_chave_secreta_jwt_aqui

# Google Calendar (opcional)
GOOGLE_CLIENT_ID=seu_client_id_google
GOOGLE_CLIENT_SECRET=seu_client_secret_google
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### 3. Instalação do k6 (para testes de performance)

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

## 🚀 Execução dos Testes

### Testes Funcionais

```bash
# Executar todos os testes
npm test

# Executar testes com relatório HTML
npm run test:html

# Executar testes com relatório individual
npm run test:report
```

### Testes de Performance

```bash
# Navegar para o diretório de performance
cd performance-tests

# Executar teste de tempo de carregamento
npm run test:load

# Executar teste de tempo de resposta
npm run test:response

# Executar todos os testes de performance
npm run test:all

# Executar com dashboard web em tempo real
npm run test:dashboard

# Executar com relatório HTML
npm run test:html

# Usar script interativo
chmod +x run-tests.sh
./run-tests.sh
```

### Execução Manual do k6

```bash
# Teste básico
k6 run tests/load-time.test.js

# Com dashboard web
K6_WEB_DASHBOARD=true k6 run tests/load-time.test.js

# Com relatório JSON
k6 run --out json=reports/results.json tests/load-time.test.js
```

## 📊 Relatórios

### Testes Funcionais (Mochawesome)

Após executar `npm run test:html`, os relatórios estarão disponíveis em `reports/`:

- **`combined-report.html`** - Relatório HTML combinado (recomendado)
- **`test-report.html`** - Relatório HTML individual
- **`combined-report.json`** - Dados JSON combinados
- **`test-report.json`** - Dados JSON individuais
- **`assets/`** - Arquivos CSS, JS e imagens

### Testes de Performance (k6)

#### Dashboard Web em Tempo Real
- **URL**: `http://localhost:8080`
- **Recursos**: Métricas em tempo real, gráficos, estatísticas detalhadas

#### Relatórios HTML
- **Localização**: `performance-tests/reports/performance-report.html`
- **Recursos**: Gráficos interativos, tabelas de métricas, análise de performance

#### Relatórios JSON
- **`load-time-results.json`** - Resultados do teste de carregamento
- **`response-time-results.json`** - Resultados do teste de resposta

### Visualização dos Relatórios

```bash
# Abrir relatório funcional (macOS)
open reports/combined-report.html

# Abrir relatório funcional (Linux)
xdg-open reports/combined-report.html

# Abrir relatório de performance
open performance-tests/reports/performance-report.html
```

## 🔗 Documentação das Dependências

### Testes Funcionais
- **[Mocha](https://mochajs.org/)** - Framework de testes JavaScript
- **[Chai](https://www.chaijs.com/)** - Biblioteca de assertions
- **[Supertest](https://github.com/visionmedia/supertest)** - Testes de API HTTP
- **[Mochawesome](https://github.com/adamgruber/mochawesome)** - Gerador de relatórios HTML
- **[Mochawesome-merge](https://github.com/antontelesh/mochawesome-merge)** - Combinação de relatórios
- **[Mochawesome-report-generator](https://github.com/adamgruber/mochawesome-report-generator)** - Geração de relatórios finais

### Testes de Performance
- **[k6](https://k6.io/docs/)** - Framework de testes de performance
- **[k6 Dashboard](https://k6.io/docs/using-k6/k6-options/reference/#web-dashboard)** - Dashboard web em tempo real

### API
- **[Express](https://expressjs.com/)** - Framework web para Node.js
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js/)** - Hash de senhas
- **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)** - Autenticação JWT
- **[CORS](https://github.com/expressjs/cors)** - Cross-Origin Resource Sharing
- **[dotenv](https://github.com/motdotla/dotenv)** - Variáveis de ambiente
- **[Morgan](https://github.com/expressjs/morgan)** - Logger de requisições HTTP
- **[Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc)** - Documentação da API
- **[Swagger UI Express](https://github.com/scottie1984/swagger-ui-express)** - Interface da documentação
- **[Google APIs](https://github.com/googleapis/google-api-nodejs-client)** - Integração com Google Calendar
- **[UUID](https://github.com/uuidjs/uuid)** - Geração de IDs únicos

## 📈 Métricas de Performance

### Thresholds Configurados
- **Tempo de Carregamento**: 95% das requisições < 2 segundos
- **Tempo de Resposta**: 95% das requisições < 300ms
- **Taxa de Erro**: < 1%

### Métricas Monitoradas
- `http_req_duration` - Tempo de resposta das requisições
- `http_req_failed` - Taxa de erro
- `load_time_compliance` - Conformidade com tempo de carregamento
- `response_time_compliance` - Conformidade com tempo de resposta

## 🚨 Troubleshooting

### Problemas Comuns

1. **API não responde**
   - Verifique se a API está rodando: `npm start`
   - Confirme a URL em `performance-tests/config/config.local.json`

2. **Testes falham por timeout**
   - Ajuste os thresholds nos arquivos de configuração
   - Verifique a performance da API

3. **Dashboard não abre**
   - Verifique se a porta 8080 está disponível
   - Use `K6_WEB_DASHBOARD_PORT` para porta alternativa
   - Confirme se `K6_WEB_DASHBOARD=true` está definido

4. **Erro de importação**
   - Verifique se os caminhos dos imports estão corretos
   - Confirme a estrutura de pastas

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ para o portfólio de automação de testes**


