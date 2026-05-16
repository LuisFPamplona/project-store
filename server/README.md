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
│   ├── AppError.ts          # Classe customizada para erros
│   └── errorHandler.ts      # Middleware global de tratamento de erros
├── lib/
│   └── prisma.ts            # Configuração do Prisma Client
├── middlewares/
│   ├── adminMiddleware.ts   # Middleware para verificar permissões de admin
│   ├── authMiddleware.ts    # Middleware de autenticação JWT
│   └── validateBody.ts      # Middleware de validação de dados
├── modules/
│   ├── auth/                # Módulo de autenticação
│   ├── cart/                # Módulo do carrinho
│   ├── products/            # Módulo de produtos
│   └── users/               # Módulo de usuários
└── server.ts                # Arquivo principal do servidor
```

## 🏗️ Arquitetura

### Padrões Implementados

#### ✅ Tratamento de Erros Centralizado

- **Error Handler Global**: Todos os erros são tratados por um middleware centralizado
- **AppError Customizada**: Classe para erros de negócio com status codes específicos
- **Controllers Limpos**: Sem try/catch, focam apenas na lógica de negócio

#### ✅ Separação de Responsabilidades

- **Controllers**: Recebem requisições, chamam services, retornam respostas
- **Services**: Contêm lógica de negócio e validações
- **Middlewares**: Autenticação, validação, autorização
- **Models**: Interação com banco de dados (Prisma)

#### ✅ Segurança

- **JWT sem fallbacks**: Tokens seguros sem valores padrão hardcoded
- **Hashing de senhas**: bcrypt para proteção de credenciais
- **Validação de entrada**: Schemas com Zod para dados de entrada
- **Middleware de autenticação**: Proteção de rotas sensíveis

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

- `POST /api/sessions/login` - Login de usuário
- `POST /api/sessions/register` - Registro de novo usuário

### Produtos (requer autenticação)

- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto (admin)
- `PUT /api/products/:id` - Editar produto (admin)
- `DELETE /api/products/:id` - Deletar produto (admin)

### Carrinho (requer autenticação)

- `GET /api/cart` - Ver carrinho do usuário
- `POST /api/cart` - Adicionar item ao carrinho
- `PATCH /api/cart/:id` - Editar item do carrinho
- `DELETE /api/cart/:id` - Deletar item do carrinho

### Usuários (requer autenticação admin)

- `PUT /api/users/:id/role` - Alterar role do usuário

### Pedidos (Orders) (requer autenticação)

- `POST /api/orders` - Criar pedido a partir do carrinho do usuário
- `GET /api/orders` - Listar pedidos do usuário (admin vê todos)
- `GET /api/orders/:id` - Obter detalhes de um pedido
 

### Pagamentos (Payment) (requer autenticação)

- `POST /api/payment/:id` - Registrar/confirmar pagamento de um pedido

## 🔒 Autenticação e Autorização

- **JWT Tokens**: Autenticação baseada em tokens
- **Roles**: Sistema de permissões (USER, ADMIN)
- **Middlewares**: Proteção automática de rotas

## 🗄️ Banco de Dados

O projeto utiliza Prisma ORM com PostgreSQL. As tabelas incluem:

- Users (usuários)
- Products (produtos)
- Carts (carrinhos)
- CartItems (itens do carrinho)
- Orders (pedidos)
- Payments (pagamentos)

## 🚀 Melhorias Recentes

### v1.1.0 - Refatoração de Tratamento de Erros

- ✅ Implementado error handler global
- ✅ Removido try/catch repetitivo dos controllers
- ✅ Padronização de respostas de erro
- ✅ Melhor separação de responsabilidades
- ✅ Segurança JWT aprimorada (sem fallbacks)
- ✅ Testes atualizados para nova arquitetura
- ✅ Novos módulos `orders` e `payment` implementados
- ✅ Migrações Prisma adicionadas para `Order.status` e enum correspondente

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
