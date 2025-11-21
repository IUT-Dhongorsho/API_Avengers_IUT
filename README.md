# CareForAll – Microservices Donation & Campaign Platform

CareForAll is a production‑ready, scalable microservices architecture designed to handle a donation ecosystem with reliability, atomic financial transactions, authentication, caching, and internal API communication via an API Gateway. The project follows clean folder structure, Docker‑based deployments, Prisma ORM for database modeling, and Redis caching for high‑performance query layers.

---

## 🚀 Architecture Overview

CareForAll consists of **independent microservices**, each having its own:

* Database schema (via Prisma)
* Routes and controllers
* Docker container
* Error handling

### 🏛 Microservices

| Service                  | Description                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| **Auth Service**         | Handles user creation, login, logout, token issuance, secure cookie storage, and refresh flow. |
| **Campaign Service**     | Manages donation campaigns, campaign listings, and Redis caching.                              |
| **Donation Service**     | Handles donation tracking, linking users → campaigns.                                          |
| **Payment Service**      | Contains isolated bank logic, atomic operations, and transaction-safe balance updates.         |
| **Notification Service** | Sends emails, SMS, or in-app notifications (future extension).                                 |
| **API Gateway**          | Single-entry point: request forwarding, route mapping, and centralized middleware.             |

---

## 📦 Tech Stack

* **Node.js (Express)** – Backend logic for each microservice
* **Prisma ORM** – Typed DB access and schema per microservice
* **PostgreSQL** – Main relational database
* **Redis** – High-speed caching for campaign listings
* **Docker + Docker Compose** – Production-ready service orchestration
* **JWT + HTTP‑only Cookies** – Secure authentication mechanism
* **API Gateway** – Internal reverse proxy for routing traffic

---

## 🗂 Folder Structure

```
careforall/
│
├── api-gateway/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── server.js
│
├── auth-service/
│   ├── prisma/
│   ├── src/
│   └── Dockerfile
│
├── campaign-service/
├── donation-service/
├── payment-service/
├── notification-service/
│
└── docker-compose.yml
```

Every service is fully isolated and can be maintained independently.

---

## 🐳 Running With Docker

### 1️⃣ Build and start all services

```
docker-compose up --build -d
```

### 2️⃣ Check running containers

```
docker ps
```

### 3️⃣ Stop containers

```
docker-compose down
```

---

## 🔐 Authentication Flow

1. User logs in → Auth service verifies credentials
2. Auth returns JWT inside a **HTTP‑only cookie**
3. API Gateway middleware (`protect`) decodes token
4. If valid → request continues to microservices
5. If invalid → request blocked

No microservice directly accesses the User table from Auth service.

---

## 💳 Payment Architecture

The Payment service contains:

* Bank class (balance validation, overdraft protection)
* Atomic Prisma transactions
* Promise‑queue so no two transactions overlap
* Full error handling layer

This ensures **no negative balances** and no race conditions.

---

## 📌 Redis Caching (Campaign Service)

Campaign service uses Redis to:

* Cache campaign listings
* Reduce DB load
* Improve page load performance

**Eviction Strategy:**

* LRU (default)
* Cache invalidation on: `createCampaign`, `updateCampaign`, `deleteCampaign`

---

## 📁 Environment Variables

Each service contains its own `.env`:

```
DATABASE_URL="postgresql://user:password@db:5432/authdb"
JWT_SECRET="your-secret"
REDIS_URL="redis://redis:6379"
AUTH_SERVICE_URL="http://auth-service:5000"
```

---

## 🧪 Testing

You can test each service using:

```
npm run dev
```

or trigger from API Gateway:

```
GET http://localhost:4000/api/auth/login
```

---

## 🌐 API Gateway Endpoints

Example route mapping:

```
/api/auth → auth-service
/api/campaign → campaign-service
/api/payment → payment-service
```

---

## 🔥 Why Microservices?

CareForAll uses microservices so each module can be:

* Independently deployable
* Scalable based on its own load (ex: payment-service separate autoscaling)
* Secure (compromised one does *not* expose others)
* Maintainable without breaking entire system

---

## 🤝 Contributing

PRs and feature requests are welcome.
Ask questions anytime.

---

## 📄 License

This project is licensed under the MIT License.

---

**CareForAll – A complete microservices ecosystem for donations, campaigns & payments.**
