import express, { json } from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import pg from 'pg';
import LocalStrategy from 'passport-local';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import multer from 'multer';

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Create a multer instance with the storage engine
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 * 10} });


// need to FIGURE OUT HOW TO UPLOAD FILES TO SAME DATABESE AS THE REST OF THE INFO 
// need to FOIGURE OUT HOW TO RETRIEVE THAT FILE FROM THE DATABASE AND DISPLAY IT ON THE FRONT END
// ALREADY DONE IS THE MIDDLEWARE THAT SAVES THE FILE TO THE UPLOADS FOLDER

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
            const user = result.rows[0]
            bcrypt.compare(password, user.password, (compareErr, isMatch) => {
                if (compareErr) {
                    return done(compareErr);
                }
                if (!isMatch) {
                    return done(null, false);
                }
                return done(null, user);
            
            });
        
        })
    }
));




passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err, result) => {
      if (err) {
        return done(err);
      }
      if (!result.rows.length) {
        return done(null, false);
      }
      req.user = result.rows[0];
      return done(null, result.rows[0]);
    });
});

app.post('/login', passport.authenticate('local', {
failureRedirect: '/new-user'
}),
(req, res) => {
    res.send(req.user);
}
);

  app.get('/cats', (req, res) => {
    pool.query('SELECT * FROM cat_breeds ORDER BY name ASC', (err, result) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        return res.status(200).json(result.rows);
    });
});




const isAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'unauthorized' });
    }
};


app.get('/new-user', isAuth, (req, res) => {
    res.send(req.user);
}
);

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
    if (req.session.user || req.isAuthenticated) {
        next();
    } else {
        console.log('You must be logged in to sell a cat');
    res.status(401).json({message: 'You must be logged in to sell a cat'});}
});

app.post('/sell-cat', upload.single('imageFile'), (req, res) => {
    const { userId, price, gender, DoB, date, breedId, name } = req.body;
    console.log(req.file)
    const imagePath = req.file.path

    // Convert the date value to the desired format (YYYY-MM-DD)
    const DoBConverted = DoB.split('-').reverse().join('-');
    const dobDate = new Date(DoBConverted);
         
    console.log(dobDate)
    pool.query('INSERT INTO cats_for_sale ( user_id, price, gender, date_of_birth, date_for_sale, breed_id, images_path, name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [ userId, price, gender, DoB, date, breedId, imagePath, name], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        return res.status(201).json({ message: 'Cat added successfully' });
    });
});

app.get('/cats-shop', (req, res) => {
    pool.query('SELECT * FROM cats_for_sale  WHERE sold_date IS NULL ORDER BY date_for_sale DESC', (err, result) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        return res.status(200).json(result.rows);
    });
});




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
)
