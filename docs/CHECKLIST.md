# 📋 Checklist de Desenvolvimento

> **Atualizado em:** 2025-06-28 15:35:00  
> **Versão:** 3.0 - MCP-First & Otimizado

Este checklist é **OBRIGATÓRIO** para qualquer trabalho no projeto. Garante qualidade, consistência e rastreabilidade do desenvolvimento.

## **🚨 IMPORTANTE**: Use **APENAS Task Master MCP** - não use comandos CLI do terminal.

## 🎯 **1. Preparação & Início**

### 1.1 Task Master (MCP)

- [ ] **Visualizar tarefa**: Use MCP tool `get_task` para entender requisitos completos
- [ ] **Verificar dependências**: Confirmar que tarefas dependentes estão `done`
- [ ] **Marcar início**: Use MCP tool `set_task_status` → `in-progress`

### 1.2 Git & Branch

- [ ] **Verificar branch**: `git branch` para confirmar localização atual
- [ ] **Criar branch** (se necessário): `git checkout -b task/<numero>-<nome>`
- [ ] **Sincronizar**: `git pull origin main` antes de iniciar

**Importante**: qualquer iteração com o Task Master deve ser feita utilizando seu MCP, ao contrário do que foi dito nestas instruções. Novamente, jamais utilize os comandos de terminal, utilize o MCP.

---

## 🔍 **2. Desenvolvimento & QA Automática**

### 2.1 Ferramentas de Qualidade (Husky Automático)

O Husky executa automaticamente no commit:

- ✅ **Lint**: ESLint com verificação de código
- ✅ **TypeCheck**: TypeScript sem erros
- ✅ **Build**: Vite build de produção
- ✅ **Tests**: Vitest execution completa

### 2.2 Execução Manual (Durante Desenvolvimento)

```bash
npm run dev         # Desenvolvimento com hot reload
npm run test        # Testes em modo watch
npm run test:ui     # Interface visual do Vitest
npm run lint        # Verificação ESLint
npm run typecheck   # Verificação TypeScript
```

### 2.3 Estrutura de Testes Configurada

- **Vitest + jsdom**: Framework moderno e rápido
- **React Testing Library**: Testes focados no usuário
- **jest-dom matchers**: Matchers customizados para DOM
- **test-utils.tsx**: Render com providers configurados
- **28 testes** atualmente passando (100% auth coverage)

---

## 📝 **3. Implementação & Logging**

### 3.1 Padrões do Projeto

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS + Lucide Icons
- **Auth**: Supabase com session management
- **Routing**: React Router DOM v6 + ProtectedRoutes
- **State**: React Query + React Hook Form
- **Testing**: Vitest + Testing Library

### 3.2 Estrutura de Diretórios

```
src/
├── components/       # Componentes React + shadcn/ui
├── pages/           # Páginas da aplicação
├── hooks/           # Custom hooks (ex: use-auth.tsx)
├── lib/             # Utilitários (ex: supabase.ts)
└── test/            # Ambiente completo de testes
```

### 3.3 Logging de Progresso (MCP)

Durante desenvolvimento, use MCP tool `update_subtask`:

**Registrar:**

- Descobertas e problemas encontrados
- Decisões técnicas importantes
- Links para documentação relevante
- Status de implementação

**Exemplo**:

```
Implementação autenticação Supabase:
- JWT tokens com refresh automático implementado
- ProtectedRoute component criado e testado
- AuthProvider context configurado
- Problema: CORS resolvido com configuração Vite
- Ref: https://supabase.com/docs/guides/auth
```

---

## ✅ **4. Finalização & Commit**

### 4.1 Commit & Qualidade

- [ ] **Stage changes**: `git add -A`
- [ ] **Commit**: Husky executará QA automaticamente
- [ ] **Resolver erros**: Se QA falhar, corrigir antes de continuar
- [ ] **Commit message**: Usar conventional commits format

**Exemplo de commit**:

```bash
git commit -m "feat(auth): implement Supabase authentication

- Add JWT token management with auto-refresh
- Create ProtectedRoute component with loading states
- Implement AuthProvider context with user state
- Add comprehensive auth test coverage (28 tests)
- Configure Supabase client with error handling

Closes task 2.3"
```

### 4.2 Task Master Status (MCP)

- [ ] **Marcar concluído**: Use MCP tool `set_task_status` → `done`
- [ ] **Verificar tarefa pai**: Se todas subtarefas `done`, marcar tarefa pai
- [ ] **Push alterações**: `git push origin <branch-name>`

### 4.3 Documentação (Quando Aplicável)

- [ ] **Atualizar PROGRESS.md**: Log detalhado com timestamp
- [ ] **Incluir métricas**: Tests passing, build status, files changed
- [ ] **Hash do commit**: Para rastreabilidade

---

## 🚀 **5. Scripts & Ferramentas**

### 5.1 Scripts NPM Disponíveis

```bash
# Desenvolvimento
npm run dev              # Vite dev server
npm run build            # Production build
npm run build:dev        # Development build
npm run preview          # Preview production build

# Qualidade & Testes
npm run lint             # ESLint check
npm run typecheck        # TypeScript check
npm run test             # Vitest watch mode
npm run test:run         # Vitest single run
npm run test:ui          # Visual test interface
npm run test:coverage    # Coverage report
```

### 5.2 Task Master MCP Tools

- `get_task` - Visualizar detalhes da tarefa
- `get_tasks` - Listar tarefas por status
- `set_task_status` - Alterar status da tarefa
- `update_subtask` - Adicionar progresso/notas
- `next_task` - Encontrar próxima tarefa disponível

---

## 📚 **6. Recursos & Documentação**

### 6.1 Documentação Interna

- `docs/PRD.md` - Requisitos do produto
- `docs/PROGRESS.md` - Log histórico detalhado
- `docs/SUPABASE_SETUP.md` - Configuração de autenticação
- `src/test/README.md` - Guia do ambiente de testes

### 6.2 Referências Técnicas

- [Vite Documentation](https://vitejs.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Tailwind CSS](https://tailwindcss.com/)

---

## ⚡ **Fluxo Rápido**

Para desenvolvedores experientes, fluxo mínimo:

1. **MCP**: `get_task` → `set_task_status` (in-progress)
2. **Git**: `git checkout -b task/X-nome`
3. **Desenvolver**: Implementar + testar localmente
4. **MCP**: `update_subtask` com progresso
5. **Commit**: `git add -A && git commit -m "..."` (Husky QA automático)
6. **MCP**: `set_task_status` (done)
7. **Push**: `git push origin <branch>`

---

## 🔧 **Resolução de Problemas**

### QA Failures

- **Lint errors**: Corrigir erros obrigatoriamente (warnings OK)
- **TypeScript errors**: Resolver problemas de tipo
- **Test failures**: Todos os 28 testes devem passar
- **Build errors**: Build deve compilar sem erros

### Task Master Issues

- **Use MCP tools**: Nunca use comandos CLI
- **Verifique conexão**: Ensure MCP server está ativo
- **Dados estruturados**: MCP fornece melhor tratamento de erros

---

_Checklist v3.0 - Focado em MCP, QA automática e desenvolvimento eficiente_
