# Feature Voting System

A modern web application where users can post feature requests and upvote others. Built with React, TypeScript, and PostgreSQL.

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Hono (API framework)
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas

### Frontend
- **Framework**: React 19 with TypeScript
- **Routing**: TanStack Router (file-based)
- **State Management**: TanStack Query
- **UI**: Radix UI + Tailwind CSS
- **Build Tool**: Vite

### Infrastructure
- **Containerization**: Docker Compose for PostgreSQL
- **Migrations**: Drizzle Kit

## Features

### ✅ Core Functionality
- [x] Post feature requests
- [x] Upvote/downvote features
- [x] View features sorted by popularity
- [x] IP-based voting protection
- [x] Real-time vote counting

### ✅ Technical Features
- [x] Type-safe database operations
- [x] Responsive design
- [x] File-based routing
- [x] Database migrations
- [x] Modern UI components

## Project Structure

```
feature-voting/
├── src/
│   ├── server/                    # Backend API
│   │   ├── database/             # PostgreSQL + Drizzle setup
│   │   │   ├── schema.ts        # Feature and Vote schemas
│   │   │   ├── seed.ts          # Sample data
│   │   │   └── drizzle/         # Generated migrations
│   │   ├── modules/             # Feature modules
│   │   └── index.ts            # Hono app entry point
│   ├── routes/                  # Frontend pages
│   │   ├── index.tsx           # Home page
│   │   └── features/           # Feature-related pages
│   ├── components/             # Reusable UI components
│   ├── hooks/                  # React Query hooks
│   └── lib/                    # Utilities
├── docker-compose.yml          # PostgreSQL setup
└── package.json               # Dependencies
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### 3. Start Database

```bash
docker compose up -d
```

### 4. Run Migrations

```bash
npm run migration:run
```

### 5. Seed Database

```bash
npx tsx src/server/database/seed.ts
```

### 6. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Database Schema

### Features Table
```sql
CREATE TABLE features (
  id TEXT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  author_name VARCHAR(255),
  votes_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Votes Table
```sql
CREATE TABLE votes (
  id TEXT PRIMARY KEY,
  feature_id TEXT REFERENCES features(id) ON DELETE CASCADE,
  voter_ip VARCHAR(45) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (voter_ip, feature_id)
);
```

## API Endpoints

### Features
- `GET /api/features` - List all features
- `POST /api/features` - Create new feature
- `PUT /api/features/:id` - Update feature
- `DELETE /api/features/:id` - Delete feature

### Votes
- `POST /api/features/:id/vote` - Vote for a feature
- `DELETE /api/features/:id/vote` - Remove vote

## Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run serve            # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run check            # Format + lint fix
npm run tscheck          # TypeScript check

# Database
npm run migration:gen    # Generate new migration
npm run migration:run    # Apply migrations
npm run migration:drop   # Drop last migration
npm run seed             # Seed sample data

# Testing
npm test                 # Test suite
```

## Usage

1. **Browse Features**: View all feature requests on the home page
2. **Suggest Feature**: Click "Suggest Feature" to add a new request
3. **Vote**: Click "Vote" on features you support
4. **One Vote Per IP**: System prevents multiple votes from same IP address

## Customization

### Adding New Fields
1. Update `src/server/database/schema.ts`
2. Run migration: `npm run migration:gen`
3. Apply migration: `npm run migration:run`

### Modifying UI
- **Styling**: Edit `src/styles.css`
- **Components**: Modify files in `src/components/`
- **Pages**: Update files in `src/routes/`

## Architecture

### Backend Patterns
- **Type-Safe Operations**: Full TypeScript support
- **Schema Validation**: Zod ensures data integrity
- **Error Handling**: Result patterns for robust error management

### Frontend Patterns
- **File-Based Routing**: TanStack Router auto-generates routes
- **Server State**: TanStack Query manages caching and updates
- **Component Composition**: Reusable UI components

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests if needed
5. Submit pull request

## License

MIT License - feel free to use this template for your projects.
