import express, { json } from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import pg from 'pg';
import LocalStrategy from 'passport-local';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import axios from 'axios';

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

// app.get('https://api.thecatapi.com/v1/breeds', (req, res, next) => {
// then((response) => { 
//     console.log('that worked') 
//     response.json().then((data) => {
//         data.forEach((cat) => {
//             console.log(cat)
//             pool.query('INSERT INTO cat_breeds (name, description, origin, temperament, life_span, adaptability, affection_level, child_friendly, grooming, intelligence, health_issues, social_needs, stranger_friendly, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12,$13,$14)', [cat.name, cat.description, cat.origin, cat.temperament, cat.life_span, cat.adaptability, cat.affection_level, cat.child_friendly, cat.grooming, cat.intelligence, cat.health_issues, cat.social_needs, cat.stranger_friendly, cat.image.url], (err, result) => {
//                 if (err) {
//                     return res.status(500).json({ message: err });
//                 }
//                 return res.status(201).json({ message: 'Cats imported successfully' });
//             });
//         });
//     });
// })
// .catch((err) => {
//     console.log('that did not work')
//     console.log(err)
// })
// next();
// });

// const insertQuery = 'INSERT INTO cat_breeds (name, description, origin, temperament, life_span, adaptability, affection_level, child_friendly, grooming, intelligence, health_issues, social_needs, stranger_friendly, reference_image_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12,$13,$14)'
// const cat_api = 'live_bVPWd2n9uTkUEXB1i6Cbzi678c7U2mUHSO1SLfv55x5sU64OUBS6iWYh4CJV1XRi'
// // Make an async function to fetch the data and save it to the database
// async function fetchData() {
//     try {
//       // Make a GET request to the API endpoint of a website
//       const response = await axios.get('https://api.thecatapi.com/v1/breeds', {
//         headers: {
//             'x-api-key': cat_api
//       }
//       });
//       // Load the JSON data into your database
//       const cats = response.data.slice(60);
      
//       cats.forEach(async (cat) => {
//         console.log(cat.name)
//         await pool.query(insertQuery, [cat.name, cat.description, cat.origin, cat.temperament, cat.life_span, cat.adaptability, cat.affection_level, cat.child_friendly, cat.grooming, cat.intelligence, cat.health_issues, cat.social_needs, cat.stranger_friendly, cat.reference_image_id])
//       })
//         console.log('Data saved to database');
//       // End the PostgreSQL pool and exit the application after the data is saved to the database
//       await pool.end();
//       process.exit(0);
//     } catch (error) {
//       console.error(error);
//       process.exit(1);
//     }
//   }
  
//   fetchData();

app.get('/cats', (req, res) => {
    pool.query('SELECT * FROM cat_breeds ORDER BY name ASC', (err, result) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        return res.status(200).json(result.rows);
    });
});



app.post('/login', passport.authenticate('local', {
    failureRedirect: '/new-user'
    }),
    (req, res) => {
        res.send(req.user);
    }
);

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'unauthorized' });
    }
};


app.get('/new-user', isAuthenticated, (req, res) => {
    console.log("a");
    res.send(req.user);
}
);


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

app.use('/sell-cat', (req, res, next) => {
    if (req.user) {
        return next();
    } else {
        console.log(req.user)
        console.log('You must be logged in to sell a cat');
    res.status(401).json({message: 'You must be logged in to sell a cat'});}
});

app.post('/sell-cat', (req, res) => {
    console.log('sell cat')
    const { price, gender, age, breedId, imagesPath, name } = req.body;
    pool.query('INSERT INTO cats_for_sale ( price, gender, age, breed_id, images_path, name) VALUES ($1, $2, $3, $4, $5, $6)', [ price, gender, age, breedId, imagesPath, name], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        return res.status(201).json({ message: 'Cat added successfully' });
    });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
)
