# 📘 PRD – Aplicativo de Agendamentos Pessoais Estilo Calendly

## ✨ Visão Geral

Criação de uma aplicação web para gerenciamento de agendamentos pessoais inspirada no Calendly, mas com foco em simplicidade, uso individual e excelente UX. Usuários poderão definir tipos de eventos com horários específicos por dia da semana e compartilhar links para agendamento.

---

## 🧩 Stack Tecnológico

- **Frontend**
  - React (com React Router)
  - TypeScript com configurações strict
  - TailwindCSS
  - Shadcn UI (suíte exclusiva de componentes visuais)
  - ESLint + Prettier
  - Testes: Vitest + React Testing Library

- **Backend**
  - Supabase (DB, Auth, Edge Functions)

---

## 🖥️ Funcionalidades Principais

### 1. Autenticação

- Cadastro e login via Supabase Auth (e-mail + senha)
- Recuperação de senha por e-mail

### 2. Painel do Usuário

- Exibição de:
  - Total de tipos de eventos criados
  - Total de disponibilidades ativas
  - Quantidade de agendamentos realizados no mês atual
- Acesso aos eventos criados com botão de cópia de link e visualização

### 3. Criação de Evento

- Campos:
  - Título
  - Descrição
  - Duração em minutos
  - Dias da semana disponíveis
  - Horário de início e término por dia

### 4. Visualização de Evento

- Página pública com:
  - Informações do evento
  - Datas disponíveis para agendamento (filtradas por horário e dia da semana)
  - Formulário de agendamento com data/hora selecionável

### 5. Agendamento

- Armazena os agendamentos com:
  - ID do evento
  - E-mail da pessoa que agendou
  - Data e hora selecionadas
- Checagem de conflitos antes de confirmar o agendamento
- Envio de e-mail de confirmação (opcional, via Supabase Edge Functions ou terceiros como Resend)

---

## 🗃️ Banco de Dados (Supabase)

### Tabelas principais

#### `users`

- `id` (UUID, PK)
- `email`
- `created_at`

**Observação**: esta tabela não precisa ser criada pois utilizaremos a tabela padrão criada pelo recurso Auth do Supabase.

#### `event_types`

- `id` (UUID, PK)
- `user_id` (FK)
- `title`
- `description`
- `duration_minutes`
- `created_at`

#### `event_availabilities`

- `id` (UUID, PK)
- `event_type_id` (FK)
- `day_of_week` (int: 0–6, domingo a sábado)
- `start_time` (time)
- `end_time` (time)

#### `event_bookings`

- `id` (UUID, PK)
- `event_type_id` (FK)
- `user_email`
- `scheduled_for` (timestamp)
- `created_at`

---

## 🧪 Testes

- Testes de componentes com React Testing Library
- Testes unitários de lógica com Vitest
- Cobertura obrigatória para:
  - Criação de eventos
  - Agendamento
  - Validação de disponibilidade
  - Formulários

---

## 🎨 UI / UX

- Tema escuro
- Cor principal: amarelo escuro (`#FACC15` ou semelhante)
- Interface limpa, sem distrações
- Responsiva (desktop-first, mas adaptável a mobile)
- **Componentes exclusivamente construídos com Shadcn UI**

---

## 🧠 Edge Functions

- **Verificação de conflito de agendamento**
  - Recebe ID do evento e horário desejado
  - Retorna se está disponível ou não

- **Gatilho de notificação (futuro)**
  - Envio de e-mail ao criador e ao visitante após agendamento

---

## 🛣️ Roteamento (React Router)

| Rota                    | Componente           | Protegida? |
| ----------------------- | -------------------- | ---------- |
| `/login`                | LoginPage            | ❌         |
| `/signup`               | SignupPage           | ❌         |
| `/recover`              | PasswordRecoveryPage | ❌         |
| `/dashboard`            | DashboardPage        | ✅         |
| `/event/new`            | NewEventPage         | ✅         |
| `/event/:id`            | ViewEventPage        | ✅         |
| `/schedule/:event_slug` | PublicSchedulePage   | ❌         |

---

## 🧭 Navegação

- Sidebar simples no dashboard
- Menu superior com botão para novo evento
- Cards para exibir eventos ativos
- Página pública com detalhes do evento e botão para selecionar data

---

## 📅 Roadmap Inicial

| Semana | Tarefas Principais                                   |
| ------ | ---------------------------------------------------- |
| 1      | Setup do projeto, Supabase e estrutura base de rotas |
| 2      | CRUD de eventos e interface de criação               |
| 3      | Agendamentos e lógica de disponibilidade             |
| 4      | Refino visual, testes e deploy (Vercel + Supabase)   |
