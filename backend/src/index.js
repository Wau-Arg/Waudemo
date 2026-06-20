const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth.routes');
const mascotasRoutes = require('./routes/mascotas.routes');
const serviciosRoutes = require('./routes/servicios.routes');
const prestadoresRoutes = require('./routes/prestadores.routes');
const reservasRoutes = require('./routes/reservas.routes');
const reviewsRoutes = require('./routes/reviews.routes');
const pagosRoutes = require('./routes/pagos.routes');
const adminRoutes = require('./routes/admin.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqueado: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/prestadores', prestadoresRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'WAU API', version: '1.0.0' });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🐾 WAU API corriendo en http://localhost:${PORT}`);
});
