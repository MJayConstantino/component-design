# Component Design Project

Welcome to the **Component Design Project**! This project is a full-stack application that demonstrates CRUD operations using a backend built with Node.js, Express, and Prisma, and a frontend built with React and TypeScript.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

This project is designed to showcase the following:

- Backend API with CRUD operations for managing resources like employees, products, and members.
- Frontend interface for interacting with the backend, including forms for creating, editing, and deleting data.
- Testing API endpoints using Jest and Supertest.

---

## Technologies Used

### Backend:

- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for creating RESTful APIs.
- **Prisma**: ORM for database management.
- **PostgreSQL**: Database for storing application data.

### Frontend:

- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Strongly typed JavaScript for better development experience.
- **React Router**: For navigation between pages.

### Testing:

- **Jest**: Testing framework for JavaScript.
- **Supertest**: HTTP assertions for testing API endpoints.

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (for the database)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/component-design.git
   cd component-design
   ```

2. Install dependencies for both the backend and frontend:

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up the environment variables:

Create a .env file in the backend directory and add the following:
`env
    DATABASE_URL=your_postgresql_connection_string
    PORT=3000
    `

4. Initialize the database:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

### Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:

   ```bash
   cd client
   npm start
   ```

3. You can run both at the same time:
   ```bash
   npm run start
   ```

Open your browser and navigate to:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Project Structure

```
component-design/
├── backend/
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── server.ts        # Main server file
│   │   └── prisma/          # Prisma schema and migrations
│   ├── [package.json](http://_vscodecontentref_/1)         # Backend dependencies
│   └── .env                 # Environment variables
├── client/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # React pages
│   │   └── App.tsx          # Main React app file
│   ├── [package.json](http://_vscodecontentref_/2)         # Frontend dependencies
│   └── .env                 # Environment variables (if needed)
└── [README.md](http://_vscodecontentref_/3)                # Project documentation
```
