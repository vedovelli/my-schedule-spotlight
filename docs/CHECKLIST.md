# 📋 Checklist de Desenvolvimento Obrigatório

> **Atualizado em:** 2025-06-28 11:59:40  
> **Versão:** 2.0 - Checklist Aprimorado com Automação

Este checklist é **OBRIGATÓRIO** para qualquer tipo de trabalho no projeto. Seguir estas diretrizes garante qualidade, consistência e rastreabilidade do desenvolvimento.

**Importante**: qualquer iteração com o Task Master deve ser feita utilizando seu MCP, ao contrário do que foi dito nestas instruções. Novamente, jamais utilize os comandos de terminal, utilize o MCP.

---

## 🎯 **1. Preparação Inicial (Antes de Iniciar)**

### 1.1 Task Master & Planejamento

- [ ] **Revisar detalhes da tarefa**: Execute `task-master show <id>` para entender completamente os requisitos
- [ ] **Verificar dependências**: Confirmar que todas as dependências da tarefa estão marcadas como `done`

### 1.2 Git & Branch Management

- [ ] **Verificar branch atual**: Execute `git branch` para confirmar branch
- [ ] **Criar novo branch** (se primeira subtarefa): Use template `task/<task-number>-<task-name>`
  ```bash
  git checkout -b task/15-user-authentication
  ```
- [ ] **Sincronizar com remote**: Execute `git pull origin main` antes de iniciar

### 1.3 Estado da Tarefa

- [ ] **Marcar subtarefa como in-progress**: `task-master set-status --id=<subtask-id> --status=in-progress`
- [ ] **Marcar tarefa pai como in-progress** (se aplicável): `task-master set-status --id=<task-id> --status=in-progress`

---

## 🔍 **2. Quality Assurance (QA) - Automático via Husky**

> **✨ Novidade:** Husky configurado para execução automática no pre-commit!

### 2.1 Execução Manual (Durante Desenvolvimento)

Execute as ferramentas de QA periodicamente durante o desenvolvimento:

```bash
npm run lint        # ESLint - Verificação de código
npm run typecheck   # TypeScript - Verificação de tipos
npm run build       # Vite - Build de produção
npm run test:run    # Vitest - Execução completa dos testes
```

### 2.2 Execução Automática (Pre-commit)

- [ ] **Husky configurado**: Pre-commit hook executa automaticamente todas as ferramentas de QA
- [ ] **Resolver erros obrigatoriamente**: Commits são bloqueados se houver erros
- [ ] **Warnings permitidos**: Conforme especificação do projeto (principalmente react-refresh)

### 2.3 Ferramentas Adicionais Disponíveis

```bash
npm run test        # Modo watch para desenvolvimento
npm run test:ui     # Interface visual do Vitest
npm run test:coverage  # Relatório de cobertura
npm run preview     # Preview da build de produção
```

---

## 🧪 **3. Testes & Validação**

### 3.1 Ambiente de Testes Configurado

- [ ] **Vitest + jsdom**: Framework de testes moderno e rápido
- [ ] **React Testing Library**: Testes focados no comportamento do usuário
- [ ] **jest-dom matchers**: Matchers customizados para DOM
- [ ] **Mocks configurados**: React Router e React Query providers

### 3.2 Estratégia de Testes

- [ ] **Testar comportamento**: Foco no que o usuário vê e faz
- [ ] **Evitar testes de implementação**: Não testar detalhes internos
- [ ] **Usar test-utils.tsx**: Render customizado com providers
- [ ] **Mocks inline**: Definir mocks diretamente nos arquivos de teste

### 3.3 Cobertura Atual

- **Componentes de autenticação**: 100% cobertos (28 testes)
- **Funções utilitárias**: A implementar conforme necessário
- **Integração**: Considerar testes E2E futuros

---

## 📝 **4. Implementação & Desenvolvimento**

### 4.1 Estrutura do Projeto

```
src/
├── components/        # Componentes React + shadcn/ui
├── pages/            # Páginas da aplicação
├── hooks/            # Custom hooks
├── lib/              # Utilitários e configurações
└── test/             # Ambiente de testes completo
```

### 4.2 Tecnologias & Ferramentas

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS + Lucide Icons
- **Routing**: React Router DOM v6
- **State**: React Query + React Hook Form
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint + TypeScript ESLint

### 4.3 Padrões de Código

- [ ] **TypeScript**: Configuração flexível (strict: false para desenvolvimento rápido)
- [ ] **Componentes**: Usar shadcn/ui como base
- [ ] **Styling**: Tailwind CSS com design system consistente
- [ ] **Forms**: React Hook Form + Zod para validação
- [ ] **Icons**: Lucide React (biblioteca padrão)

---

## 📊 **5. Logging & Progresso**

### 5.1 Task Master Updates

- [ ] **Log de progresso**: Use `task-master update-subtask --id=<id> --prompt="..."` para registrar:
  - Descobertas durante implementação
  - Problemas encontrados e soluções
  - Decisões técnicas importantes
  - Links para documentação relevante

### 5.2 Exemplo de Update

```bash
task-master update-subtask --id=15.2 --prompt="
Implementação do JWT auth concluída:
- Configurado interceptor do axios para tokens
- Implementado refresh automático
- Adicionados testes para fluxo completo
- Problema: CORS issues resolvidos com proxy Vite
- Referência: https://vitejs.dev/config/server-options.html#server-proxy
"
```

---

## ✅ **6. Finalização (Ao Concluir Subtarefa)**

### 6.1 Commit & Git

- [ ] **Staging completo**: `git add --all` (Husky executará QA automaticamente)
- [ ] **Commit descritivo**: Seguir padrão conventional commits

  ```bash
  git commit -m "feat(auth): implement JWT authentication system

  - Add JWT token management with refresh
  - Implement protected route guards
  - Add comprehensive auth tests
  - Configure axios interceptors

  Closes subtask 15.2"
  ```

### 6.2 Task Master Status

- [ ] **Marcar subtarefa como done**: `task-master set-status --id=<subtask-id> --status=done`
- [ ] **Verificar tarefa pai**: Se todas as subtarefas estão concluídas, marcar tarefa pai como `done`

### 6.3 Documentação Histórica

- [ ] **Atualizar PROGRESS.md**: Registro detalhado com timestamp usando `date`
  ```bash
  # Obter timestamp correto
  date
  # Adicionar entrada detalhada no docs/PROGRESS.md
  ```

### 6.4 Conteúdo do Log de Progresso

Incluir no `docs/PROGRESS.md`:

- **Timestamp correto** (usar `date` no bash)
- **Resumo da implementação**
- **Decisões técnicas importantes**
- **Problemas encontrados e soluções**
- **Arquivos modificados/criados**
- **Métricas de QA** (testes passando, build status)
- **Próximos passos identificados**
- **Hash do commit** e mensagem

---

## 🚀 **7. Próximos Passos & Continuidade**

### 7.1 Preparação para Próxima Tarefa

- [ ] **Push das alterações**: `git push origin <branch-name>`
- [ ] **Considerar PR**: Se tarefa pai completa, criar Pull Request

### 7.2 Manutenção Contínua

- [ ] **Monitorar warnings**: Revisar periodicamente warnings do linter
- [ ] **Atualizar dependências**: Usar `npm audit` para segurança
- [ ] **Expandir testes**: Adicionar cobertura conforme necessário

---

## 🛠️ **8. Ferramentas de Apoio**

### 8.1 Task Master MCP (Recomendado)

- Integração nativa com Cursor
- Performance superior ao CLI
- Dados estruturados e melhor tratamento de erros

### 8.2 Task Master CLI (Fallback)

```bash
# Comandos essenciais
task-master show <id>              # Detalhes da tarefa
task-master set-status --id=<id> --status=done
task-master update-subtask --id=<id> --prompt="..."
```

### 8.3 Scripts NPM Úteis

```bash
npm run dev         # Desenvolvimento com hot reload
npm run build:dev   # Build em modo desenvolvimento
npm run preview     # Preview da build
```

---

## 📚 **9. Recursos & Documentação**

### 9.1 Documentação Interna

- `docs/PRD.md` - Requisitos do produto
- `docs/PROGRESS.md` - Log histórico detalhado
- `src/test/README.md` - Guia do ambiente de testes

### 9.2 Referências Externas

- [Vite Documentation](https://vitejs.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## ⚠️ **Importante: Automação vs. Manual**

- **✅ Automático (Husky)**: QA tools executam automaticamente no commit
- **🔄 Manual**: Task Master updates, status changes, documentation
- **🎯 Foco**: Qualidade garantida, desenvolvimento eficiente, rastreabilidade completa

---

_Checklist v2.0 - Atualizado com base na implementação do Husky e estrutura completa do projeto_
