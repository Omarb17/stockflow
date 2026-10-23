<img width="1917" height="828" alt="Capture d&#39;écran 2026-10-23 164202" src="https://github.com/user-attachments/assets/936f6a35-cf19-4b34-b4cd-b163291049ff" />

<img width="1919" height="838" alt="Capture d&#39;écran 2026-10-23 164229" src="https://github.com/user-attachments/assets/70b3a2ef-4b21-4d50-a6d9-4c319a26efeb" />

### Frontend

- **Next.js** — React framework using the App Router
- **TypeScript** — Type-safe development
- **Material UI (MUI)** — UI components and responsive layouts
- **MUI Icons** — Interface icons
- **Axios** — HTTP requests to the backend API
- **TanStack Query** — API data fetching, caching, and synchronization
- **React Hook Form** — Form management
- **Zod** — Input validation
- **Recharts** — Dashboard charts

### Backend

- **Java** — Programming language
- **Spring Boot** — REST API development
- **Spring Security** — Application security
- **JWT** — Stateless authentication
- **Spring Data JPA / Hibernate** — Database access
- **PostgreSQL** — Relational database
- **Flyway** — Database migrations


# StockFlow — Inventory Management System

StockFlow is a full-stack inventory management application designed to help businesses manage products, categories, warehouses, stock movements, suppliers, and purchase orders from a centralized dashboard.

The application provides secure authentication, real-time stock visibility through API-driven updates, and tools for monitoring inventory levels and managing purchasing operations.

## Features

### Authentication and Security

- User registration and login
- JWT-based authentication
- Password encryption using BCrypt
- Role-based access control with USER and ADMIN roles
- Protected API endpoints

### Product Management

- Create, view, update, and archive products
- Manage product categories
- Track product SKUs, prices, units, and reorder levels
- Search, filter, sort, and paginate products

### Warehouse Management

- Create and manage warehouses
- Store warehouse details and unique codes
- Activate or archive warehouses

### Inventory Management

- Track stock quantities by product and warehouse
- Receive and issue stock
- Adjust stock quantities
- Transfer stock between warehouses
- Record stock movements and operation reasons
- Identify products with low stock levels

### Supplier Management

- Create, view, update, and archive suppliers
- Store supplier contact information
- Search and filter suppliers

### Purchase Order Management

- Create purchase orders with multiple products
- Manage order statuses
- Confirm and cancel purchase orders
- Record partial and complete deliveries
- Update inventory when ordered products are received

### Dashboard

- Overview of inventory operations
- Product and warehouse summaries
- Low-stock monitoring
- Recent stock movements
- Purchasing activity

## Technology Stack

### Frontend

- **Next.js** — React framework using the App Router
- **TypeScript** — Type-safe development
- **Material UI (MUI)** — UI components and responsive layouts
- **MUI Icons** — Interface icons
- **Axios** — HTTP requests to the backend API
- **TanStack Query** — API data fetching, caching, and synchronization
- **React Hook Form** — Form management
- **Zod** — Input validation
- **Recharts** — Dashboard charts

### Backend

- **Java** — Programming language
- **Spring Boot** — REST API development
- **Spring Security** — Application security
- **JWT** — Stateless authentication
- **Spring Data JPA / Hibernate** — Database access
- **PostgreSQL** — Relational database
- **Flyway** — Database migrations

### Development Tools

- Git and GitHub
- Maven
- npm

## Getting Started

### Prerequisites

Install the following before running the application:

- Java 21 or another Java version supported by your Spring Boot configuration
- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Omarb17/stockflow.git
cd stockflow
```

### 2. Configure PostgreSQL

Create a database named `stockflow` in PostgreSQL.

Configure your database connection in `stockflow-api/src/main/resources/application.properties` or through environment variables.

Example configuration:

```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/stockflow}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:your_password}

spring.jpa.hibernate.ddl-auto=validate
spring.flyway.enabled=true
```

Ensure the Flyway migration files match your entities and database schema before using `ddl-auto=validate`.

### 3. Configure the Backend

Set a secure JWT secret through an environment variable:

```text
JWT_SECRET=your-secure-secret
FRONTEND_URL=http://localhost:3000
```

Use a strong, randomly generated secret for JWT signing. Do not commit credentials or secrets to GitHub.

From the project root, navigate to the backend:

```bash
cd stockflow-api
```

Run the application using the Maven wrapper if included

The API will normally be available at:

```text
http://localhost:8080
```

### 4. Configure the Frontend

Open a second terminal:

```bash
cd stockflow-client
npm install
```

Create a `.env.local` file in the frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Start the Next.js development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

## API Endpoints

The following endpoints describe the intended REST API organization. Authentication and role restrictions apply where configured.

| Method | Endpoint                   | Description              |
| ------ | -------------------------- | ------------------------ |
| POST   | `/api/auth/register`       | Register a user          |
| POST   | `/api/auth/login`          | Authenticate a user      |
| GET    | `/api/products`            | Retrieve products        |
| POST   | `/api/products`            | Create a product         |
| GET    | `/api/categories`          | Retrieve categories      |
| GET    | `/api/warehouses`          | Retrieve warehouses      |
| GET    | `/api/inventory/stock`     | View stock records       |
| POST   | `/api/inventory/receive`   | Receive stock            |
| POST   | `/api/inventory/issue`     | Issue stock              |
| POST   | `/api/inventory/adjust`    | Adjust stock             |
| GET    | `/api/inventory/movements` | View stock movements     |
| GET    | `/api/inventory/low-stock` | View low-stock records   |
| POST   | `/api/inventory/transfers` | Transfer stock           |
| GET    | `/api/suppliers`           | Retrieve suppliers       |
| POST   | `/api/suppliers`           | Create a supplier        |
| GET    | `/api/purchase-orders`     | Retrieve purchase orders |
| POST   | `/api/purchase-orders`     | Create a purchase order  |

Consult the implemented controllers for the exact supported HTTP methods, query parameters, and request bodies.

## Authentication

After a successful login, the backend returns a JWT access token.

Protected requests should include the token in the HTTP Authorization header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The frontend should handle authentication errors, unauthorized access, and expired tokens appropriately.

## Inventory Workflow

A typical inventory workflow is:

1. Create product categories and products.
2. Register warehouses and suppliers.
3. Create a purchase order for a supplier.
4. Confirm the purchase order.
5. Receive all or part of the ordered products.
6. Update inventory quantities and record stock movements.
7. Transfer stock between warehouses when necessary.
8. Monitor low-stock products and create new purchase orders.

## Design and User Experience

StockFlow uses Material UI to provide a consistent, responsive interface across desktop and mobile screens.

The dashboard is designed around a shared application layout with navigation, summary cards, data tables, forms, filters, and confirmation dialogs. TanStack Query manages server data, while React Hook Form and Zod help validate user input.
