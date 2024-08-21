# Setup Guide for the Project

## Introduction

This guide provides step-by-step instructions for setting up the development environment for this project. It is intended for future maintainers and developers who need to get the project running locally. By following these steps, you will be able to install dependencies, configure the environment, and start the development server.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Second, run Docker container:

```bash
docker compose up
```

Third, copy the `.env.local.example` to `.env.local` and fill the environment variables.

```bash
cp .env.local.example .env.local
```

Fourth, push the schema to the database:

```bash
npm run prisma:push
```

Fifth, generate the Prisma client:

```bash
npm run prisma:generate
```

Sixth, seed the database:

```bash
npm run prisma:seed
```

Lastly, run the development server:

```bash
npm run dev
```

## Custom Scripts

### Prisma

#### Reset the database

If you want to reset the database with the initial seed data, you can run the following command:

```bash
npm run prisma:reset
```
