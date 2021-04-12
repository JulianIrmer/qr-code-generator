import express from 'express'
import qrcode from 'qrcode';
import bodyParser from 'body-parser';
import os from 'os';
import path from 'path';
import cryptoRandomString from 'crypto-random-string';
import mongoose from 'mongoose';
import URLSchema from './schemas.js';

const PORT = process.env.PORT || 3001;

const app = express();
const __dirname = path.resolve();
app.use(express.json());
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'html');

const DB_URL = 'mongodb+srv://admin:lala1234@cluster0.nbzl7.mongodb.net/QRCodeGenerator?retryWrites=true&w=majority';

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

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/api/generate', async (req, res) => {
    const data = req.body.data;
    const short = await getShortURL(req);
    const code = await qrcode.toDataURL(short.short);
    const url = new URLSchema({id: short.id, short: short.short, url: data});
    url.save();

    res.json({data: code});
});

app.get('/open', (req, res) => {
    const id = req.query.id;
    URLSchema.findOne({id: id}, (err, doc) => {
        if (err) res.send(err);
        res.redirect(doc.url);
    });
});

async function getShortURL(req) {
    const prefix = `https://${req.headers.host}/open/?id=`
    const id = cryptoRandomString({length: 15, type: 'url-safe'});

    const result = {
        id: id,
        short: prefix + id
    };

    return result;
}

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}...`);
});