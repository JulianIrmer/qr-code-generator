import express from 'express'
import qrcode from 'qrcode';
import cryptoRandomString from 'crypto-random-string';
import mongoose from 'mongoose';
import cors from 'cors';
import URLSchema from './schemas.js';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cors());

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
    res.send('API RUNNING...');
});

app.post('/api/generate', async (req, res) => {
    try {
        const data = req.body.data;
        const short = await getShortURL(req);
        const code = await qrcode.toDataURL(short.short);
        const url = new URLSchema({id: short.id, short: short.short, url: data});
        url.save();
    
        res.json({data: code});
    } catch (error) {
        res.send(error);
    }
});

app.get('/api/open', (req, res) => {
    try {
        const id = req.query.id;
        URLSchema.findOne({id: id}, (err, doc) => {
            if (err) {
                res.send(err);
            } else  if (doc) {
                console.log(doc.url);
                res.json({data: doc.url});
            } else {
                console.log('Nothing found');
                res.send({data: 'Nothing found'});
            }
        });
    } catch (error) {
        res.send(error);
    }
});

async function getShortURL(req) {
    const prefix = `https://qr-code.me/?id=`
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