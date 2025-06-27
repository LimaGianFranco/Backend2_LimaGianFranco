import express from 'express';
import './config/passport.config.js';
import passport from 'passport';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { create } from 'express-handlebars';
import usersRouter from './routes/users.router.js'; 

dotenv.config();
await mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => console.error('❌ Error de conexión:', err));

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize()); 
app.use((req, res, next) => {
  console.log(`🛰️ Petición recibida: ${req.method} ${req.url}`);
  next();
});

app.get('/ping', (req, res) => {
  console.log('/ping funciona');
  res.send('pong');
});
const hbs = create({
  extname: '.handlebars',
  defaultLayout: false,
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views');
app.use('/api/users', usersRouter);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
