import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import sessionsRouter from './routes/sessions.router.js';
import cartRouter from './routes/cart.router.js';
import productRouter from './routes/product.routes.js';
import ticketRouter from './routes/ticket.routes.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log(' MongoDB conectado'))
  .catch((err) => console.error(' Error de conexión:', err));

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use(passport.initialize());
app.use('/api/sessions', sessionsRouter); 
app.use('/api/cart', cartRouter);
app.use('/api/products', productRouter);
app.use('/api/ticket', ticketRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/home.html')); 
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/products.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/cart.html')); 
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
