import express, { json } from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import pg from 'pg';
import LocalStrategy from 'passport-local';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import multer from 'multer';



import Stripe from 'stripe'


const app = express();
app.set('view engine', 'ejs');
dotenv.config();

const stripe = new Stripe('sk_test_51NCFU5J7Crgvv5hL9LtuRxkrazAhLSa6YG2D5Jg0W6PUhRJkcCrh6n3YHJAW3o6cHYy2osDhZNgVPjLzAklVZOrU00kbYxW1fK')

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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
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
    // Fetch messages for the logged-in user from the "messages" table
    const userId = req.user.id;
    pool.query('SELECT * FROM messages WHERE receiver_id = $1', [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        // Exclude the password field from the response
        const { password, ...userWithoutPassword } = req.user;
        // Include the fetched messages in the response
        const userWithMessages = {
            ...userWithoutPassword,
            messages: result.rows
        };
        res.send(userWithMessages);
    });
});

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
    let emailSmall = email.toLowerCase();

    pool.query('SELECT * FROM users WHERE email = $1', [emailSmall], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        if (result.rows.length) {
            return res.status(409).json({ message: 'Email already exists' });
        } else { bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ message: err });
            }

            pool.query(
                'INSERT INTO users (email, password, address, first_name, last_name, favourite_breed) VALUES ($1, $2, $3, $4, $5, $6)',
                [emailSmall, hash, address, firstName, lastName, favouriteBreed],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: err });
                    }
                    return res.status(201).json({ message: 'User created successfully' });
                }
            );
        });
    }});
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
    console.log(DoB)
    // console.log(dobDate)
    pool.query('INSERT INTO cats_for_sale ( user_id, price, gender, date_of_birth, date_for_sale, breed_id, images_path, name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [ userId, price, gender, DoB, date, breedId, imagePath, name], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        return res.status(201).json({ message: 'Cat added successfully' });
    });
});



// REALLY NEED TO MAKE CHANGES TO THE COLUMN NAMES, IT IS VERY CONFUSING NOW



app.get('/messages/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM messages WHERE receiver_id = $1', [ id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        return res.status(200).json(result.rows);
    });
});

app.post('/messages/:id', async (req, res) => {
    try {
      const email = req.params.id;
      const {  message, userId, userName, userLast, userEmail } = req.body;
      const date = new Date();
      let receiverId;
  
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length > 0) {
        receiverId = result.rows[0].id;
        console.log(receiverId)
        await pool.query('INSERT INTO messages (sender_id, sender_name, sender_surname, sender_email, message, date_of_message, receiver_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [userId, userName, userLast, userEmail, message, date, receiverId]);
        return res.status(200).json({ message: 'Message sent' });
      } else {
        return res.status(404).json({ message: 'Receiver not found' });
      }
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  });


app.patch('/messages/:id', (req, res) => {
    const { id } = req.params;
    pool.query('UPDATE messages SET message_read = TRUE WHERE id = $1', [ id], (error, result) => {
        if (error) {
            return res.status(500).json({ message: error });
        }
        return res.status(200).json({ message: 'Message marked as read' });
    });
});

app.patch('/message/:id', (req, res) => {
    const id = req.params.id
    const date = new Date()
    const {  sender_id,  sender_name, sender_surname, receiver_id, cat_id, asked_price} = req.body.message
    const sale_agreed = true
    const message = 'Sale agreed please click on the link to continue with the payement'
    // now the sender will become receiver and receiver the sender
    pool.query('INSERT INTO messages (sender_id, sender_name, sender_surname, receiver_id, cat_id, asked_price, date_of_message, sale_agreed, message) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [receiver_id,  sender_name, sender_surname, sender_id, cat_id, asked_price, date, sale_agreed, message],
    (error, result) => {
        if(error) {
            console.log(error)
        }
        // // need to change the bool of sale_agreed separatly (possibly would not work if would try to assign a value)
        // pool.query('UPDATE message')
            pool.query('UPDATE messages SET sale_agreed = TRUE WHERE id = $1', [id], (error, result) => {
                if(error) {
                    return res.status(500).json({message: error})
                }
                pool.query('SELECT * FROM messages WHERE sender_id = $1', [sender_id], (error, results) => {
                    if (error) {
                      console.log(error);
                      return res.status(500).json({ message: error });
                    }
                    res.status(200).send(results.rows);
                  });
            })
    })
})

// Might need to create a middelware that will do an message update each time the request from client is sent


app.get('/products', (req, res) => {
    pool.query('SELECT item_id, item_name, price FROM Items UNION SELECT toy_id, item_name, price FROM Toys UNION SELECT food_id, item_name, price FROM Food UNION SELECT bed_id, item_name, price FROM Bed UNION SELECT litter_id, item_name, price  FROM Litter', (err, result) => {
        if(err) {   
            return res.status(500).json({ message: err });
            }
            return res.status(200).json(result.rows);
        });
    });

app.get('/cat/:id', (req, res) => {
    const catId = req.params.id
    pool.query('SELECT user_id FROM cats_for_sale WHERE id = $1', [catId], (error, result) => {
        if(error) {
            console.log(error)
        }
        res.status(200).json({id: result.rows[0]})
    })
})

app.get('/cats-shop', (req, res) => {
    pool.query('SELECT * FROM cats_for_sale  WHERE sold_date IS NULL ORDER BY date_for_sale DESC', (err, result) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        return res.status(200).json(result.rows);
    });
});

app.post('/cats-shop/:id', (req, res) => {
    const { ownerId, message, price, sender, senderName, senderSurname, senderEmail } = req.body;
    const catId = req.params.id;
    const date = new Date();
  
    pool.query('INSERT INTO messages (receiver_id, cat_id, message, asked_price, date_of_message, sender_id, sender_name, sender_surname, sender_email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [ownerId, catId, message, price, date, sender, senderName, senderSurname, senderEmail], (err, result) => {
      if (err) {
        return res.status(500).json({ message: err });
      }
      return res.status(200).json({message: 'Message sent'})
    });
  });

    // WILL NEED TO REPLACE GENERIC ERRORS WITH MORE ADEQUATE ONES
app.delete('/cats-shop/:id', (req, res) => {
    const id = req.params.id
    const userId = req.body.id
    pool.query('DELETE FROM messages WHERE id = $1', [id], (err, result) => {
        if (err) {
            return res.status(500).json({message: err})
        }
        pool.query('SELECT * FROM messages WHERE id = $1',[userId], (err, result) => {
            if(err) {
                return res.status(500).json({message: err})
            }
            return res.status(202).json({
                                        message: 'Message deleted sucessfuly',
                                        data: result.rows    
                                    })
        })
    
    })
})

// PAYMENT 
app.post('/api/create-payment-intent', async (req, res) => {
    const { amount, cat_id, cat_owner, buyer_id } = req.body;
    const date = new Date();
    console.log(buyer_id)
    try {
      // Update the sold_date in the cats_for_sale table
      await pool.query('UPDATE cats_for_sale SET sold_date = $1 WHERE id = $2', [date, cat_id]);
  
      let message;
      if (amount == 0) {
        message = 'Your cat has been successfully accepted to their new home. Thank you for your donation!';
      } else {
        message = `Your cat has been successfully sold for $${amount}. Congratulations!`;
      }
  
      // Insert a new message into the messages table
      await pool.query('INSERT INTO messages (sender_id, receiver_id, cat_id, message, date_of_message) VALUES ($1, $2, $3, $4, $5)', [buyer_id, cat_owner, cat_id, message, date]);
  
      // Create a PaymentIntent object
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount + 100,
        currency: 'usd'
      });
  
      // Return the client secret to the client-side
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creating PaymentIntent:', error.message);
      res.status(500).json({ error: 'Failed to create PaymentIntent' });
    }
  });
    


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });

// will start styling it and figuring out how