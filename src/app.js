import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { create } from 'express-handlebars';
import sessionsRouter from './routes/sessions.router.js';
import cartRouter from './routes/cart.router.js';
import productRouter from './routes/product.routes.js';
import ticketRouter from './routes/ticket.routes.js';
import path from 'path';  
import { fileURLToPath } from 'url';

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


const hbs = create({
  extname: '.handlebars', 
  defaultLayout: false,    
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(passport.initialize());
app.use('/api/sessions', sessionsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/products', productRouter);
app.use('/api/ticket', ticketRouter);
app.use(express.static(path.join(__dirname, '../public'))); 
app.get('/', (req, res) => {
  res.render('home'); 
});

app.get('/products', (req, res) => {
  res.render('products'); 
});

app.get('/cart', (req, res) => {
  res.render('cart'); 
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
