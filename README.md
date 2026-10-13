# Bank UI — Login & Register (BANK-101)

React + Vite + Tailwind CSS v4.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Backend URL

Edit `.env` (`VITE_API_BASE_URL`, default `http://localhost:8080`) and restart `npm run dev`.
Your backend must allow CORS from `http://localhost:5173`.

## Routes

- `/login`     – Login (POST /api/auth/login)
- `/register`  – Register (POST /api/auth/register)
- `/dashboard` – placeholder, requires a saved JWT

## Structure

```
src/
  api/authApi.js          API calls + session helpers
  components/Login.jsx
  components/Register.jsx
  components/AuthLayout.jsx
  components/FormField.jsx
  App.jsx  main.jsx  index.css
```

## Build

```bash
npm run build
npm run preview
```
