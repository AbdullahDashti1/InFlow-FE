# InFlow - Frontend

## Overview
The frontend application for InFlow, a comprehensive invoice and quote management system. Built with React and Tailwind CSS, it provides a modern, responsive interface for managing clients, generating quotes, and tracking invoices.

## Features
- **Authentication**: Secure JWT-based Login and Registration with multi-user support (Company data isolation).
- **Dashboard**: Real-time overview of revenue, outstanding balances, and recent activity (Collapsible Sidebar).
- **Client Management**: Add, edit, and list clients with search functionality.
- **Quote Management**: Create dynamic quotes with line items, download as PDF, and delete quotes.
- **Invoice Management**: Generate invoices from quotes, track status, delete invoices, and manage payments.
- **Payment Tracking**: Record, update, and cancel payments with strict balance validation logic.
- **Settings**: Manage user profile and update passwords securely.
- **Responsive Design**: Premium UI built with Tailwind CSS.

## Technologies Used
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Forms**: React Hook Form
- **Validation**: Zod (via react-hook-form)
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Node.js (v16+)
- NPM or Yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd InFlow-FE
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory (optional if using default local backend):
   ```env
   VITE_BACK_END_SERVER_URL=http://localhost:8000/api
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## Project Structure
```
src/
├── components/       # Reusable UI components
│   ├── Layout/       # Sidebar and Layout wrappers
│   └── NavBar/       # Navigation components
├── contexts/         # React Contexts (User/Auth)
├── pages/            # Page components
│   ├── Clients/      # Client management pages
│   ├── Invoices/     # Invoice management pages
│   ├── Quotes/       # Quote management pages
│   ├── Dashboard.jsx # Main dashboard
│   ├── Login.jsx     # Authentication pages
│   └── Register.jsx
├── services/         # API service configurations
├── App.jsx           # Main application routing
└── main.jsx          # Entry point
```

## Backend Integration
This frontend is designed to work with the InFlow Backend API. Ensure the backend is running locally on port 8000 (or update the `.env` file).

## References
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

## Backend Repository
https://github.com/yousifalansari/InFlow-BE