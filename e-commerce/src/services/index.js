import express, { json } from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import pg from 'pg';
import LocalStrategy from 'passport-local';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { redirect } from 'react-router-dom';

const app = express();

dotenv.config();

const dbHost = process.env.HOST;
const dbPort = process.env.PORT;
const dbUser = process.env.USER;
const dbPassword = process.env.PASSWORD;
const dbName = process.env.NAME;
const dbApiSecret = process.env.API_SECRET;
const port = process.env.PORT || 3000;

const { Pool } = pg;

const sessionConfig = { 
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
    sameSite:true
};


const pool = new Pool({
    host: dbHost,
    port: dbPort,
    password: dbPassword,
    user: dbUser,
    database: dbName
});


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(session(sessionConfig));
app.use(passport.initialize());

app.use(passport.session());
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new LocalStrategy(
    (username, password, done) => {
        pool.query('SELECT * FROM users WHERE email = $1', [username], (err, result) => {
            if (err) {
                return done(err);
            }
            if (!result.rows.length) {
                return done(null, false);
            }
            bcrypt.compare(password, result.rows[0].password, (err, res) => {
                if (err) {
                    return done(err);
                }
                if (!res) {
                    return done(null, false);
                }
                return done(null, result.rows[0]);
            });
        });
    }
));

app.use(express.json());

app.get('/login', (req, res) => {
    const { email, password } = req.query;
    
    passport.authenticate('local', {failureRedirect: '/login', successRedirect: '/cat-shop'},(err, user) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: err });
            }
            return res.status(200).json({ message: 'Logged in successfully' });
        });
    }
);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
)
