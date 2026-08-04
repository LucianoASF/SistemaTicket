# Sistema de Chamados

Sistema de gerenciamento de chamados desenvolvido para demonstrar conhecimentos em desenvolvimento Full Stack utilizando **ASP.NET Core Web API**, **React**, **TypeScript** e **PostgreSQL**.

A aplicação permite o gerenciamento completo de usuários e chamados, com autenticação via JWT armazenado em cookies HttpOnly, autorização baseada em perfis, dashboard com indicadores e interface moderna.

## Demonstração

- **Frontend:** https://sistema-ticket-beige.vercel.app
- **API:** https://sistematicket-production-edf0.up.railway.app/api

### Credenciais

- **Admin**: e-mail: admin@system.com; senha: Admin@123
- **Support**: e-mail: support@system.com; senha: Support@123
- **Admin**: e-mail: user@system.com; senha: User@123


---

# Tecnologias

## Backend

- ASP.NET Core
- Entity Framework Core
- ASP.NET Identity
- JWT Authentication
- PostgreSQL


## Frontend

- React
- TypeScript
- Vite
- React Router
- React Hook Form
- Zod
- Axios
- Tailwind CSS
- shadcn/ui

## Banco de Dados

- PostgreSQL

## Deploy

- Frontend: Vercel
- Backend: Railway
- Banco de dados: Railway PostgreSQL

---

# Funcionalidades

## Autenticação

- Login
- Logout
- JWT armazenado em Cookie HttpOnly
- Controle de acesso baseado em papéis

## Usuários

- Cadastro
- Edição
- Desativação
- Pesquisa
- Paginação
- Filtros

## Chamados

- Cadastro
- Atualização
- Exclusão
- Atribuição de responsável
- Alteração de status
- Alteração de prioridade
- Pesquisa
- Paginação
- Filtros

## Dashboard

- Quantidade de chamados criados
- Quantidade de chamados atribuídos
- Chamados por status
- Indicadores rápidos

---

# Perfis de Usuário

## Administrador

Possui acesso total ao sistema.

Pode:

- Gerenciar usuários
- Gerenciar chamados
- Atribuir responsáveis
- Alterar status
- Alterar prioridade
- Visualizar todos os chamados
- Comentar nos chamados

## Suporte

Pode:

- Gerenciar seus chamados
- Comentar nos seus chamados
- Alterar status
- Alterar prioridade
- Visualizar seus chamados

## Usuário

Pode:

- Criar chamados
- Comentar nos seus chamados
- Visualizar seus chamados
- Atualizar informações permitidas

---

# Arquitetura

```
React
        │
        ▼
ASP.NET Core Web API
        │
        ▼
Entity Framework Core
        │
        ▼
PostgreSQL
```


---

# Como executar o projeto

## Clonar o repositório

```bash
git clone https://github.com/seu-usuario/sistema-ticket.git
```

---

## Backend

Entrar na pasta

```bash
cd SistemaTicket
```

Instalar as dependências

```bash
dotnet restore
```

Criar o banco

```bash
dotnet ef database update
```

Executar

```bash
dotnet run
```

---

## Frontend

Entrar na pasta

```bash
cd frontend
```

Instalar dependências

```bash
npm install
```

Executar

```bash
npm run dev
```

---

# Configuração

## Backend

Crie um arquivo `appsettings.Development.json` ou configure as variáveis de ambiente.

### Connection String

```json
{
  "ConnectionStrings": {
    "DefaultConnection": ""
  }
}
```

### JWT

```json
{
  "Jwt": {
    "Key": "",
  }
}
```

---

## Variáveis de Ambiente

### Backend

```
ConnectionStrings__DefaultConnection

Jwt__Key

FrontendUrl
```

### Frontend

```
VITE_API_URL
```

---

# Segurança

A aplicação utiliza:

- JWT Authentication
- Cookies HttpOnly
- Cookies Secure
- SameSite=None
- CORS configurado
- ASP.NET Identity
- Hash de senhas
- Controle de acesso baseado em Roles

---

# Principais Recursos Técnicos

- Arquitetura em camadas
- Entity Framework Core
- Migrations
- Seed inicial
- DTOs
- Validação de dados
- Paginação
- Pesquisa
- Filtros
- Tratamento global de exceções
- Autenticação baseada em JWT
- Cookies HttpOnly
- API RESTful
- Deploy em nuvem

---

# Screenshots

## Login
<img width="1917" height="926" alt="image" src="https://github.com/user-attachments/assets/38eabc9a-3df2-4409-9001-9e80353d4e80" />

## Dashboard
<img width="1916" height="920" alt="image" src="https://github.com/user-attachments/assets/6cffc8d2-0a11-4ec8-929f-f1c36456d36f" />

## Tickets
<img width="1917" height="912" alt="image" src="https://github.com/user-attachments/assets/3156f5f5-0fd2-4268-908e-6d7a96a2c15c" />

## Modal de criação de Tickets
<img width="1915" height="903" alt="image" src="https://github.com/user-attachments/assets/828cbd30-f4d9-4c2e-9170-c6d8d5a682e2" />

## Detalhes do Ticket
<img width="1917" height="910" alt="image" src="https://github.com/user-attachments/assets/63881728-f100-4270-b3ae-28f0ce50f165" />

## Modal de edição do Ticket
<img width="1917" height="917" alt="image" src="https://github.com/user-attachments/assets/17551681-fab4-48c8-b955-f17e7e5db696" />

## Usuários
<img width="1917" height="911" alt="image" src="https://github.com/user-attachments/assets/b0ef20fb-7e22-47d9-80b4-cf868b39960b" />

## Modal de criação de Usuários
<img width="1917" height="917" alt="image" src="https://github.com/user-attachments/assets/e98a2543-c4e6-4aaf-9910-6603b93a9d75" />

## Detalhes do Usuário
<img width="1917" height="915" alt="image" src="https://github.com/user-attachments/assets/a4fc087e-7bb7-4b7a-9e9a-37e2a1e02b34" />

## Modal de edição do Usuário
<img width="1917" height="918" alt="image" src="https://github.com/user-attachments/assets/05b279f7-af8a-471a-84d9-720db279937c" />

---


# Licença

Este projeto foi desenvolvido para fins de estudo e portfólio.
