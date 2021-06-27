import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import helmet from 'helmet';
import user from './routes/user.js';
import url from './routes/url.js';
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import passport from 'passport';

const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DB_URL;
const __dirname = path.resolve(path.dirname(''));
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// DB conntection
const mongo_options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
  };
  
  mongoose.connect(DB_URL, mongo_options, (err) => {
      if (err) {return err}
      console.log('###### CONNECTED TO MONGODB ######');
  });
  

const app = express();
app.use(express.json());

app.use(cors({credentials: true, origin: true}));
app.use(helmet());
app.use(morgan('tiny', {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/user', user);
app.use('/url', url);

app.use(express.static('views'));

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}...`);
});