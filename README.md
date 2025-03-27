# Study Planner - Setup Guide

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [PostgreSQL](https://www.postgresql.org/download/) (Database management system)
- [Git](https://git-scm.com/) (Optional, for cloning the repository)

## Installing PostgreSQL

### Windows:

1. Download the PostgreSQL installer from [here](https://www.postgresql.org/download/windows/).
2. Run the installer and follow the instructions.
3. During installation, set a password for the PostgreSQL superuser (default user: `postgres`).
4. Ensure you install pgAdmin (a GUI for PostgreSQL) if needed.
5. After installation, open `pgAdmin` or `psql` and create a new database:
   ```sql
   CREATE DATABASE study_planner;
   ```

### macOS:

1. Install PostgreSQL using Homebrew:
   ```sh
   brew install postgresql
   ```
2. Start PostgreSQL:
   ```sh
   brew services start postgresql
   ```
3. Create a new database:
   ```sh
   createdb study_planner
   ```

### Linux:

1. Install PostgreSQL:
   ```sh
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```
2. Start PostgreSQL service:
   ```sh
   sudo systemctl start postgresql
   ```
3. Switch to the PostgreSQL user and create a database:
   ```sh
   sudo -i -u postgres
   psql
   CREATE DATABASE study_planner;
   \q
   ```

## Project Setup

### 1. Clone the Repository (Optional)

```sh
git clone https://github.com/your-repository/study-planner.git
cd study-planner
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure Environment Variables

1. Create a `.env` file in the root directory.
2. Add the following environment variables:
   ```env
   PORT=3000
   NODE_ENV=development
   SESSION_SECRET=your_secret_key
   JWT_SECRET=your_jwt_secret
   DATABASE_URL=postgres://username:password@localhost:5432/study_planner
   ```
   Replace `username` and `password` with your PostgreSQL credentials.

### 4. Run Database Migrations (If applicable)

```sh
npm run migrate
```

### 5. Start the Server

```sh
npm start
```

The application should now be running at `http://localhost:3000/`.

## Troubleshooting

- If you encounter database connection issues, verify your PostgreSQL service is running.
- Check your `.env` file for correct database credentials.
- Run `npm install` again if dependencies are missing.

Happy coding! 🚀
# study_planner
