# Premium eCommerce Store

## Overview

This is a modern eCommerce web application for selling physical goods, built with a React frontend and Express backend. The application features a Gumroad-inspired minimalist design, product browsing with filtering, user authentication, shopping cart functionality, and multi-role support (buyers, sellers, admins). The platform is designed to be extensible and integrates with payment gateways like Stripe and PayPal.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system

**Design System**:
- Typography: Inter (primary) and Space Grotesk (accent) fonts via Google Fonts
- Theme: Support for light/dark modes with CSS variables
- Component library: Comprehensive set of accessible UI components from Shadcn/ui
- Responsive: Mobile-first approach with breakpoints for tablet and desktop

**Key Frontend Features**:
- Product browsing with search and filtering (category, price, delivery type)
- Product detail pages with image galleries and specifications
- Shopping cart and checkout flow
- User authentication (login/signup)
- Role-based dashboards (buyer, seller, admin)
- Theme switching (light/dark mode)

### Backend Architecture

**Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Build Tool**: Vite for frontend, esbuild for backend bundling
- **Development**: Hot module replacement via Vite middleware

**API Design**:
- RESTful API endpoints under `/api` prefix
- Products API: GET /api/products, GET /api/products/:id, POST /api/products
- Orders API: POST /api/orders
- Response format: JSON
- Error handling: HTTP status codes with error messages

**Storage Strategy**:
- In-memory storage implementation (MemStorage) for development
- Interface-based design (IStorage) allows swapping storage backends
- Data models: Users, Products, Orders
- Initial product data loaded from JSON file at startup

**Rationale**: The in-memory storage approach allows for rapid development and testing without database setup. The interface-based design makes it straightforward to replace with a database implementation (PostgreSQL with Drizzle ORM is configured but not yet implemented).

### Authentication & Authorization

**Current Implementation**: Placeholder authentication logic
- User roles: buyer, seller, admin
- Session management via express-session (configured for PostgreSQL with connect-pg-simple)
- TODO: Implement actual authentication middleware and password hashing

**Future Integration**:
- OAuth support for social logins (Google, Facebook, Apple)
- JWT or session-based authentication
- Role-based access control for protected routes

### Data Models

**Users**:
- Fields: id, username, password (hashed), email, role
- Roles: buyer (default), seller, admin

**Products**:
- Fields: id, name, description, price, category, images (array), stock, deliveryType, featured
- Additional metadata: rating, reviews, specifications (JSON)

**Orders**:
- Fields: id, userId, productId, quantity, total, status
- Status values: pending, processing, shipped, delivered

## External Dependencies

### Database
- **Drizzle ORM** (v0.39.1): SQL ORM for type-safe database queries
- **Drizzle Kit**: Schema migration tool
- **@neondatabase/serverless**: PostgreSQL driver for serverless environments
- Configuration: PostgreSQL dialect, schema defined in `shared/schema.ts`
- Note: Database is configured but not actively used; application currently uses in-memory storage

### UI Component Libraries
- **Radix UI**: Comprehensive set of unstyled, accessible components
  - Dialog, Dropdown, Popover, Accordion, Tabs, Toast, etc.
  - All components are accessible and keyboard-navigable
- **Shadcn/ui**: Pre-styled components built on top of Radix UI
- **Embla Carousel**: Carousel/slider functionality for hero section and product images
- **cmdk**: Command menu component for search

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **tailwindcss-animate**: Animation utilities
- Custom design tokens defined in CSS variables for theming

### State Management & Data Fetching
- **TanStack Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form state management with validation
- **@hookform/resolvers**: Validation schema resolvers for React Hook Form
- **Zod**: Schema validation (used with Drizzle for type-safe data models)

### Payment Gateways (Planned Integration)
- **Stripe**: Payment processing for credit/debit cards
  - Integration point: `/api/create-stripe-session` endpoint (not yet implemented)
  - Frontend: Stripe Checkout redirect flow
- **PayPal**: Alternative payment method
  - Integration point: `/api/create-paypal-order` endpoint (not yet implemented)
  - Frontend: PayPal Buttons SDK

### Development Tools
- **Vite**: Frontend build tool with HMR
- **esbuild**: Fast backend bundler for production
- **TypeScript**: Type safety across the stack
- **Replit Plugins**: Development banner, error overlay, cartographer for Replit environment

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx** + **tailwind-merge**: Conditional className utilities
- **nanoid**: Unique ID generation
- **lucide-react**: Icon library

### Session Management
- **express-session**: Session middleware
- **connect-pg-simple**: PostgreSQL session store (configured but requires active database)

### Configuration Files
- **public/config.json**: Site configuration (name, theme colors, categories, delivery options)
- **public/data/products.json**: Initial product catalog loaded at startup
- **design_guidelines.md**: Comprehensive design system documentation