# Project Store

Uma API REST robusta e escalavel para uma loja online, desenvolvida com arquitetura modular em Node.js e TypeScript. Oferece funcionalidades completas de autenticacao, gerenciamento de produtos, carrinho de compras e controle de usuarios.

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express.js
- Prisma
- PostgreSQL
- JWT
- bcrypt
- Zod
- Jest

## Pre-requisitos

- Node.js (versao 18 ou superior)
- PostgreSQL
- npm ou yarn

## Instalacao

1. Clone o repositorio:

   ```bash
   git clone https://github.com/LuisFPamplona/project-store.git
   cd project-store/server
   ```

2. Instale as dependencias:

   ```bash
   npm install
   ```

3. Configure as variaveis de ambiente:
   Crie um arquivo `.env` na pasta `server/` com:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/project_store"
   JWT_SECRET="your_jwt_secret_key"
   PORT=3000
   ```

4. Configure o banco de dados:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Execute os testes:
   ```bash
   npm test
   ```

## Uso

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

O servidor estara rodando em `http://localhost:3000`

## Estrutura do Projeto

```
server/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.schema.ts
│   │   │   └── auth.service.ts
│   │   ├── users/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── user.schema.ts
│   │   │   └── user.service.ts
│   │   ├── products/
│   │   │   ├── product.controller.ts
│   │   │   ├── product.routes.ts
│   │   │   ├── product.schema.ts
│   │   │   └── product.service.ts
│   │   ├── cart/
│   │   │   ├── cart.controller.ts
│   │   │   ├── cart.routes.ts
│   │   │   └── cart.service.ts
│   │   ├── cart-items/
│   │   │   ├── cartItem.controller.ts
│   │   │   ├── cartItem.routes.ts
│   │   │   ├── cartItem.schema.ts
│   │   │   └── cartItem.service.ts
│   ├── middlewares/
│   │   ├── authMiddleware.ts
│   │   ├── adminMiddleware.ts
│   │   └── validateBody.ts
│   ├── lib/
│   │   └── prisma.ts
│   ├── errors/
│   │   ├── AppError.ts
│   │   └── errorHandler.ts
│   ├── enums/
│   │   └── role.enum.ts
│   ├── generated/
│   └── server.ts
├── __tests__/
│   ├── middlewares/
│   └── modules/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── package.json
```

## API Endpoints

### Autenticacao

- `POST /api/sessions` - Login
- `POST /api/users` - Registro de usuario

### Usuarios (Admin)

- `PATCH /api/users/:id` - Atualizar usuario
- `PATCH /api/users/:id/role` - Alterar role do usuario

### Produtos

- `GET /api/products` - Listar produtos (com paginacao)
- `POST /api/products` - Criar produto (Admin)
- `PATCH /api/products/:id` - Editar produto (Admin)
- `DELETE /api/products/:id` - Deletar produto (Admin)

### Carrinho

- `GET /api/cart` - Ver carrinho do usuario
- `POST /api/cart-items` - Adicionar item ao carrinho
- `DELETE /api/cart-items/:id` - Remover item do carrinho

## Scripts Disponiveis

- `npm run dev` - Inicia o servidor em modo de desenvolvimento
- `npm test` - Executa os testes
- `npx prisma studio` - Abre o Prisma Studio
- `npx prisma migrate dev` - Aplica migracoes de desenvolvimento
- `npx tsc --noEmit` - Verifica tipos TypeScript

## Arquitetura

O projeto segue uma arquitetura modular, onde cada dominio e isolado em seu proprio modulo contendo:

- Controller: logica de tratamento de requisicoes HTTP
- Service: logica de negocio
- Routes: definicao das rotas
- Schema: validacao de dados com Zod

Essa abordagem facilita manutencao, testabilidade e escalabilidade do codigo.

## Autenticacao

A API utiliza JWT para autenticacao. Usuarios podem ter roles de `USER` ou `ADMIN`.

## Testes

Os testes sao organizados de forma modular, espelhando a estrutura do codigo fonte. Utilizamos Jest para testes unitarios dos controllers e middlewares.

Para executar apenas os testes de um modulo especifico:

```bash
npx jest __tests__/modules/auth/
```

## Contribuicao

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudancas (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licenca

Este projeto esta sob a licenca ISC.

## Contato

Luis Pamplona - [GitHub](https://github.com/LuisFPamplona)

Link do projeto: https://github.com/LuisFPamplona/project-store
