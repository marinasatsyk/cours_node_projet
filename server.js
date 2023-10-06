import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
import route from './routes/routes.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';

// ==========
// App initialization
// ==========

dotenv.config();
const { APP_HOSTNAME, APP_PORT, NODE_ENV, NODE_SESSION_SECRET, MONGO_STRING, MONGO_DB_NAME } = process.env;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set('view engine', 'pug');
app.locals.pretty = NODE_ENV !== 'production'; // Indente correctement le HTML envoyé au client (utile en dev, mais inutile en production)

// ==========
// App middlewares
// ==========

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: "NODE_USER_session",
  secret: NODE_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: `${MONGO_STRING}${MONGO_DB_NAME}`})
}))

app.use(express.urlencoded({extended: false}));
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
})
app.use(flash());
// ==========
// App routers
// ==========

app.use(route);

// ==========
// App start
// ==========

try{
  await mongoose.connect(`${process.env.MONGO_STRING}${process.env.MONGO_DB_NAME}`);
  console.log('✅ Connecté à la base MongoDB')
}catch (err) {
  console.error('Erreur de connexion', err.message)
}


app.listen(APP_PORT, () => {
  console.log(`📞App listening at http://${APP_HOSTNAME}:${APP_PORT}`);
});
