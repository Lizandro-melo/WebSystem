# WebSystem

## Descrição

Antes de começar utilize o documento **db.mwb** junto com MySQL Workbench

Este é um sistema web desenvolvido para gerenciar três principais áreas:

1. **HelpDesk**: Sistema de suporte para atender solicitações de ajuda dos usuários.
2. **Estoque de Solicitações de Itens**: Controle de solicitações de itens dentro da empresa.
3. **RH**: Controle de colaboradores, incluindo anotações sobre o dia a dia de cada um.

O sistema foi desenvolvido utilizando o **Next.js** no front-end e **Java Spring** no back-end. O back-end implementa segurança com **Spring Security** e **JWT** para autenticação. O banco de dados utilizado é o **MySQL**, com **JPA (Java Persistence API)** para o gerenciamento de dados.

## Tecnologias Utilizadas

- **Front-End**:
  - [Next.js](https://nextjs.org/) - Framework React para a construção da interface do usuário.
- **Back-End**:

  - [Java Spring](https://spring.io/projects/spring-framework) - Framework para o desenvolvimento do back-end.
  - [Spring Security](https://spring.io/projects/spring-security) - Framework para gerenciamento de segurança e autenticação.
  - [JWT (JSON Web Tokens)](https://jwt.io/) - Protocolo para autenticação de usuários.
  - [JPA (Java Persistence API)](https://jakarta.ee/specifications/persistence/) - ORM para interação com o banco de dados.

- **Banco de Dados**:
  - [MySQL](https://www.mysql.com/) - Sistema de gerenciamento de banco de dados relacional.

## Funcionalidades

- **HelpDesk**:

  - Cadastro de tickets de suporte.
  - Chat
  - Histórico de solicitações e respostas.

- **Estoque de Solicitações de Itens**:

  - Solicitação e controle de itens necessários para a equipe.
  - Acompanhamento do status das solicitações (pendente, em andamento, concluída).

- **RH**:
  - Cadastro de colaboradores.
  - Controle de informações.
  - Controle de presença e anotações diárias de cada colaborador.
  - Histórico de atividades e observações feitas pelo RH.

## Instalação

### Pré-requisitos

Antes de começar, é necessário ter as seguintes ferramentas instaladas no seu ambiente de desenvolvimento:

- **Node.js** (para o front-end): [Instalar Node.js](https://nodejs.org/)
- **JDK 11+** (para o back-end): [Instalar JDK](https://adoptium.net/)
- **MySQL**: [Instalar MySQL](https://dev.mysql.com/downloads/installer/)

### Passo 1: Configuração do Front-End

1. **Clone o repositório do front-end**:
   ```bash
   git clone https://github.com/Lizandro-melo/WebSystem.git
   cd WebSystem
   ```
