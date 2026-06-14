# 🐾 WAU — App de servicios para mascotas

MVP de plataforma tipo Rover para Argentina. Conecta dueños de mascotas con prestadores de servicios (paseos, guardería, hospedaje y adiestramiento).

## Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL + Prisma ORM
- **Auth:** JWT (jsonwebtoken + bcryptjs)

## Estructura del proyecto

```
WAU/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        # Modelos de BD
│   └── src/
│       ├── controllers/
│       │   └── auth.controller.js
│       ├── middleware/
│       │   ├── auth.middleware.js
│       │   └── errorHandler.js
│       ├── routes/
│       │   └── auth.routes.js
│       └── index.js             # Entrada del servidor
├── frontend/
│   └── src/
│       ├── components/
│       │   └── Navbar.jsx
│       ├── context/
│       │   └── AuthContext.jsx  # Estado global de autenticación
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── Dashboard.jsx
│       ├── services/
│       │   ├── api.js           # Axios con interceptores JWT
│       │   └── auth.service.js
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
└── README.md
```

## Cómo correr el proyecto

### Requisitos previos
- Node.js 18+
- PostgreSQL corriendo localmente (o una URL de conexión)

---

### 1. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env
```

Editá el `.env` con tu configuración:

```env
DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/wau_db"
JWT_SECRET="un_secreto_largo_y_seguro"
JWT_EXPIRES_IN="7d"
PORT=3001
```

```bash
# Generar el cliente de Prisma
npm run db:generate

# Crear las tablas en la base de datos
npm run db:push

# Iniciar el servidor en modo desarrollo
npm run dev
```

El servidor queda en: `http://localhost:3001`

---

### 2. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

El frontend queda en: `http://localhost:5173`

---

## API Endpoints

### Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Datos del usuario actual (requiere token) |
| GET | `/api/health` | Health check |

#### POST /api/auth/register

```json
{
  "nombre": "Juan García",
  "email": "juan@example.com",
  "password": "secreto123",
  "rol": "DUENO",
  "ubicacion": "Buenos Aires, CABA",
  "telefono": "+54 11 1234-5678"
}
```

Respuesta:
```json
{
  "usuario": { "id": 1, "nombre": "Juan García", "email": "...", "rol": "DUENO", ... },
  "token": "eyJhbG..."
}
```

#### POST /api/auth/login

```json
{
  "email": "juan@example.com",
  "password": "secreto123"
}
```

#### GET /api/auth/me

Header: `Authorization: Bearer <token>`

---

## Próximos pasos sugeridos

- [ ] CRUD de mascotas (`/api/mascotas`)
- [ ] CRUD de servicios para prestadores (`/api/servicios`)
- [ ] Búsqueda de prestadores por tipo de servicio y ubicación
- [ ] Sistema de reservas (`/api/reservas`)
- [ ] Sistema de reviews (`/api/reviews`)
- [ ] Subida de imágenes (Cloudinary o S3)
- [ ] Notificaciones por email (Resend o Nodemailer)
- [ ] Deploy: Railway (backend + BD) + Vercel (frontend)
