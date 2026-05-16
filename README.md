# Project Store

Monorepo com backend de loja online em Node.js e TypeScript. O serviço principal está em `server/` e oferece autenticação JWT, gerenciamento de produtos, carrinho, pedidos e pagamentos.

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

## Pré-requisitos

- Node.js (versão 18 ou superior)
- PostgreSQL
- npm ou yarn

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/LuisFPamplona/project-store.git
   cd project-store/server
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

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

O servidor estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
server/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── orders/
│   │   └── payment/
│   ├── middlewares/
│   ├── lib/
│   ├── errors/
│   ├── enums/
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

### Autenticação

- `POST /api/sessions` - Login de usuário
- `POST /api/users` - Registro de usuário

### Usuários / Admin

- `PATCH /api/sessions/:id/role` - Alterar role do usuário (admin)

### Produtos

- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto (admin)
- `PATCH /api/products/:id` - Editar produto (admin)
- `DELETE /api/products/:id` - Deletar produto (admin)

### Carrinho

- `GET /api/cart` - Ver carrinho do usuário
- `POST /api/cart` - Adicionar item ao carrinho
- `PATCH /api/cart/:id` - Atualizar item do carrinho
- `DELETE /api/cart/:id` - Remover item do carrinho

### Pedidos

- `POST /api/orders` - Criar pedido a partir do carrinho
- `GET /api/orders` - Listar pedidos do usuário
- `GET /api/orders/:id` - Obter detalhes de um pedido

### Pagamentos

- `POST /api/payment/:id` - Registrar pagamento de um pedido

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo de desenvolvimento
- `npm test` - Executa os testes
- `npx prisma studio` - Abre o Prisma Studio
- `npx prisma migrate dev` - Aplica migrações de desenvolvimento
- `npx tsc --noEmit` - Verifica tipos TypeScript

## Arquitetura

O projeto segue uma arquitetura modular, onde cada domínio é isolado em um módulo contendo:

- Controllers: tratamento de requisições HTTP
- Services: lógica de negócio
- Routes: definição das rotas
- Schemas: validação de entrada com Zod

Isso facilita manutenção, testabilidade e escalabilidade.

## Autenticação

A API utiliza JWT para autenticação. Usuários podem ter roles `USER` ou `ADMIN`.

## Testes

Os testes são organizados na pasta `__tests__/` e cobrem `modules/` e `middlewares/`.

Para executar apenas os testes de um módulo específico:

```bash
npx jest __tests__/modules/auth/
```

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença ISC.

## Contato

Luis Pamplona - [GitHub](https://github.com/LuisFPamplona)

Link do projeto: https://github.com/LuisFPamplona/project-store
