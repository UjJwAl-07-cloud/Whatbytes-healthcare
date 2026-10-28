# WhatBytes Healthcare Management System

A full-stack healthcare management application built as part of the WhatBytes Full Stack Intern assignment. The application allows users to register, log in, and manage patient records, doctor records, and patient-doctor assignments through a modern web interface backed by a RESTful API.

## 🌐 Live Demo

**[🚀 Open WhatBytes Healthcare](https://whatbytes-healthcare.vercel.app)**

| Resource | Link |
|---|---|
| **Live Application** | [whatbytes-healthcare.vercel.app](https://whatbytes-healthcare.vercel.app) |
| **Backend API** | [whatbytes-healthcare-api.onrender.com](https://whatbytes-healthcare-api.onrender.com) |
| **API Health Check** | [Check API Status](https://whatbytes-healthcare-api.onrender.com/api/health) |

### ✨ What You Can Do

- 🔐 Register and log in securely using JWT authentication
- 🧑‍⚕️ Create and manage patient records
- 🩺 Browse and manage doctors
- 🔗 Assign doctors to patients and manage mappings
- 📊 View dashboard statistics and recent patients

**Tech Stack:** React · Vite · Node.js · Express · Prisma · PostgreSQL

> **Note:** The live application uses a hosted database. Please use demo data only and avoid entering real patient or medical information.

## 📋 Assignment Objectives

- Build a backend system for a healthcare application
- Implement user registration and login with JWT authentication
- Create RESTful API endpoints for managing patients, doctors, and their mappings
- Use PostgreSQL as the database
- Implement proper error handling and input validation
- Secure all sensitive endpoints with authentication
- Use environment variables for sensitive configurations
- Test all API endpoints using Postman

## ✨ Features

### Authentication
- User registration with name, email, and password
- User login with JWT token generation
- Secure password hashing with bcrypt
- Protected routes requiring valid JWT tokens

### Patient Management
- Create, read, update, and delete patient records
- Patients are scoped to the authenticated user (ownership enforcement)
- Input validation for patient data

### Doctor Management
- Create, read, update, and delete doctor records
- All authenticated users can view the doctor directory
- Input validation for doctor data

### Patient-Doctor Mappings
- Assign doctors to patients
- View all assignments for the authenticated user's patients
- View doctors assigned to a specific patient
- Remove assignments
- Duplicate assignment prevention

### React Frontend
- Modern, responsive healthcare management interface
- Dashboard with real-time statistics
- Patient and doctor management with search and filtering
- Patient-doctor mapping management
- Form validation and error handling
- Loading states and confirmation dialogs
- Session-based authentication with automatic token management

## 🛠 Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI library |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| Lucide React | Icons |
| CSS | Styling (custom CSS) |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| Prisma | ORM and database toolkit |
| PostgreSQL | Relational database |
| jsonwebtoken | JWT authentication |
| bcryptjs | Password hashing |
| express-validator | Input validation |
| helmet | Security headers |
| cors | Cross-origin resource sharing |
| morgan | HTTP request logging |
| dotenv | Environment variable management |

## 📁 Project Structure

```
whatbytes-healthcare/
├── client/                          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/                     # Axios instance and API services
│   │   │   ├── axios.js             # Configured Axios instance
│   │   │   ├── authApi.js           # Authentication API calls
│   │   │   ├── patientApi.js        # Patient CRUD API calls
│   │   │   ├── doctorApi.js         # Doctor CRUD API calls
│   │   │   └── mappingApi.js        # Mapping API calls
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ConfirmDialog.jsx    # Delete confirmation modal
│   │   │   ├── LoadingSpinner.jsx   # Loading indicator
│   │   │   ├── Notification.jsx     # Toast notifications
│   │   │   ├── ProtectedRoute.jsx   # Auth route guard
│   │   │   ├── SearchBar.jsx        # Search/filter input
│   │   │   └── Sidebar.jsx          # Navigation sidebar
│   │   ├── context/                 # React context providers
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   └── NotificationContext.jsx  # Notification state
│   │   ├── layouts/                 # Page layouts
│   │   │   ├── AuthLayout.jsx       # Login/Register layout
│   │   │   └── DashboardLayout.jsx  # Authenticated layout
│   │   ├── pages/                   # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Patients.jsx
│   │   │   ├── PatientDetail.jsx
│   │   │   ├── Doctors.jsx
│   │   │   ├── Mappings.jsx
│   │   │   └── NotFound.jsx
│   │   ├── App.jsx                  # Root component with routes
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
├── server/                          # Node.js backend
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   └── migrations/              # Database migrations
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js               # Environment validation
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth logic
│   │   │   ├── patientController.js # Patient CRUD logic
│   │   │   ├── doctorController.js  # Doctor CRUD logic
│   │   │   └── mappingController.js # Mapping logic
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification
│   │   │   ├── validate.js          # Validation middleware
│   │   │   └── errorHandler.js      # Centralized error handler
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── patientRoutes.js
│   │   │   ├── doctorRoutes.js
│   │   │   └── mappingRoutes.js
│   │   ├── validators/
│   │   │   ├── authValidators.js
│   │   │   ├── patientValidators.js
│   │   │   ├── doctorValidators.js
│   │   │   └── mappingValidators.js
│   │   ├── app.js                   # Express app configuration
│   │   └── server.js                # Server entry point
│   ├── .env.example
│   └── package.json
├── postman/
│   └── healthcare-api.postman_collection.json
├── .gitignore
├── package.json
└── README.md
```

### 📂 Directory Responsibilities Guide

#### Frontend (`client/src/`)
- **`api/`**: Configured Axios client with automatic Bearer token injection and modular API services (`authApi.js`, `patientApi.js`, `doctorApi.js`, `mappingApi.js`).
- **`components/`**: Accessible, reusable UI components including confirmation dialogs, notification toasts, search inputs, protected route guards, and navigation sidebars.
- **`context/`**: React Context providers managing global application state (`AuthContext` for JWT/session management, `NotificationContext` for user feedback).
- **`layouts/`**: Top-level page wrappers (`AuthLayout` for login/registration, `DashboardLayout` for authenticated navigation with mobile responsive drawer).
- **`pages/`**: Domain-specific views for the Dashboard, Patients list, Patient detail & doctor assignment, Doctors directory with profile inspection, and Mapping management.

#### Backend (`server/src/`)
- **`config/`**: Startup environment validation (`env.js`) and shared database client singleton (`prisma.js`) to prevent connection pool exhaustion.
- **`controllers/`**: Core business logic, response formatting, and strict ownership authorization checks ensuring users only manage their own records.
- **`middleware/`**: JWT extraction and signature verification (`auth.js`), validation result evaluation (`validate.js`), and centralized Prisma/HTTP error handling (`errorHandler.js`).
- **`routes/`**: Express route declarations binding endpoints to authentication guards, validation chains, and controller actions.
- **`validators/`**: Declarative `express-validator` schema rules enforcing type constraints, string bounds, and sanitization.

## 🗄 Database Models

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────────────┐       ┌──────────────┐
│     User     │       │   Patient    │       │ PatientDoctorMapping │       │    Doctor    │
├──────────────┤       ├──────────────┤       ├──────────────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)      │──┐    │ id (PK)              │    ┌──│ id (PK)      │
│ name         │  └───>│ userId (FK)  │  └───>│ patientId (FK)       │    │  │ name         │
│ email (UQ)   │       │ name         │       │ doctorId (FK)        │<───┘  │ specialization│
│ passwordHash │       │ age          │       │ createdAt            │       │ email        │
│ createdAt    │       │ gender       │       └──────────────────────┘       │ phone        │
│ updatedAt    │       │ address      │                                      │ createdAt    │
└──────────────┘       │ phone        │       Unique: (patientId, doctorId)  │ updatedAt    │
                       │ createdAt    │                                      └──────────────┘
                       │ updatedAt    │
                       └──────────────┘
```

### Relationships
- **User → Patient**: One-to-many (a user can create multiple patients)
- **Patient → PatientDoctorMapping**: One-to-many (a patient can be assigned to multiple doctors)
- **Doctor → PatientDoctorMapping**: One-to-many (a doctor can be assigned to multiple patients)
- **PatientDoctorMapping**: Unique constraint on (patientId, doctorId) prevents duplicates
- Cascade delete: Deleting a patient or doctor removes their associated mappings

## 📦 Prerequisites

Before setting up the project, ensure you have:

- **Node.js** v18 or higher (tested with v24.21.0)
- **npm** v9 or higher (tested with v11.19.0)
- **PostgreSQL** v14 or higher
- **Git** (for version control)

## 🐘 PostgreSQL Setup

1. **Install PostgreSQL** if not already installed:
   - Download from https://www.postgresql.org/download/
   - During installation, set a password for the `postgres` user

2. **Create the database**:
   ```bash
   # Using psql (PostgreSQL CLI)
   psql -U postgres
   
   # In the psql prompt:
   CREATE DATABASE whatbytes_healthcare;
   \q
   ```

   Or using pgAdmin:
   - Open pgAdmin
   - Right-click on Databases → Create → Database
   - Enter `whatbytes_healthcare` as the database name
   - Click Save

## ⚙️ Environment Configuration

### Backend (.env)

Create a `.env` file in the `server/` directory based on `.env.example`:

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/whatbytes_healthcare
JWT_SECRET=your-very-strong-secret-key-at-least-32-characters
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```

> **Important**: Replace `your_password` with your actual PostgreSQL password and use a strong, unique JWT secret.

### Frontend (.env)

Create a `.env` file in the `client/` directory based on `.env.example`:

```bash
cd client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd whatbytes-healthcare
```

### 2. Install dependencies

Install all dependencies for both frontend and backend using the root convenience script:

```bash
npm run install:all
```

Or manually install within each directory:

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Set up the database

Ensure your PostgreSQL service is running and the database `whatbytes_healthcare` has been created, then apply migrations:

```bash
cd server

# Generate Prisma client
npx prisma generate

# Apply existing migrations
npx prisma migrate deploy
```

### 4. Start the application

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

### 5. Open the application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

## 🔐 Authentication Workflow

1. **Register**: Create an account at `/register` with name, email, and password
2. **Login**: Sign in at `/login` with email and password
3. **Token Storage**: JWT token is stored in `sessionStorage` (cleared on browser/tab close)
4. **Authenticated Requests**: Token is automatically attached to all API requests via Axios interceptor
5. **Token Expiry**: If a token expires, the user is redirected to login
6. **Logout**: Clears session storage and redirects to login

> **Security Note**: Storing JWT tokens in `sessionStorage` is appropriate for this demonstration application. In a production environment, consider using HttpOnly cookies or other server-side session management for enhanced security.

## 📡 API Endpoint Reference

All endpoints except registration and login require a valid JWT token in the `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register/` | Register a new user | No |
| POST | `/api/auth/login/` | Login and receive JWT | No |

### Patients

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/patients/` | Create a patient | Yes |
| GET | `/api/patients/` | List user's patients | Yes |
| GET | `/api/patients/:id/` | Get patient details | Yes (owner) |
| PUT | `/api/patients/:id/` | Update a patient | Yes (owner) |
| DELETE | `/api/patients/:id/` | Delete a patient | Yes (owner) |

### Doctors

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/doctors/` | Create a doctor | Yes |
| GET | `/api/doctors/` | List all doctors | Yes |
| GET | `/api/doctors/:id/` | Get doctor details | Yes |
| PUT | `/api/doctors/:id/` | Update a doctor | Yes |
| DELETE | `/api/doctors/:id/` | Delete a doctor | Yes |

### Patient-Doctor Mappings

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/mappings/` | Assign a doctor to a patient | Yes (patient owner) |
| GET | `/api/mappings/` | List user's mappings | Yes |
| GET | `/api/mappings/:patientId/` | Get doctors for a patient | Yes (patient owner) |
| DELETE | `/api/mappings/:id/` | Remove a mapping | Yes (patient owner) |

**Total: 16 API endpoints**

### Response Format

All API responses follow a consistent format:

**Success:**
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Successful retrieval or update |
| 201 | Successful creation |
| 204 | Successful deletion (no response body) |
| 400 | Invalid input / validation error |
| 401 | Missing or invalid authentication |
| 404 | Resource not found |
| 409 | Conflict (duplicate resource) |
| 500 | Internal server error |

## 🖥 Browser Demonstration Guide

### Step 1: Register
1. Open http://localhost:5173
2. Click "Register" or navigate to `/register`
3. Fill in name, email, password, and confirm password
4. Submit to create an account
5. You'll be redirected to the login page

### Step 2: Login
1. Enter your email and password at `/login`
2. On success, you'll be redirected to the dashboard

### Step 3: Dashboard
- View your statistics: patient count, doctor count, and mapping count
- Use quick actions to navigate to patient/doctor/mapping creation

### Step 4: Manage Patients
1. Navigate to Patients via the sidebar
2. Click "Add Patient" to create a patient (name, age, gender, address, phone)
3. Use the search bar to filter patients
4. Click on a patient to view details
5. Edit or delete patients using the action buttons

### Step 5: Manage Doctors
1. Navigate to Doctors via the sidebar
2. Add doctors with name, specialization, email, and phone
3. Search by name or specialization
4. Edit or delete doctor records

### Step 6: Manage Mappings
1. Navigate to Mappings via the sidebar
2. Select a patient and a doctor from the dropdowns
3. Click "Create Mapping" to assign the doctor
4. Filter mappings by patient
5. Remove mappings using the delete button

### Step 7: Patient Detail View
1. Click "View" on any patient
2. See patient information and assigned doctors
3. Assign new doctors or remove existing assignments

## 📬 Postman Collection

A Postman collection is included at `postman/healthcare-api.postman_collection.json`.

### How to use:
1. Import the collection into Postman
2. The collection uses variables: `baseUrl`, `authToken`, `patientId`, `doctorId`, `mappingId`
3. Default `baseUrl` is `http://localhost:5000/api`
4. Run requests in order:
   - Register a user
   - Login (token is automatically saved)
   - Create/Read/Update/Delete patients
   - Create/Read/Update/Delete doctors
   - Create/Read/Delete mappings
5. Test scripts automatically save IDs and tokens for subsequent requests

## 🔧 Common Errors and Troubleshooting

| Error | Solution |
|-------|----------|
| `ECONNREFUSED` on port 5000 | Ensure the backend server is running |
| `P1001: Can't reach database` | Check PostgreSQL is running and `DATABASE_URL` is correct |
| `CORS error` in browser | Ensure `CLIENT_ORIGIN` in `.env` matches the frontend URL |
| `401 Unauthorized` | Login again; your token may have expired |
| `Prisma client not generated` | Run `npx prisma generate` in the server directory |
| `Migration failed` | Ensure the database exists and credentials are correct |
| Port already in use | Change `PORT` in `.env` or stop the conflicting process |

## 🔒 Security Considerations

- **Passwords** are hashed using bcrypt with a salt factor of 12
- **JWT tokens** use HS256 signing with a secret from environment variables
- **Patient data** is scoped to the authenticated user (ownership enforcement)
- **Input validation** is performed server-side using express-validator
- **Security headers** are set by helmet middleware
- **CORS** is configured to allow only the specified frontend origin
- **SQL injection** is prevented through Prisma's parameterized queries
- **Password hashes** are never returned in API responses
- **Environment variables** store all sensitive configuration
- **Token storage**: JWT tokens are stored in `sessionStorage` which is cleared when the browser tab closes. For production use, HttpOnly cookies are recommended.

## ⚠️ Known Limitations

1. **PostgreSQL Required**: The application requires a running PostgreSQL instance. SQLite is not supported as a fallback.
2. **Session Storage**: JWT tokens are stored in browser sessionStorage, which is not the most secure option for production. HttpOnly cookies would be more appropriate.
3. **No Rate Limiting**: API rate limiting is not implemented. Consider adding `express-rate-limit` for production.
4. **No Email Verification**: User registration does not include email verification.
5. **No Password Reset**: Password reset functionality is not included (not required by the assignment).
6. **Single Server**: The application runs on a single server without load balancing.

## 📦 Git Submission & Repository Setup

If initializing a fresh Git repository for assignment submission, the configured `.gitignore` prevents `.env` credentials, dependencies, and build outputs from being tracked:

```bash
# Initialize git repository
git init

# Stage all tracked source files
git add .

# Create initial submission commit
git commit -m "feat: complete WhatBytes Healthcare Management System assignment"

# Add remote and push (replace with your repository URL)
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## 👨‍💻 Author

**Ujjwal Tripathi**  
WhatBytes Full Stack Intern Assignment

---

*Built with ❤️ using React, Node.js, Express, PostgreSQL, and Prisma*
