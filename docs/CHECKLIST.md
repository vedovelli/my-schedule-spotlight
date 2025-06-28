Antes de iniciar qualquer trabalho, revise este checklist que é OBRIGATÓRIO para qualque tipo de trabalho:

1. Ao trabalhar numa sub tarefa
   . utilizamos o Task Master e seu poderoso MCP
   . Caso seja a primeira sub de uma tarefa pai, crie um novo branch no Git com o template `task/<task number>-<task name>`
   . Marque a sub tarefa como `in-progress` e também a tarefa pai

2. Execute todas as nossas ferramentas de quality assurance QA
   . `npm run lint`
   . `npm run typecheck`
   . `npm run build`
   . Quando erros forem encontrados, resolva-os antes de prosseguir com o desenvolvimento
   . Warnings podem ser desconsiderados

3. Ao concluir a sub tarefa
   . Faça um commit das alterações com descrição abrangente
   . Ao comitar utilize `git add --all`
   . Execute QA novamente
   . Marque a sub tarefa como `done`
   . Faça o log de desenvolvimento no arquivo `docs/PROGRESS.md`, crie o arquivo caso não exista. Utilize timestamps para termos um registro histórico.
