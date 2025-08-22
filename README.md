## Clinn API

API Rest para um sistema de agendamento inteligente de consultas, com armazenamento em memória, autenticação JWT, controle de acesso por roles e documentação Swagger.

### Requisitos atendidos
- RF01: Cadastro de usuários (paciente e médico)
- RF02: Autenticação via email/senha com JWT
- RF03: Criação de consultas em horários disponíveis (status "Agendada")
- RF04: Edição (remarcação) de consultas
- RF05: Cancelamento de consultas (status "Cancelada")
- RF06: Definição/edição/remoção de disponibilidade pelo médico
- RF07: Visualização de disponibilidade por pacientes
- RF08: Stub de integração com Google Calendar
- RNF01-03: Uso de Express, armazenamento em memória e endpoints simples

### Endpoints principais
- Auth: `/api/auth/register`, `/api/auth/login`
- Usuários: `/api/users/me`
- Disponibilidade (médicos): `POST /api/availability`, `PUT /api/availability/:id`, `DELETE /api/availability/:id`, `GET /api/availability`
- Consultas (pacientes): `POST /api/appointments`, `PUT /api/appointments/:id`, `DELETE /api/appointments/:id`, `GET /api/appointments`

### Roles e Acesso
- Médicos: podem gerenciar suas disponibilidades e listar suas consultas
- Pacientes: podem visualizar disponibilidade de um médico, criar/remarcar/cancelar suas consultas e listar suas consultas

### Swagger
- URL: `http://localhost:3000/api-docs`

### Executando localmente
1. Node 18+
2. Instale dependências: `npm install`
3. Crie um arquivo `.env` se desejar customizar PORT/JWT_SECRET
4. Rode em dev: `npm run dev` (ou `npm start`)

### Notas
- Armazenamento em memória; reiniciar o servidor limpa os dados
- Integração Google Calendar é um stub, sem OAuth configurado

## 🚀 GitHub Actions

O projeto inclui workflows automatizados do GitHub Actions que executam:

### 🧪 Testes de API
- Execução automática em PRs e pushes para `main`/`develop`
- Testes com Mocha e Supertest em múltiplas versões do Node.js
- Geração de relatórios HTML com Mochawesome
- Comentários automáticos no PR com resultados

### 🚀 Testes de Performance
- Execução automática em PRs e pushes para `main`/`develop`
- Testes de carga e tempo de resposta com k6
- Geração de relatórios HTML personalizados
- Comentários automáticos no PR com resultados

### 🔄 Workflow Combinado
- Executa ambos os tipos de teste em paralelo
- Job de resumo que comenta no PR com status geral
- Otimização de tempo de execução

**Para mais detalhes:** [Documentação dos Workflows](.github/README.md)


