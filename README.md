# 🚗 Sistema de Aluguel de Carros

> Projeto desenvolvido para a disciplina de **Laboratório de Desenvolvimento de Software** — PUC Minas | Engenharia de Software | 4º Período

---

## 📋 Descrição

Sistema web para apoio à gestão de aluguéis de automóveis, permitindo efetuar, cancelar e modificar pedidos através da Internet. O sistema contempla dois perfis de usuário: **clientes** (usuários individuais) e **agentes** (empresas e bancos), cada um com permissões distintas para interação com os pedidos de aluguel.

---

## 👥 Integrantes

| Nome | GitHub |
|------|--------|
| Gabriel dos Santos Silva Coelho | [@gabriel](https://github.com) |
| Pedro Marçal Ballesteros | [@pedro](https://github.com) |
| Vinicius Paranho Ribeiro | [@vinicius](https://github.com) |

> ⚠️ Substitua os links pelos perfis reais do GitHub de cada integrante.

---

## 🛠️ Tecnologias Utilizadas

### Backend
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

---

## 🏗️ Arquitetura

O sistema segue a arquitetura **MVC (Model-View-Controller)** e está dividido em dois subsistemas:

- **Subsistema de Gestão de Pedidos e Contratos** — responsável pela lógica de negócio relacionada aos aluguéis, clientes, agentes e contratos.
- **Subsistema de Interface Web** — responsável pela construção dinâmica das páginas e experiência do usuário.

```
sistema-aluguel-carros/
├── backend/                  # Spring Boot (API REST)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/aluguelcarros/
│   │   │   │       ├── controller/
│   │   │   │       ├── model/
│   │   │   │       ├── repository/
│   │   │   │       └── service/
│   │   │   └── resources/
│   │   │       └── application.properties
│   └── pom.xml
├── frontend/                 # React + Bootstrap
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
└── README.md
```

---

## ⚙️ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

- [Java 17+](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Maven 3.8+](https://maven.apache.org/download.cgi)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 15+](https://www.postgresql.org/download/)

---

## 🚀 Como Executar

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/sistema-aluguel-carros.git
cd sistema-aluguel-carros
```

### 2. Configurar o banco de dados

Crie um banco de dados PostgreSQL:

```sql
CREATE DATABASE aluguel_carros;
```

Edite o arquivo `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/aluguel_carros
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
```

### 3. Executar o Backend

```bash
cd backend
mvn spring-boot:run
```

> A API estará disponível em: `http://localhost:8080`

### 4. Executar o Frontend

```bash
cd frontend
npm install
npm start
```

> A aplicação estará disponível em: `http://localhost:3000`

---

## 📌 Funcionalidades

### Cliente (Usuário Individual)
- [x] Cadastro e autenticação no sistema
- [x] Introduzir pedido de aluguel
- [x] Modificar pedido de aluguel
- [x] Consultar status de pedido
- [x] Cancelar pedido de aluguel

### Agente (Empresa / Banco)
- [x] Modificar pedidos
- [x] Avaliar pedidos do ponto de vista financeiro
- [x] Aprovar ou reprovar pedidos para execução de contrato

### Geral
- [x] Registro de automóveis (matrícula, ano, marca, modelo e placa)
- [x] Gerenciamento de contratos de crédito
- [x] Associação de aluguel com contrato de crédito bancário

---

## 📐 Modelagem UML

Os diagramas UML do projeto estão disponíveis na pasta `/docs/uml/`:

| Diagrama | Sprint |
|----------|--------|
| Diagrama de Casos de Uso | Sprint 01 |
| Histórias do Usuário | Sprint 01 |
| Diagrama de Classes | Sprint 01 |
| Diagrama de Pacotes (Visão Lógica) | Sprint 01 |
| Diagrama de Componentes | Sprint 02 |
| Diagrama de Implantação | Sprint 03 |

---

## 📅 Sprints

| Sprint | Entrega |
|--------|---------|
| **Lab02S01** | Modelagem do sistema: Casos de Uso, Histórias do Usuário, Diagrama de Classes e Diagrama de Pacotes |
| **Lab02S02** | Revisão dos diagramas + Diagrama de Componentes + CRUD de Cliente (Web, Java, MVC) |
| **Lab02S03** | Revisão dos diagramas + Diagrama de Implantação + Protótipo funcional com criação e visualização de pedidos |

---

## 📊 Critérios de Avaliação

- Qualidade do sistema produzido (adequação aos requisitos)
- Alinhamento entre modelo (classes e arquitetura) e código
- Atualizações dos modelos conforme necessidade do projeto

**Valor total:** 20 pontos | Desconto de 1,0 ponto por dia de atraso

---

## 👨‍🏫 Professor

**João Paulo Carneiro Aramuni** — PUC Minas | Engenharia de Software

---

## 📄 Licença

Este projeto é de uso acadêmico e está licenciado sob os termos da instituição PUC Minas.
