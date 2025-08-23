# Testes da API Clinn

Este projeto utiliza Mocha, Chai e Supertest para testes automatizados, com relatórios HTML gerados pelo Mochawesome.

## Scripts Disponíveis

### `npm test`
Executa os testes com o reporter padrão (spec) no terminal.

### `npm run test:report`
Executa os testes e gera relatórios JSON e HTML individuais na pasta `reports/`.

### `npm run test:html`
Executa os testes e gera um relatório HTML combinado na pasta `reports/`.

## Estrutura dos Relatórios

Após executar `npm run test:html`, você encontrará na pasta `reports/`:

- `test-report.html` - Relatório HTML individual
- `test-report.json` - Dados JSON do relatório
- `combined-report.html` - Relatório HTML combinado (recomendado)
- `combined-report.json` - Dados JSON combinados
- `assets/` - Arquivos CSS, JS e imagens do relatório

## Visualizando os Relatórios

1. Abra o arquivo `reports/combined-report.html` em qualquer navegador
2. O relatório inclui:
   - Resumo dos testes executados
   - Detalhes de cada teste (pass/fail)
   - Estatísticas de tempo de execução
   - Filtros por status dos testes

## Configuração

O arquivo `.mocharc.js` contém as configurações do Mocha, incluindo:
- Timeout de 200 segundos
- Reporter padrão: spec
- Configurações do Mochawesome
- Carregamento automático das variáveis de ambiente

## Dependências de Desenvolvimento

- `mocha` - Framework de testes
- `chai` - Biblioteca de assertions
- `supertest` - Testes de API HTTP
- `mochawesome` - Gerador de relatórios HTML
- `mochawesome-merge` - Combina múltiplos relatórios
- `mochawesome-report-generator` - Gera relatórios finais

## Exemplo de Uso

```bash
# Executar testes básicos
npm test

# Gerar relatórios
npm run test:html

# Abrir relatório no navegador (macOS)
open reports/combined-report.html

# Abrir relatório no navegador (Linux)
xdg-open reports/combined-report.html
```
