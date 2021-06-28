import express from 'express';
import qrcode from 'qrcode';
import cryptoRandomString from 'crypto-random-string';
import URLSchema from '../schemas/UrlSchema.js';
import UserSchema from '../schemas/UserSchema.js';
import { authenticate } from '../helpers/util.js';
const router = express.Router();

router.post('/api/generate', async (req, res) => {
    try {
        const data = req.body.data;
        const short = await getShortURL();
        const code = await qrcode.toDataURL(short.short);
        const email = req.user.email ? req.user.email : null;

        const url = new URLSchema({
            id: short.id, 
            short: short.short, 
            url: data,
            visits: 0,
            date: new Date().toLocaleString(),
            code: code
        });
        
        if (req.user.email) {
            const user = await UserSchema.findOne({email: email});
            url.owner = user._id;
            user.urls.push(url._id);
            user.markModified('urls');
            user.save();
        }

        url.save();
    
        res.json({data: code});
    } catch (error) {
        console.log(error);
        res.json({success: false, error: error});
    }
});

router.get('/api/open', (req, res) => {
    try {
        const id = req.query.id;
        URLSchema.findOne({id: id}, (err, doc) => {
            if (err) {
                res.send(err);
            } else  if (doc) {
                console.log(doc.url);
                res.redirect(doc.url);
            } else {
                console.log('Nothing found');
                res.redirect('/');
            }
        });
    } catch (error) {
        res.json({success: false, error: error});
    }
});

router.get('/api/getuserdata', authenticate, async (req, res) => {
    try {
        const user = await UserSchema.findOne({email: req.user.email});
        const urls = [];

        for (let id of user.urls) {
            const url = await URLSchema.findOne({_id: id});
            urls.push(url);
        }

        res.json({success: true, data: urls});
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

router.get('/api/delete', authenticate, async (req, res) => {
    try {
        const email = req.user.email;
        const id = req.query.id;
        const user = await UserSchema.findOne({email: email});

        for (let i = user.urls.length - 1; i >= 0; i--) {
            if (user.urls[i]._id.toString() === id) {
                user.urls.splice(i, 1);
                user.markModified('urls');
            }
        }
    
        user.save();
        URLSchema.findOneAndDelete({_id: id}, (err) => {
            if (err) console.error(err);
        });
        res.json({success: true, message: 'Successfully deleted!'});
    } catch (error) {
        console.log(error);
        res.json({success: false, error: error});
    }
});

router.post('/api/update', authenticate, async (req, res) => {
    try {
        const {id, value} = req.body;
        const url = await URLSchema.findOne({_id: id});
        url.url = value;
        url.save();
        
    } catch (error) {
        console.log(error);
    }
});

async function getShortURL() {
    // const prefix = `https://qr-code.me/?id=`;
    const prefix = `https://link2qr.herokuapp.com/url/api/open?id=`;
    // const prefix = `http://localhost:3001/?id=`;
    const id = cryptoRandomString({length: 15, type: 'url-safe'});

    const result = {
        id: id,
        short: prefix + id
    };

    return result;
}

export default router;

