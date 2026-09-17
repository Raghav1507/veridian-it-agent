# Veridian Internal IT Support Agent

> An internal IT support platform that helps employees troubleshoot common technical issues, raise support tickets, and track their requests from a single interface.

Veridian provides a role-based IT support workflow where employees can interact with a support agent and create tickets, while IT staff can manage, assign, prioritize, and resolve those tickets through an administrative dashboard.

---

## 📌 Overview

Internal IT teams often receive repetitive support requests such as VPN connectivity problems, network issues, and other common technical incidents.

Veridian streamlines this process by combining an employee-facing support interface with a centralized ticket management system.

The application provides:

- Employee authentication
- IT support chat
- Automatic ticket creation
- Ticket tracking
- IT staff administration
- Ticket status and priority management
- Role-based access control
- Audit logging

---

## 🎯 Problem Statement

Employees commonly depend on IT teams for recurring technical problems. Without a structured support workflow, requests can become difficult to track and prioritize.

Veridian addresses this by providing a centralized system where:

1. Employees describe their technical problem.
2. The support agent provides an initial diagnosis.
3. A support ticket can be created directly from the interaction.
4. IT staff can review and manage the ticket.
5. Employees can track the progress of their request.

---

## 💡 Solution

Veridian connects the employee support experience with a backend ticket-management system.

```text
Employee
   │
   ▼
Authentication
   │
   ▼
IT Support Chat
   │
   ▼
Problem Description
   │
   ▼
Initial Diagnosis
   │
   ▼
Ticket Creation
   │
   ▼
IT Staff Dashboard
   │
   ├── Assign Ticket
   ├── Change Priority
   └── Change Status
   │
   ▼
Audit Log
```

This creates a complete support workflow from **problem reporting → ticket creation → IT management → resolution tracking**.

---

## ✨ Key Features

### 👤 Employee Portal

- User registration and login
- Session-based authentication
- IT support chat interface
- Troubleshooting guidance
- Automatic ticket creation
- View personal tickets
- View ticket details
- Track ticket status and priority
- Secure logout

### 🧑‍💻 IT Staff Portal

- Dedicated administrative dashboard
- View all support tickets
- Ticket statistics
- View ticket details
- Assign tickets to IT staff
- Update ticket status
- Update ticket priority
- Manage the support workflow

### 🔐 Security & Access Control

- Password hashing
- HTTP-only authentication cookies
- Session-based authentication
- Role-based authorization
- Employee/IT staff access separation
- Protected administrative operations
- Audit logging for ticket activities
- Environment variables for sensitive configuration

---

## 🔄 Complete Application Workflow

### Employee Workflow

```text
Register / Login
       ↓
Employee Dashboard
       ↓
Open IT Support Chat
       ↓
Describe Technical Problem
       ↓
Support Agent Diagnosis
       ↓
Create Support Ticket
       ↓
Receive Ticket Number
       ↓
View Ticket in My Tickets
       ↓
Track Status / Priority
```

### IT Staff Workflow

```text
IT Staff Login
       ↓
Admin Dashboard
       ↓
View All Tickets
       ↓
Open Ticket
       ↓
Review Problem
       ↓
Assign Ticket
       ↓
Set Priority
       ↓
Update Status
       ↓
Resolve Ticket
       ↓
Activity Recorded in Audit Log
```

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    A[Employee] --> B[Next.js Frontend]
    B --> C[FastAPI REST API]

    C --> D[Authentication]
    C --> E[Ticket Management]
    C --> F[Support Agent]
    C --> G[Audit Logging]

    D --> H[(PostgreSQL)]
    E --> H
    G --> H

    I[IT Staff] --> B
```

### Architecture Layers

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | Next.js / React / TypeScript | User interface and client-side interactions |
| Backend | FastAPI / Python | REST APIs, authentication and business logic |
| ORM | SQLAlchemy | Database interaction |
| Database | PostgreSQL | Persistent application data |
| Migrations | Alembic | Database schema versioning |
| Authentication | Session Cookies | User authentication and authorization |
| Server | Uvicorn | FastAPI application server |

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- CSS

### Backend

- Python
- FastAPI
- SQLAlchemy
- Uvicorn

### Database

- PostgreSQL
- Alembic

### Development

- Git
- GitHub
- REST APIs

---

## 📂 Project Structure

```text
veridian-it-agent/
│
├── app/
│   ├── main.py
│   ├── database.py
│   ├── core/
│   ├── models/
│   ├── routes/
│   └── services/
│
├── migrations/
│   └── versions/
│
├── frontend/
│   ├── app/
│   ├── components/
│   └── public/
│
├── .env.example
├── .gitignore
├── README.md
└── requirements.txt
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new employee |
| `POST` | `/auth/login` | Authenticate a user |
| `GET` | `/auth/me` | Get the currently authenticated user |
| `POST` | `/auth/logout` | End the current session |

### Tickets

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/tickets` | Create a support ticket |
| `GET` | `/tickets` | Get tickets for the current user |
| `GET` | `/tickets/{ticket_id}` | Get ticket details |
| `PATCH` | `/tickets/{ticket_id}` | Update ticket information |

### Administration

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/tickets` | Retrieve tickets for IT staff |

---

## 🧪 Example Use Case

### Problem

An employee reports:

> **"My laptop cannot connect to the company VPN."**

### Workflow

```text
Employee reports VPN problem
          ↓
Support Agent analyzes the issue
          ↓
Ticket is created
          ↓
Unique ticket number generated
          ↓
IT Staff sees ticket
          ↓
Ticket priority/status updated
          ↓
Employee tracks progress
          ↓
Ticket resolved
```

Example ticket information:

```text
Ticket Number : IT-2026-XXXXXX
Category      : Network
Priority      : Medium
Status        : Open
```

---

## 📊 Ticket Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Open
    Open --> InProgress
    InProgress --> Resolved
    Resolved --> Closed
    InProgress --> Open
```

The ticket lifecycle allows IT staff to move requests through the support process while maintaining a record of important updates.

---

## 🔐 Security

Veridian implements several application-level security mechanisms:

- Passwords are stored using secure password hashing.
- Authentication uses HTTP-only session cookies.
- Sessions are protected from direct client-side cookie access.
- Role-based authorization restricts IT staff operations.
- Employees cannot perform IT staff-only ticket updates.
- Sensitive environment configuration is excluded from version control.
- Important ticket operations are recorded through audit logs.

> **Note:** Production deployment would require additional hardening such as HTTPS, secure production cookies, secret management, rate limiting, monitoring, and production infrastructure configuration.

---

## 🗄️ Database

The application uses PostgreSQL for persistent storage.

The database contains the core entities required for the support workflow, including:

```text
Users
  │
  ├── Employee / IT Staff
  │
  ▼
Tickets
  │
  ├── Status
  ├── Priority
  ├── Category
  └── Assignment
  │
  ▼
Audit Logs
```

Alembic is used to manage database schema migrations.

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

- Python 3.11+
- Node.js
- npm
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Raghav1507/veridian-it-agent.git
cd veridian-it-agent
```

### 2. Backend setup

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file using `.env.example` as a reference.

Example:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/veridian
```

Do not commit the `.env` file to GitHub.

### 4. Run database migrations

```bash
alembic upgrade head
```

### 5. Start the backend

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

### 6. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://127.0.0.1:3000
```

---

## 📸 Screenshots

### Employee Dashboard

Add your employee dashboard screenshot here.

```text
screenshots/dashboard.png
```

### IT Support Chat

Add your support chat screenshot here.

```text
screenshots/chat.png
```

### Ticket Details

Add your ticket details screenshot here.

```text
screenshots/ticket-details.png
```

### IT Admin Dashboard

Add your admin dashboard screenshot here.

```text
screenshots/admin-dashboard.png
```

> Screenshots can be added to the repository later and referenced using Markdown image syntax.

---

## 📈 MVP Scope

The current MVP includes:

- [x] Employee registration
- [x] User authentication
- [x] Session management
- [x] Employee dashboard
- [x] IT support chat
- [x] Automatic ticket creation
- [x] Ticket listing
- [x] Ticket details
- [x] IT staff dashboard
- [x] Ticket assignment
- [x] Ticket priority management
- [x] Ticket status management
- [x] Role-based authorization
- [x] PostgreSQL persistence
- [x] Alembic migrations
- [x] Audit logging

---

## 🔮 Future Improvements

The platform can be extended with:

- LLM-based troubleshooting
- Retrieval-Augmented Generation (RAG)
- Internal IT knowledge base
- Semantic search for support documentation
- Automatic ticket categorization
- AI-based priority prediction
- Email and Slack notifications
- File and screenshot attachments
- Real-time ticket updates
- Enterprise SSO
- Advanced analytics and reporting
- Production cloud deployment
- Monitoring and observability

---

## 🎯 Project Objective

The objective of Veridian is to demonstrate how an internal IT support workflow can be digitized into a single platform combining:

**Employee Support + Automated Ticketing + IT Administration + Secure Backend + Auditability**

The project focuses on building a functional end-to-end MVP with a clear separation between employee and IT staff workflows.

---

## 👨‍💻 Author

### Raghav Singhal

Computer Science Engineering | AI & ML

GitHub:  
https://github.com/Raghav1507

---

## 📄 License

This project is intended for educational, evaluation, and demonstration purposes.