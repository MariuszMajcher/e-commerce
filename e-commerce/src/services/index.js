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
app.set('view engine', 'ejs');
dotenv.config();

const dbHost = process.env.HOST;
const dbPort = process.env.PORT;
const dbUser = process.env.USER;
const dbPassword = process.env.PASSWORD;
const dbName = process.env.NAME;
const dbApiSecret = process.env.API_SECRET;
const port = process.env.SERVER_PORT || 3000;

const { Pool } = pg;

const sessionConfig = { 
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
    sameSite:true,
    secret: dbApiSecret
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

app.use(express.json());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy(
    (username, password, done) => {
        
        pool.query('SELECT * FROM users WHERE email = $1', [username], (err, result) => {
            if (err) {
                return done(err);
            }
            if (!result.rows.length) {
                return done(null, false);
            }
            bcrypt.compare(password, result.rows[0].password, (err, isValid) => {
                if (err) {
                    return done(err);
                }
                if (!isValid) {
                    return done(null, false);
                }
                console.log(result.rows[0]);
                return done(null, result.rows[0]);
            });
        });
        
    }
));

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/new-user'
    }),
    (req, res) => {
        res.send(req.user);
    }
    );

app.get('/new-user', (req, res) => {
    res.json('new user');
});


passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err, result) => {
      if (err) {
        return done(err);
      }
      if (!result.rows.length) {
        return done(null, false);
      }
      return done(null, result.rows[0]);
    });
  });



app.post('/new-user', (req, res) => {
    const { email, password, address, firstName, lastName, favouriteBreed } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        pool.query('INSERT INTO users (email, password, address, first_name, last_name, favourite_breed) VALUES ($1, $2, $3, $4, $5, $6)', [email, hash, address, firstName, lastName, favouriteBreed], (err, result) => {  
            if (err) {
                return res.status(500).json({ message: err });
            }
            return res.status(201).json({ message: 'User created successfully' });
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
)
