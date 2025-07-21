import express from 'express';
import './config/passport.config.js';
import passport from 'passport';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { create } from 'express-handlebars';
import sessionsRouter from './routes/sessions.router.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => console.error('❌ Error de conexión:', err));

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

const hbs = create({
  extname: '.handlebars',
  defaultLayout: false,
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.get('/', (req, res) => {
  res.render('home');
});

app.use('/api/sessions', sessionsRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
