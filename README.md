# Sistema de Agendamento Inteligente - Clínica Médica

Este projeto é uma aplicação Fullstack desenvolvida como requisito de avaliação acadêmica. O sistema permite o gerenciamento de agendamentos médicos, integrando autenticação segura, consumo de APIs externas e um frontend reativo.

## Funcionalidades Principais

* **Autenticação e Autorização:** Criação de contas e login de usuários utilizando JSON Web Tokens (JWT) e criptografia de senhas com Bcrypt.
* **Controle de Acesso (RBAC):** Diferenciação entre perfis de "Paciente" (visualiza apenas seus agendamentos) e "Secretário/Admin" (visualiza todos os agendamentos do sistema).
* **Agendamento Inteligente:** * Validação de conflitos de horário no banco de dados.
  * Integração com a API **ViaCEP** para preenchimento automático do endereço com base no CEP fornecido.
  * Integração com a API **OpenWeatherMap** para verificação da previsão do tempo na data e cidade da consulta.
* **Painel Reativo:** Interface desenvolvida em Vue.js que atualiza a listagem de consultas automaticamente após um novo agendamento, sem necessidade de recarregar a página.

## Tecnologias Utilizadas

### Backend
* Node.js com TypeScript
* Express (Roteamento e Servidor Web)
* MongoDB e Mongoose (Banco de Dados NoSQL e ODM)
* JWT (Autenticação Stateless)
* Axios (Consumo de APIs externas)

### Frontend
* Vue.js 3 (Composition API)
* Vite (Build tool)
* Vue Router (Navegação de rotas no lado do cliente)
* Axios (Comunicação com a API interna)

## Pré-requisitos

Para executar este projeto localmente, você precisará ter instalado em sua máquina:
* Node.js (versão 18 ou superior recomendada)
* Git
* Conta no MongoDB Atlas (ou MongoDB rodando localmente)
* Chave de API do OpenWeatherMap

## Como Executar o Projeto

### 1. Configuração do Backend
Navegue até o diretório do servidor e instale as dependências:

```bash
cd backend
npm install
```

Crie um arquivo `.env` na raiz da pasta `backend` com as seguintes variáveis:

```env
PORT=3000
MONGO_URI=sua_string_de_conexao_do_mongodb
JWT_SECRET=sua_chave_secreta_jwt
OPENWEATHER_KEY=sua_chave_da_api_openweathermap
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```
O servidor estará rodando em `http://localhost:3000`.

### 2. Configuração do Frontend
Em um novo terminal, navegue até o diretório da interface e instale as dependências:

```bash
cd frontend
npm install
```

Inicie o servidor de desenvolvimento do Vue:

```bash
npm run dev
```
A aplicação estará disponível no navegador, geralmente no endereço `http://localhost:5173`.

## Estrutura da API

Abaixo estão as principais rotas expostas pelo backend:

**Autenticação:**
* `POST /api/auth/registrar`: Cria um novo usuário.
* `POST /api/auth/login`: Autentica o usuário e retorna o token JWT.

**Agendamentos (Requerem Token JWT):**
* `POST /api/agendamentos`: Cria um novo agendamento (consome ViaCEP e OpenWeatherMap).
* `GET /api/agendamentos`: Lista os agendamentos (filtrado pelo perfil do usuário).