import express from 'express';
import path from 'path';
import UserSchema from '../schemas/userSchema.js';
import passport from 'passport';
import passportGoogleOauth2 from 'passport-google-oauth2';
const GoogleStrategy = passportGoogleOauth2.Strategy;
import dotenv from 'dotenv';
import { authenticate } from '../helpers/util.js';
import UrlSchema from '../schemas/UrlSchema.js';
dotenv.config();

const __dirname = path.resolve(path.dirname(''));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
        done(null, user);
});

passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'https://link2qr.herokuapp.com/user/google/callback',
        passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
        UserSchema.findOne({ email: profile.email }, function(err, user) {//See if a User already exists with the Facebook ID
            console.log('hello');
            if(err) {
                console.log(err);
            }
            
            if (user) {
                done(null, user);
            } else {
                const user = new UserSchema({
                    email: profile.email,
                    urls: []
                });

                user.save(function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("saving user ...");
                        done(null, user);
                    }
                });
            }
        });
    }
));

const router = express.Router();

router.get('/failed', (req, res) => {
    res.json({success: false});
});

router.get('/success', (req, res) => {
    res.redirect('/');
});

router.get('/login', passport.authenticate('google', { scope:['email', 'profile'] }));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed',
    }),
    function (req, res) {
        console.log(req.user);
        res.redirect('/user/success');
    }
);

router.get('/overview', authenticate, async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '/views/overview.html'));
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

export default router;