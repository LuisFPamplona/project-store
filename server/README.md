# Project Store - Server

Um servidor backend para uma loja online construído com Node.js, TypeScript, Express e Prisma.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express.js** - Framework web para Node.js
- **Prisma** - ORM para banco de dados
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Hashing de senhas
- **Jest** - Framework de testes

## 📁 Estrutura do Projeto

```
src/
├── errors/
│   ├── AppError.ts
│   └── errorHandler.ts
├── lib/
│   └── prisma.ts
├── middlewares/
│   ├── adminMiddleware.ts
│   ├── authMiddleware.ts
│   └── validateBody.ts
├── modules/
│   ├── auth/
│   ├── users/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   └── payment/
└── server.ts
```

## 🏗️ Arquitetura

### Padrões Implementados

#### ✅ Tratamento de Erros Centralizado

- **Error Handler Global**: Todos os erros são tratados por um middleware centralizado
- **AppError Customizada**: Classe para erros de negócio com status codes específicos
- **Controllers Limpos**: Sem try/catch nos controllers, que delegam validação e erro ao middleware

#### ✅ Separação de Responsabilidades

- **Controllers**: Recebem requisições, chamam services e retornam respostas
- **Services**: Contêm lógica de negócio
- **Middlewares**: Autenticação, validação e autorização
- **Prisma**: Acesso ao banco e models

#### ✅ Segurança

- **JWT**: Autenticação de token
- **bcrypt**: Hashing de senhas
- **Zod**: Validação de dados de entrada
- **Middlewares**: Protegem rotas privadas e de administração

## 🔧 Instalação e Configuração

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- PostgreSQL (ou outro banco suportado pelo Prisma)

### Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd project-store/server
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
# Edite o .env com suas configurações
```

4. Execute as migrações do banco:

```bash
npx prisma migrate dev
```

5. Inicie o servidor:

```bash
npm run dev
```

## 🧪 Testes

Execute os testes com:

```bash
npm test
```

## 📡 API Endpoints

### Autenticação

- `POST /api/sessions` - Login de usuário
- `POST /api/users` - Registro de usuário

### Produtos (requer autenticação)

- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto (admin)
- `PATCH /api/products/:id` - Editar produto (admin)
- `DELETE /api/products/:id` - Deletar produto (admin)

### Carrinho (requer autenticação)

- `GET /api/cart` - Ver carrinho do usuário
- `POST /api/cart` - Adicionar item ao carrinho
- `PATCH /api/cart/:id` - Atualizar item do carrinho
- `DELETE /api/cart/:id` - Remover item do carrinho

### Pedidos (Orders) (requer autenticação)

- `POST /api/orders` - Criar pedido a partir do carrinho do usuário
- `GET /api/orders` - Listar pedidos do usuário
- `GET /api/orders/:id` - Obter detalhes de um pedido

### Pagamentos (Payment) (requer autenticação)

- `POST /api/payment/:id` - Registrar/confirmar pagamento de um pedido

### Usuários / Admin

- `PATCH /api/sessions/:id/role` - Alterar role do usuário (admin)

## 🔒 Autenticação e Autorização

- **JWT Tokens**: Autenticação baseada em tokens
- **Roles**: Sistema de permissões (USER, ADMIN)
- **Middlewares**: Proteção automática de rotas

## 🗄️ Banco de Dados

O projeto utiliza Prisma ORM com PostgreSQL. As tabelas principais incluem:

- Users
- Products
- Carts
- CartItems
- Orders
- Payments

## 🚀 Melhorias Recentes

- ✅ Implementação dos módulos `orders` e `payment`
- ✅ Migrações Prisma adicionadas para `Order.status`
- ✅ Cobertura de testes para `modules/` e `middlewares/`
- ✅ Tratamento de erros centralizado e validação com Zod

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.
