# Inventory & Order Management System

A production-ready full-stack inventory and order management application for businesses that need to manage products, customers, stock levels, and orders with reliable backend validation.

The project is intentionally not a simple CRUD demo. It uses a layered backend architecture, normalized database design, API response standards, frontend state isolation, Dockerized infrastructure, and deployment-ready configuration.

## Live Demo Links

- Frontend: _Coming soon_
- Backend API: _Coming soon_
- Docker Hub image: _Coming soon_

## Features

- Product management with unique SKU validation and non-negative quantity rules
- Customer management with unique email validation
- Order creation with inventory validation, automatic stock reduction, and backend-calculated totals
- Dashboard summary for products, customers, orders, and low-stock products
- Professional React SaaS interface with search, forms, loading states, empty states, errors, and toast notifications
- FastAPI backend with service and repository layers
- PostgreSQL database with Alembic migrations
- Docker Compose for frontend, backend, and database
- Backend tests for validation, order creation, inventory updates, and dashboard totals

## Architecture Diagram

```text
React + Vite Frontend
        |
        v
FastAPI Routes
        |
        v
Service Layer
        |
        v
Repository Layer
        |
        v
PostgreSQL
```

Backend request flow:

```text
Route -> Service -> Repository -> Database
```

Routes stay thin, services own business rules, and repositories own database queries.

## Folder Structure

```text
.
|-- backend/
|   |-- app/
|   |   |-- api/routes/
|   |   |-- core/
|   |   |-- db/
|   |   |-- exceptions/
|   |   |-- models/
|   |   |-- repositories/
|   |   |-- schemas/
|   |   |-- services/
|   |   |-- utils/
|   |   `-- main.py
|   |-- alembic/
|   |-- tests/
|   |-- Dockerfile
|   `-- requirements.txt
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- contexts/
|   |   |-- hooks/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- styles/
|   |   `-- utils/
|   |-- Dockerfile
|   `-- package.json
|-- docker-compose.yml
`-- README.md
```

## Database Schema

```text
products
- id PK
- name
- sku UNIQUE INDEX
- price numeric(12,2)
- quantity CHECK quantity >= 0

customers
- id PK
- full_name
- email UNIQUE INDEX
- phone

orders
- id PK
- customer_id FK -> customers.id
- total_amount numeric(12,2)
- created_at

order_items
- id PK
- order_id FK -> orders.id
- product_id FK -> products.id
- quantity
- unit_price numeric(12,2)
- line_total numeric(12,2)
```

Useful indexes are included for SKU, email, names, order customer lookup, and order item joins.

## API Documentation

All standard application responses follow this shape:

```json
{
  "success": true,
  "message": "Product created",
  "data": {}
}
```

Errors follow:

```json
{
  "success": false,
  "message": "SKU already exists"
}
```

### Products

- `POST /products`
- `GET /products`
- `GET /products/{id}`
- `PUT /products/{id}`
- `DELETE /products/{id}`

Create/update payload:

```json
{
  "product_name": "Barcode Scanner",
  "sku": "SCAN-001",
  "price": "125.00",
  "quantity": 20
}
```

### Customers

- `POST /customers`
- `GET /customers`
- `GET /customers/{id}`
- `DELETE /customers/{id}`

Create payload:

```json
{
  "full_name": "Jordan Lee",
  "email": "jordan@example.com",
  "phone": "+1 555 0100"
}
```

### Orders

- `POST /orders`
- `GET /orders`
- `GET /orders/{id}`
- `DELETE /orders/{id}`

Create payload:

```json
{
  "customer_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 3
    }
  ]
}
```

### Dashboard

- `GET /dashboard/summary`

```json
{
  "total_products": 0,
  "total_customers": 0,
  "total_orders": 0,
  "low_stock_products": 0
}
```

Low stock means fewer than 10 units.

## Setup Instructions

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Docker Instructions

Run the entire stack:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

PostgreSQL data persists in the named volume `postgres_data`.

## Environment Variables

Backend:

```env
DATABASE_URL=postgresql+psycopg://inventory_user:inventory_password@db:5432/inventory_db
APP_NAME=Inventory Management API
DEBUG=false
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

Frontend:

```env
VITE_API_URL=http://localhost:8000
```

## Testing

Backend tests use an in-memory SQLite database for fast unit-level and API-level validation:

```bash
cd backend
pytest
```

Covered scenarios:

- Duplicate SKU rejection
- Negative quantity rejection
- Duplicate customer email rejection
- Order creation total calculation
- Inventory reduction after order creation
- Insufficient stock rejection with rollback
- Dashboard summary counts

## Deployment Instructions

### Backend: Render, Railway, or Fly.io

1. Create a managed PostgreSQL database.
2. Set `DATABASE_URL`, `APP_NAME`, `DEBUG=false`, and `CORS_ORIGINS`.
3. Use `backend/Dockerfile` or run:

```bash
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend: Vercel or Netlify

1. Set the project root to `frontend`.
2. Set `VITE_API_URL` to the deployed backend URL.
3. Build command: `npm run build`
4. Publish directory: `dist`

## Scalability Design

The system is designed to grow beyond assessment scale:

- `10,000+ products`: indexed SKU and name columns support fast exact lookup and search-style filtering.
- `100,000+ customers`: indexed email and name fields support uniqueness checks and customer discovery.
- Large order volumes: normalized `orders` and `order_items` tables keep order headers separate from line items and avoid duplicated product/customer data.
- Service layer architecture: business rules are isolated from HTTP concerns, so workflows can grow without bloating route handlers.
- Repository pattern: database access is centralized, making pagination, read replicas, caching, and query tuning easier to add.
- Database indexing: high-value lookup paths are indexed from the first migration.
- Stateless backend design: FastAPI instances can scale horizontally behind a load balancer.
- Containerized deployment: the app can run consistently across local, CI, and cloud environments.
- API versioning strategy: future versions can be introduced under `/api/v1` and `/api/v2` while preserving current contracts.
- Future microservice migration path: product, customer, and order domains already have clear service boundaries.

## System Design Decisions

Current architecture:

```text
Frontend
   |
   v
FastAPI
   |
   v
PostgreSQL
```

Future growth architecture:

```text
API Gateway
   |
   v
Product Service   Customer Service   Order Service
   |                     |                |
   +-----------> Message Queue <----------+
                         |
                         v
                    Databases
```

FastAPI was chosen for typed request handling, high performance, strong OpenAPI support, and a clean dependency-injection model. PostgreSQL was chosen for relational integrity, transactional order workflows, mature indexing, and operational reliability. React with Vite keeps the frontend fast to develop and easy to deploy.

## Performance Considerations

- Use pagination for large product, customer, and order lists.
- Add full-text search or trigram indexes if search becomes a primary workflow.
- Move dashboard counts to cached aggregates for very high write volume.
- Add database connection pooling in production.
- Use read replicas for reporting-heavy workloads.
- Keep frontend payloads compact by adding list/detail response variants as data grows.

## Security Considerations

- Credentials are provided through environment variables, not hardcoded application code.
- CORS origins are configurable per environment.
- Pydantic validates request payloads before business logic executes.
- Database constraints enforce critical invariants such as unique SKU, unique email, and non-negative stock.
- Global exception handlers prevent raw stack traces from leaking through normal API errors.
- Production deployments should add authentication, authorization, rate limiting, audit logs, and HTTPS-only cookies or tokens.

## Tradeoffs Made

- Authentication is not included because it was not part of the assessment requirements; the architecture leaves room for JWT or session-based auth.
- The frontend uses Context API and custom hooks instead of Redux Toolkit because the state needs are moderate and localized.
- Order deletion does not restore inventory. In real accounting systems, this is usually handled by explicit returns, cancellations, or adjustment records rather than silent stock mutation.
- Tests use SQLite for speed; production uses PostgreSQL. Critical database behavior is still enforced in migrations and models.

## Future Improvements

- Authentication and role-based permissions
- Pagination and server-side sorting
- Product import/export
- Order cancellation workflow with inventory adjustments
- Audit trail for stock changes
- Background jobs for reporting and notifications
- API versioning under `/api/v1`
- OpenTelemetry tracing and structured logging
- CI pipeline for linting, tests, image build, and migrations

## Screenshots

Add screenshots here after running the frontend:

- Dashboard
- Products
- Customers
- Orders
