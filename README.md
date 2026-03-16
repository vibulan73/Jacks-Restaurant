# Jack's Norwood — Restaurant Website

A full-stack restaurant & pub website built with **React + Spring Boot**.

---

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, React Router v6 |
| Backend  | Spring Boot 3.4.3, Java 21, Spring Security + JWT |
| Database | PostgreSQL |

---

## Project Structure

```
JacksNorwood2/
├── jacks_frontend/   # React + Vite frontend
└── jacks_backend/    # Spring Boot backend
```

---

## Prerequisites

- **Node.js** 18+ and npm
- **Java 21**
- **PostgreSQL** running locally
- **Maven** (or use the included `./mvnw` wrapper)

---

## Getting Started

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE jacksnorwood;
```

---

### 2. Backend Setup

#### Create the `.env` file

```bash
cd jacks_backend
cp .env.example .env
```

Edit `jacks_backend/.env` with your values:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jacksnorwood
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=YourSuperSecretKeyHereMustBeAtLeast256BitsLong1234567890
JWT_EXPIRATION=86400000

CORS_ALLOWED_ORIGINS=http://localhost:5173

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

#### Run the backend

```bash
cd jacks_backend
./mvnw spring-boot:run
```

The backend starts on **http://localhost:8080**

> On first boot, the database is seeded automatically with sample menu items, promotions, events, and an admin user.

---

### 3. Frontend Setup

#### Create the `.env` file

```bash
cd jacks_frontend
cp .env.example .env
```

Edit `jacks_frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_RESTAURANT_NAME=Jack's Norwood
VITE_RESTAURANT_PHONE=(08) 8234 5678
VITE_RESTAURANT_EMAIL=info@jacksnorwood.com.au
VITE_RESTAURANT_ADDRESS=123 The Parade, Norwood SA 5067

# See "Adding a Google Map" section below
VITE_GOOGLE_MAPS_EMBED_URL=
```

#### Install dependencies and run

```bash
cd jacks_frontend
npm install
npm run dev
```

The frontend starts on **http://localhost:5173**

> **Important:** Always restart `npm run dev` after editing `.env` — Vite only reads environment variables at startup.

---

## Adding a Google Map

1. Go to [maps.google.com](https://maps.google.com)
2. Search for your restaurant location
3. Click **Share** → **Embed a map** tab
4. Click **Copy HTML** — you'll see something like:
   ```html
   <iframe src="https://www.google.com/maps/embed?pb=!1m18..." ...></iframe>
   ```
5. Copy **only the URL** inside `src="..."` (not the whole iframe tag)
6. Paste it into `jacks_frontend/.env`:
   ```env
   VITE_GOOGLE_MAPS_EMBED_URL=https://www.google.com/maps/embed?pb=!1m18...
   ```
7. **Restart** the Vite dev server (`npm run dev`)

If no URL is set, the contact page shows a "View on Google Maps" link instead.

---

## Accessing the Admin Dashboard

1. Go to **http://localhost:5173/admin/login**
2. Log in with the default credentials:

   | Username | Password  |
   |----------|-----------|
   | `admin`  | `admin123` |

3. You'll be redirected to the admin dashboard at `/admin`

### Admin Pages

| Page         | URL                        | Description                        |
|--------------|----------------------------|------------------------------------|
| Dashboard    | `/admin`                   | Stats overview                     |
| Menu         | `/admin/menu`              | Add/edit/delete menu items         |
| Promotions   | `/admin/promotions`        | Manage Daily & Special promotions  |
| Events       | `/admin/events`            | Manage upcoming events             |
| Gallery      | `/admin/gallery`           | Manage photo gallery               |
| Reservations | `/admin/reservations`      | View & update reservation status   |
| Messages     | `/admin/messages`          | View contact form submissions      |
| Settings     | `/admin/settings`          | Update social media links          |

> **Security:** Change the default admin password after your first login by updating the database directly or adding a change-password feature.

---

## Social Media Links

Social media links (Facebook, Instagram, TikTok) are managed from the admin panel — no code changes needed.

1. Log in to the admin dashboard
2. Go to **Settings** (`/admin/settings`)
3. Enter your social media profile URLs
4. Click **Save Settings**

Links appear in the website footer. Icons are only shown for platforms that have a URL set.

---

## Environment Variables Reference

### Frontend (`jacks_frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_RESTAURANT_NAME` | Restaurant name |
| `VITE_RESTAURANT_PHONE` | Contact phone number |
| `VITE_RESTAURANT_EMAIL` | Contact email address |
| `VITE_RESTAURANT_ADDRESS` | Physical address |
| `VITE_GOOGLE_MAPS_EMBED_URL` | Google Maps embed src URL |

### Backend (`jacks_backend/.env`)

| Variable | Description |
|----------|-------------|
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_NAME` | Database name |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secret key for JWT signing (min 256 bits) |
| `JWT_EXPIRATION` | Token expiry in milliseconds (default: 86400000 = 24h) |
| `CORS_ALLOWED_ORIGINS` | Frontend origin allowed by CORS |
| `MAIL_HOST` | SMTP host for contact form emails |
| `MAIL_PORT` | SMTP port |
| `MAIL_USERNAME` | SMTP username / sender email |
| `MAIL_PASSWORD` | SMTP password or app password |

---

## Building for Production

### Frontend

```bash
cd jacks_frontend
npm run build
# Output is in jacks_frontend/dist/
```

### Backend

```bash
cd jacks_backend
./mvnw clean package
# JAR is at target/jacks_backend-*.jar
java -jar target/jacks_backend-*.jar
```
