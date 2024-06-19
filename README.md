# Tascurator-frontend

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

Lastly, run the development server:

```bash
npm run dev
```

## Document

### API Document

https://tascurator.github.io/tascurator-frontend/
