# 📅 My Schedule Spotlight

> **Aplicativo de Agendamentos Pessoais** - Uma aplicação web moderna inspirada no Calendly para gerenciamento de agendamentos pessoais com foco em simplicidade e excelente experiência do usuário.

## 🎯 Sobre o Projeto

Este projeto foi desenvolvido durante um workshop e implementa um sistema completo de agendamentos onde usuários podem:

- ✅ Criar tipos de eventos personalizados
- ⏰ Definir disponibilidades por dia da semana
- 🔗 Compartilhar links públicos para agendamento
- 📊 Visualizar estatísticas no dashboard
- 🔐 Sistema de autenticação completo

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** com TypeScript
- **Vite** - Build tool moderna e rápida
- **React Router** - Roteamento SPA
- **TailwindCSS** - Estilização utility-first
- **Shadcn/ui** - Biblioteca de componentes
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Tanstack Query** - Gerenciamento de estado do servidor

### Backend & Banco de Dados
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Edge Functions
  - Real-time subscriptions

### Ferramentas de Desenvolvimento
- **ESLint + Prettier** - Linting e formatação
- **Husky** - Git hooks
- **Vitest** - Framework de testes
- **React Testing Library** - Testes de componentes

## 🚀 Guia de Instalação Completo

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **npm** ou **yarn** (gerenciador de pacotes)
- **Git** - [Download](https://git-scm.com/)

Para verificar se estão instalados:
```bash
node --version
npm --version
git --version
```

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/my-schedule-spotlight.git
cd my-schedule-spotlight
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configuração do Supabase

#### 3.1. Criar uma Conta no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma conta gratuita

#### 3.2. Criar um Novo Projeto

1. No dashboard do Supabase, clique em "New Project"
2. Escolha uma organização
3. Preencha:
   - **Project Name**: `my-schedule-spotlight`
   - **Database Password**: Crie uma senha forte (anote!)
   - **Region**: Escolha a mais próxima (ex: South America)
4. Clique em "Create new project"

⏳ **Aguarde alguns minutos** para o projeto ser criado.

#### 3.3. Executar as Migrações do Banco

1. No painel do Supabase, vá em **SQL Editor**
2. Copie o conteúdo do arquivo `schema/001_initial_schema.sql` do projeto
3. Cole no editor SQL e execute

### 4. Configuração das Variáveis de Ambiente

#### 4.1. Obter as Credenciais do Supabase

1. No dashboard do seu projeto Supabase
2. Vá em **Settings** → **API**
3. Copie os valores:
   - **Project URL**
   - **anon/public key**

#### 4.2. Criar o Arquivo `.env`

Na raiz do projeto, crie um arquivo `.env` com:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=sua_project_url_aqui
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

**⚠️ Importante:** Substitua pelos valores reais copiados do Supabase.

#### Exemplo:
```bash
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Executar a Aplicação

```bash
npm run dev
```

🎉 **Pronto!** A aplicação estará rodando em [http://localhost:5173](http://localhost:5173)

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build e Deploy
npm run build        # Build para produção
npm run preview      # Preview do build local

# Qualidade de Código
npm run lint         # Executa ESLint
npm run lint:fix     # Corrige problemas do ESLint automaticamente
npm run format       # Formata código com Prettier
npm run typecheck    # Verifica tipos TypeScript

# Testes
npm run test         # Executa testes em modo watch
npm run test:run     # Executa todos os testes
npm run test:ui      # Interface gráfica dos testes
npm run test:coverage # Relatório de cobertura

# Verificação Completa
npm run qa           # Executa typecheck + lint + format + tests
```

## 🗂️ Estrutura do Projeto

```
my-schedule-spotlight/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/        # Componentes React
│   │   ├── ui/           # Componentes base (Shadcn/ui)
│   │   ├── BookingPage.tsx
│   │   ├── EventCreator.tsx
│   │   └── EventList.tsx
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilitários e configurações
│   │   ├── supabase.ts   # Cliente Supabase
│   │   ├── api.ts        # Funções da API
│   │   └── utils.ts      # Utilitários gerais
│   ├── pages/            # Páginas da aplicação
│   ├── test/             # Arquivos de teste
│   └── main.tsx          # Ponto de entrada
├── schema/               # Scripts SQL do banco
├── docs/                 # Documentação
└── supabase/             # Configurações Supabase
```

## 🔐 Funcionalidades Implementadas

### Autenticação
- ✅ Cadastro de usuários
- ✅ Login/Logout
- ✅ Recuperação de senha
- ✅ Rotas protegidas

### Gerenciamento de Eventos
- ✅ Criar tipos de eventos
- ✅ Definir disponibilidades por dia da semana
- ✅ Visualizar eventos criados
- ✅ Dashboard com estatísticas

### Sistema de Agendamentos
- ✅ Página pública de agendamento
- ✅ Verificação de conflitos
- ✅ Listagem de agendamentos

## 🧪 Executando os Testes

```bash
# Executar todos os testes
npm run test:run

# Executar com interface gráfica
npm run test:ui

# Executar com cobertura
npm run test:coverage
```

Os testes cobrem:
- Componentes de autenticação
- Formulários de criação de eventos
- Validações de dados
- Hooks customizados

## 🚀 Deploy

### Netlify/Vercel (Recomendado)

1. Conecte seu repositório ao Netlify ou Vercel
2. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. O build será executado automaticamente

### Build Manual

```bash
npm run build
```

Os arquivos de produção ficarão na pasta `dist/`.

## 🔧 Configuração do Supabase (Detalhada)

### Tabelas do Banco

O projeto utiliza 3 tabelas principais:

1. **event_types** - Tipos de eventos criados
2. **event_availabilities** - Disponibilidades por dia da semana
3. **event_bookings** - Agendamentos realizados

### Row Level Security (RLS)

As políticas de segurança garantem que:
- Usuários só acessam seus próprios dados
- Páginas públicas podem ler eventos específicos
- Agendamentos são protegidos por validações

## 🐛 Solução de Problemas Comuns

### Erro de Conexão com Supabase

```
Error: supabaseUrl and supabaseKey are required
```

**Solução:** Verifique se o arquivo `.env` está na raiz do projeto com as variáveis corretas.

### Erro de CORS

**Solução:** Verifique se o domínio está configurado nas configurações do Supabase em Authentication → URL Configuration.

### Erro de Dependências

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Problemas com TypeScript

```bash
# Verificar erros de tipo
npm run typecheck
```

## 📚 Recursos de Aprendizado

### Documentação Oficial
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/docs)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)

### Conceitos Abordados
- **React Hooks** (useState, useEffect, custom hooks)
- **Context API** para autenticação
- **React Router** para SPA
- **React Hook Form** com validação Zod
- **Async/Await** para requisições
- **TypeScript** types e interfaces
- **CSS-in-JS** com TailwindCSS
- **Testing** com Vitest e RTL

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido durante workshop** - Uma aplicação completa de agendamentos com React, TypeScript e Supabase.

**🚀 Happy Coding!**