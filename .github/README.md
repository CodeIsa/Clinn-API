# 🚀 GitHub Actions Workflows

Este diretório contém os workflows do GitHub Actions para automatizar testes e validações no projeto Clinn-API.

## 📋 Workflows Disponíveis

### 1. 🧪 API Tests (`api-tests.yml`)
Executa testes de API usando Mocha e Supertest.

**Triggers:**
- Pull Request para `main` ou `develop`
- Push para `main` ou `develop`

**Funcionalidades:**
- Testa em múltiplas versões do Node.js (18.x, 20.x)
- Gera relatórios HTML com Mochawesome
- Faz upload dos relatórios como artifacts
- Comenta no PR com resultados dos testes

### 2. 🚀 Performance Tests (`performance-tests.yml`)
Executa testes de performance usando k6.

**Triggers:**
- Pull Request para `main` ou `develop`
- Push para `main` ou `develop`

**Funcionalidades:**
- Instala e configura k6 automaticamente
- Executa testes de carga e tempo de resposta
- Gera relatórios HTML personalizados
- Faz upload dos resultados como artifacts
- Comenta no PR com resultados dos testes

### 3. 🔄 Combined Tests (`combined-tests.yml`)
Executa ambos os tipos de teste em paralelo para otimizar tempo.

**Triggers:**
- Pull Request para `main` ou `develop`
- Push para `main` ou `develop`

**Funcionalidades:**
- Executa testes de API e performance simultaneamente
- Job de resumo que comenta no PR com status geral
- Melhor performance que executar workflows separadamente

## 🎯 Como Usar

### Execução Automática
Os workflows são executados automaticamente quando:
- Um PR é criado ou atualizado
- Código é enviado para as branches `main` ou `develop`

### Execução Manual
Para executar manualmente:
1. Vá para a aba "Actions" no GitHub
2. Selecione o workflow desejado
3. Clique em "Run workflow"
4. Escolha a branch e clique em "Run workflow"

## 📊 Resultados e Relatórios

### Artifacts
- **API Tests:** Relatórios HTML e JSON dos testes Mocha
- **Performance Tests:** Relatórios HTML e JSON dos testes k6
- **Retenção:** 30 dias

### Comentários no PR
Cada workflow comenta automaticamente no PR com:
- Status dos testes (✅ PASSED / ❌ FAILED)
- Links para os workflows
- Resumo dos resultados
- Informações sobre thresholds de performance

## ⚙️ Configuração

### Variáveis de Ambiente
Os workflows criam automaticamente:
```bash
NODE_ENV=test
JWT_SECRET=test-secret-key
PORT=3000 (performance) / 3001 (API)
```

### Dependências
- **Node.js:** 18.x e 20.x
- **k6:** Instalado automaticamente via apt
- **NPM:** Cache habilitado para otimização

## 🔧 Personalização

### Modificar Triggers
Edite a seção `on` em cada workflow:
```yaml
on:
  pull_request:
    branches: [ main, develop, feature/* ]  # Adicione suas branches
  push:
    branches: [ main, develop ]
```

### Adicionar Novos Testes
1. Crie novos arquivos de teste
2. Adicione scripts no `package.json`
3. Atualize os workflows para executar os novos testes

### Modificar Thresholds de Performance
Edite `performance-tests/k6.config.js`:
```javascript
thresholds: {
  http_req_duration: ['p(95)<500'], // 95% < 500ms
  http_req_failed: ['rate<0.05'],   // Error rate < 5%
}
```

## 🚨 Troubleshooting

### Testes Falhando
1. Verifique os logs do workflow
2. Confirme se as dependências estão corretas
3. Valide se as variáveis de ambiente estão configuradas

### k6 Não Instala
O workflow inclui instalação automática do k6. Se houver problemas:
1. Verifique os logs de instalação
2. Confirme se o repositório k6 está acessível
3. Considere usar uma imagem Docker com k6 pré-instalado

### Timeout nos Testes
1. Aumente o timeout no `.mocharc.js`
2. Verifique se a API está respondendo corretamente
3. Considere otimizar os testes para serem mais rápidos

## 📚 Recursos Adicionais

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [k6 Documentation](https://k6.io/docs/)
- [Mocha Documentation](https://mochajs.org/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
