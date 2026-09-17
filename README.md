# Veridian Internal IT Support Agent

An internal IT support platform that helps employees diagnose common technical issues, create support tickets, and track ticket status. IT staff can manage tickets, update priorities/statuses, and review activity through an admin dashboard.

## 🚀 Features

### Employee
- Secure registration and login
- AI-style IT support chat interface
- Troubleshooting guidance for common IT issues
- Automatic ticket creation from support conversations
- View personal support tickets
- View detailed ticket information
- Track ticket status and priority
- Logout/session management

### IT Staff / Admin
- Admin dashboard
- View all support tickets
- Ticket statistics
- Update ticket status
- Update ticket priority
- Assign tickets to IT staff
- View ticket details
- Audit logging for important ticket activities

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      Employee       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Next.js Frontend  │
                    │  Chat / Dashboard   │
                    └──────────┬──────────┘
                               │
                         REST API / HTTP
                               │
                               ▼
                    ┌─────────────────────┐
                    │   FastAPI Backend   │
                    │                     │
                    │ Authentication      │
                    │ Ticket Management   │
                    │ Support Agent       │
                    │ Audit Logging       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │                     │
                    │ Users               │
                    │ Tickets             │
                    │ Audit Logs          │
                    └─────────────────────┘
🛠️ Tech Stack
Frontend
Next.js
React
TypeScript
CSS
Backend
Python
FastAPI
SQLAlchemy
Alembic
Database
PostgreSQL
Authentication
HTTP-only session cookies
Role-based access control
Development Tools
Git
GitHub
Uvicorn
📂 Project Structure
veridian-it-agent/
│
├── app/
│   ├── main.py
│   ├── database.py
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── core/
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
⚙️ Setup
1. Clone the repository
git clone https://github.com/Raghav1507/veridian-it-agent.git
cd veridian-it-agent
2. Backend setup

Create and activate a virtual environment:

python -m venv venv

Windows:

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt
3. Configure environment variables

Create a .env file based on .env.example.

Example:

DATABASE_URL=postgresql://username:password@localhost:5432/veridian
4. Run database migrations
alembic upgrade head
5. Start the backend
uvicorn app.main:app --reload

Backend:

http://127.0.0.1:8000
6. Start the frontend

Open another terminal:

cd frontend
npm install
npm run dev

Frontend:

http://127.0.0.1:3000
🔌 API Endpoints
Authentication
Method	Endpoint	Description
POST	/auth/register	Register a new employee
POST	/auth/login	Login
GET	/auth/me	Get current user
POST	/auth/logout	Logout
Tickets
Method	Endpoint	Description
POST	/tickets	Create a ticket
GET	/tickets	Get user's tickets
GET	/tickets/{ticket_id}	Get ticket details
PATCH	/tickets/{ticket_id}	Update ticket
Admin
Method	Endpoint	Description
GET	/admin/tickets	View all tickets
🔐 Security
Passwords are securely hashed before storage.
Authentication uses HTTP-only session cookies.
Role-based authorization protects IT/admin operations.
Employees cannot modify tickets restricted to IT staff.
Environment secrets are excluded from Git using .gitignore.
Audit logs record important ticket activities.
🧪 Example Workflow
Employee
   │
   ▼
Login
   │
   ▼
Open IT Support Chat
   │
   ▼
Describe technical problem
   │
   ▼
Support Agent provides diagnosis
   │
   ▼
Ticket created automatically
   │
   ▼
Employee tracks ticket
   │
   ▼
IT Staff reviews ticket
   │
   ▼
Status / Priority updated
   │
   ▼
Audit log generated
📊 Current MVP

The current MVP demonstrates:

Authentication
Employee dashboard
IT support chat
Automatic ticket creation
Ticket listing
Ticket details
IT admin dashboard
Ticket status management
Priority management
Role-based authorization
Audit logging
PostgreSQL persistence
Database migrations
📌 Future Improvements
Integration with a production LLM
RAG-based internal IT knowledge base
Email/Slack notifications
File and screenshot attachments
Advanced analytics
Real-time ticket updates
SSO integration
Production deployment
Automated ticket categorization and priority prediction
👨‍💻 Author

Raghav Singhal